/**
 * WorkSpaceBoardView — Soft Minimal Brand Theme
 * primary: #d25564 (rose-red)
 * secondary: #3e3e55 (deep navy-slate)
 * ternary: #ffd788 (warm gold)
 *
 * Install dependencies:
 * npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-icons
 */
import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FaRegClock,
  FaCheckCircle,
  FaPlus,
  FaGripVertical,
} from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { axiosInstance } from "../../../api/axios";
import {
  ADD_WORKSPACE_TASK_URL,
  DELETE_WORKSPACE_TASK_URL,
  GET_WORKSPACE_FULL_DETAILS_BY_ID_URL,
  RENAME_WORKSPACE_URL,
  UPDATE_WORKSPACE_TASK_POSITION_URL, // e.g. PUT /workspace/task/position
} from "../../../api/api_routes";
import toast from "react-hot-toast";
import WorkspaceModeBadge from "./WorkspaceModeBadge";
import DeleteConfirmModal from "../../../reusable/DeleteConfirmModal";

/* ─── Brand tokens ──────────────────────────────────────────────── */
const BRAND = {
  primary: "#d25564",
  secondary: "#3e3e55",
  ternary: "#ffd788",
};

/* ─── Column style config (cycled for dynamic columns) ─────────── */
const COLUMN_STYLE_PRESETS = [
  {
    accent: BRAND?.secondary,
    accentLight: "rgba(62,62,85,0.06)",
    accentBorder: "rgba(62,62,85,0.13)",
    colBg: "#f7f7fb",
    emptyDot: "rgba(62,62,85,0.15)",
    Icon: FaRegClock,
  },
  {
    accent: "#c3c079",
    accentLight: "#f2f1e4",
    accentBorder: "rgba(62,62,85,0.13)",
    colBg: "#f7f7fb",
    emptyDot: "rgba(62,62,85,0.15)",
    Icon: MdOutlinePendingActions,
  },
  {
    accent: "green",
    accentLight: "#d8f4e5",
    accentBorder: "rgba(62,62,85,0.13)",
    colBg: "#f7f7fb",
    emptyDot: "rgba(62,62,85,0.15)",
    Icon: FaCheckCircle,
  },
];

const buildStyledColumn = (apiCol, index) => {
  const preset = COLUMN_STYLE_PRESETS[index % COLUMN_STYLE_PRESETS.length];
  return {
    ...preset,
    id: String(apiCol.workspace_column_id),
    label: apiCol.column_name,
    columnPosition: apiCol.column_position,
  };
};

const PRIORITIES = ["High", "Medium", "Low"];
const PRIORITY = {
  High: { color: "#c0394a", bg: "rgba(210,85,100,0.09)", dot: "#d25564" },
  Medium: { color: "#3e3e55", bg: "rgba(62,62,85,0.09)", dot: "#3e3e55" },
  Low: { color: "#9a7a30", bg: "rgba(255,215,136,0.28)", dot: "#c9a030" },
};
const PRIORITY_ID_MAP = { High: 1, Medium: 2, Low: 3 };

const mapPriority = (priorityId) => {
  switch (priorityId) {
    case 1:
      return "High";
    case 2:
      return "Medium";
    case 3:
      return "Low";
    default:
      return "Medium";
  }
};

/* ─── Position helpers ──────────────────────────────────────────── */
const GAP = 1000; // spacing between task positions

/**
 * Calculates the midpoint position between two neighbors.
 *
 * | Scenario              | prevPos | nextPos | result              |
 * |-----------------------|---------|---------|---------------------|
 * | Only item in column   | null    | null    | GAP (1000)          |
 * | Dropped at top        | null    | 2000    | 1000  (2000 / 2)    |
 * | Dropped at bottom     | 5000    | null    | 6000  (5000 + GAP)  |
 * | Dropped between items | 2000    | 3000    | 2500  (midpoint)    |
 */
const calcNewPosition = (prevPos, nextPos) => {
  if (prevPos === null && nextPos === null) return GAP;
  if (prevPos === null) return nextPos / 2;
  if (nextPos === null) return prevPos + GAP;
  return (prevPos + nextPos) / 2;
};

/**
 * Re-indexes all tasks in a column with clean GAP spacing.
 * Called when midpoint gap shrinks below 1 (too many reorders).
 * Returns [{ id, task_position }] for every task in the column.
 */
const reindexColumn = (colTasks) =>
  colTasks.map((t, i) => ({ id: t.id, task_position: (i + 1) * GAP }));

/* ─── TaskCard ──────────────────────────────────────────────────── */
function TaskCard({ task, overlay = false, onDelete }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletionWorkspaceTaskId, setDeletionWorkspaceTaskId] = useState(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const p = PRIORITY[task.priority] ?? PRIORITY.Medium;

  const inner = (
    <div
      className="rounded-2xl p-3 flex flex-col gap-2 select-none group"
      style={{
        background: "#fff",
        border: "1px solid rgba(62,62,85,0.08)",
        boxShadow: overlay
          ? "0 12px 40px rgba(62,62,85,0.18)"
          : "0 1px 6px rgba(62,62,85,0.05)",
        opacity: isDragging ? 0.35 : 1,
        cursor: overlay ? "grabbing" : "default",
      }}
    >
      <div className="flex items-start gap-">
        <span
          {...listeners}
          {...attributes}
          className="mt-0.5 shrink-0 cursor-grab active:cursor-grabbing transition-colors"
          style={{ color: "rgba(62,62,85,0.2)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(62,62,85,0.5)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(62,62,85,0.2)")
          }
        >
          <FaGripVertical size={11} />
        </span>
        <p
          className="text-[13px] font-semibold leading-snug flex-1 first-letter:capitalize pl-2"
          style={{ color: BRAND?.secondary }}
        >
          {task.title}
        </p>
      </div>
      <div className="flex items-center gap-1 justify-between px-3">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
          style={{ color: p.color, background: p.bg }}
        >
          {task.priority}
        </span>
        <div>
          <span
            onClick={() => {
              setDeletionWorkspaceTaskId(task?.id);
              setIsDeleteOpen(true);
            }}
            className="text-[10px] hidden group-hover:block cursor-pointer px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-full"
          >
            Delete
          </span>
        </div>
      </div>
    </div>
  );

  const handleDeleteWorkSpaceTask = async () => {
    if (!deletionWorkspaceTaskId) {
      toast.error("Can't delete task at the moment");
      return;
    }
    onDelete(deletionWorkspaceTaskId);

    try {
      console.log(deletionWorkspaceTaskId);
      const payload = {
        WorkspaceTaskId: +deletionWorkspaceTaskId,
      };
      const res = await axiosInstance.post(DELETE_WORKSPACE_TASK_URL, payload);
      console.log(res);
      if (res?.data?.success == true && res?.data?.status == "DELETED") {
        toast.success("Task deleted successful");
      }
    } catch (error) {
      console.error("Can't delete task at the moment", error);
      toast.error("Can't delete task at the moment");
    } finally {
      setDeletionWorkspaceTaskId(null);
      setIsDeleteOpen(false);
    }
  };

  if (overlay) return inner;
  return (
    <div ref={setNodeRef} style={style}>
      {inner}

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => handleDeleteWorkSpaceTask()}
        title="Delete Task"
        description="This task will be permanently removed."
      />
    </div>
  );
}

/* ─── AddForm ───────────────────────────────────────────────────── */
function AddForm({ col, onAdd, onCancel }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), priority);
  };

  return (
    <div
      className="rounded-2xl p-3 flex flex-col gap-2"
      style={{
        background: "#fff",
        border: `1px solid ${col?.accentBorder ?? "rgba(62,62,85,0.13)"}`,
        boxShadow: "0 2px 12px rgba(62,62,85,0.07)",
      }}
    >
      <textarea
        autoFocus
        rows={2}
        placeholder="Task title…"
        value={title}
        maxLength={80}
        minLength={4}
        onChange={(e) => {
          const value = e.target.value;

          const formatted = value.replace(/(^\s*\w|(?<=\.)\s*\w)/g, (char) =>
            char.toUpperCase(),
          );

          setTitle(formatted);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
          if (e.key === "Escape") onCancel();
        }}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] resize-none focus:outline-none placeholder-slate-300"
      />
      <div className="inline-flex gap-1">
        {PRIORITIES.map((level) => {
          const isActive = priority === level;
          const p = PRIORITY[level];
          return (
            <button
              key={level}
              onClick={() => setPriority(level)}
              className="px-3 py-1 text-[11px] rounded-lg border cursor-pointer transition-all duration-150 flex items-center gap-1"
              style={{
                background: isActive ? p.bg : "transparent",
                color: isActive ? p.color : "#64748b",
                borderColor: isActive ? p.color : "#e2e8f0",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {level}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 text-[11px] justify-center my-4">
        <button
          onClick={submit}
          className="rounded-xl px-3.5 py-1.5 font-bold text-white hover:opacity-85 transition-opacity cursor-pointer"
          style={{ background: col?.accent ?? BRAND?.secondary }}
        >
          Add task
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl p-1.5 transition-colors text-slate-600 border-slate-200 border px-3 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─── Column ────────────────────────────────────────────────────── */
function Column({
  col,
  tasks,
  isOver,
  addingIn,
  setAddingIn,
  onAdd,
  onDelete,
}) {
  const safeTasks = tasks ?? [];
  const ids = safeTasks.map((t) => t.id);
  const isEmpty = safeTasks.length === 0 && addingIn !== col?.id;
  const { setNodeRef: setDropRef } = useDroppable({ id: col?.id });

  return (
    <div className="flex  flex-col group rounded-xl overflow-hidden transition-all duration-200 bg-slate-50/60">
      {/* <div className="h-0.75 w-full bg-slate-300/80" 
      // style={{ background: col?.accent, color: col?.accent }}
      /> */}

      {/* Header */}
      <div className="flex  items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span
            className="flex items-center justify-center w-6 h-6 rounded-lg"
            // style={{ background: col?.accentLight }}
          >
            {col?.Icon && <col.Icon size={12} style={{ color: col?.accent }} />}
          </span>
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: col?.accent }}
          >
            {col?.label}
          </span>
          <span
            className="rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-black bg-slate-50"
            style={{ background: col?.accentLight, color: col?.accent }}
          >
            {safeTasks.length}
          </span>
        </div>
        
        <button
          onClick={() => setAddingIn(col?.id)}
          className="w-7 h-7 flex items-center invisible group-hover:visible cursor-pointer justify-center rounded-xl transition-all hover:scale-105 bg-slate-50 hover:bg-slate-100"
          // style={{ background: col?.accentLight, color: col?.accent }}
          title="Add task"
        >
          <FaPlus size={9} />
        </button>
      </div>

      {/* Cards */}
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div
          ref={setDropRef}
          className="px-3 pb-2 flex flex-col gap-2 flex-1 transition-all duration-200"
          style={{ minHeight: isEmpty ? "130px" : "60px" }}
        >
          {isEmpty ? (
            <div
              className="flex-1 flex flex-col items-center justify-center rounded-2xl border-dashed border-2 py-8 gap-2 transition-all duration-200"
              style={{
                borderColor: isOver
                  ? (col?.accent ?? BRAND?.secondary) + "60"
                  : col?.emptyDot,
                background: isOver ? col?.accentLight : "transparent",
              }}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border-dashed border border-slate-300">
                {isOver ? (
                  <span style={{ color: col?.accent, fontSize: 14 }}>↓</span>
                ) : (
                  <span style={{ color: "rgba(62,62,85,0.25)", fontSize: 14 }}>
                    +
                  </span>
                )}
              </span>
              <p
                className="text-[11px] font-semibold"
                style={{ color: isOver ? col?.accent : "rgba(62,62,85,0.35)" }}
              >
                {isOver ? "Drop here" : "No tasks yet"}
              </p>
              {!isOver && (
                <p
                  className="text-[10px]"
                  style={{ color: "rgba(62,62,85,0.25)" }}
                >
                  Add one below or drag a card in
                </p>
              )}
            </div>
          ) : (
            safeTasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={onDelete} />
            ))
          )}

          {addingIn === col?.id && (
            <AddForm
              col={col}
              onAdd={onAdd}
              onCancel={() => setAddingIn(null)}
            />
          )}
        </div>
      </SortableContext>

      {/* Footer */}
      {addingIn !== col?.id && (
        <button
          className="flex items-center gap-1.5 w-full px-4 py-3.5 text-[11px] cursor-pointer font-semibold transition-all"
          style={{ color: "rgba(62,62,85,0.35)" }}
          onClick={() => setAddingIn(col?.id)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = col?.accent ?? BRAND?.secondary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(62,62,85,0.35)")
          }
        >
          <FaPlus size={8} />
          Add a task
        </button>
      )}
    </div>
  );
}

/* ─── Board ─────────────────────────────────────────────────────── */
export default function WorkSpaceBoardView({
  selectedWorkspaceId,
  selectedWorkspaceName,
  selectedWorkspaceMode,

  setRefresh,
}) {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [overColId, setOverColId] = useState(null);
  const [addingIn, setAddingIn] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  const titleRef = useRef();

  // Snapshot of tasks before drag starts — used for rollback if API fails
  const tasksSnapshot = useRef([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  /* ── helpers ── */

  // Given a dnd-kit id (could be a column id OR a task id), return the column id
  const getColId = (dndId) => {
    if (columns?.some((c) => c.id === dndId)) return dndId;
    return tasks.find((t) => t.id === dndId)?.statusId ?? null;
  };

  // Returns tasks for a column sorted by task_position ascending
  const getTasksByCol = (colId) =>
    tasks
      .filter((t) => t.statusId === colId)
      .sort((a, b) => (a.task_position ?? 0) - (b.task_position ?? 0));

  /* ── drag handlers ── */

  const onDragStart = ({ active }) => {
    tasksSnapshot.current = tasks; // snapshot for rollback on API failure
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
  };

  const onDragOver = ({ active, over }) => {
    if (!over) {
      setOverColId(null);
      return;
    }

    const ovCol = getColId(over.id);
    setOverColId(ovCol);

    const acCol = getColId(active.id);
    if (!ovCol || acCol === ovCol) return;

    // Optimistically move card to new column while dragging
    setTasks((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, statusId: ovCol } : t)),
    );
  };

  const onDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    setOverColId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColId = getColId(activeId);
    const targetColId = getColId(overId);

    if (!activeColId || !targetColId) return;

    // ── 1. Compute the reordered task list ───────────────────────────────────
    let reordered = [];

    setTasks((prev) => {
      // Ensure task is assigned to the target column
      const withColMoved = prev.map((t) =>
        t.id === activeId ? { ...t, statusId: targetColId } : t,
      );

      const ai = withColMoved.findIndex((t) => t.id === activeId);
      const oi = withColMoved.findIndex((t) => t.id === overId);

      // Dropped directly onto a column droppable (empty column) — no reorder needed
      if (oi === -1) {
        reordered = withColMoved;
        return withColMoved;
      }

      reordered = arrayMove(withColMoved, ai, oi);
      return reordered;
    });

    // ── 2. Find neighbors in the target column to compute new position ───────
    const colTasksAfterMove = reordered
      .filter((t) => t.statusId === targetColId)
      .sort((a, b) => (a.task_position ?? 0) - (b.task_position ?? 0));

    const movedIndex = colTasksAfterMove.findIndex((t) => t.id === activeId);
    const prevTask = colTasksAfterMove[movedIndex - 1] ?? null;
    const nextTask = colTasksAfterMove[movedIndex + 1] ?? null;

    const prevPos = prevTask?.task_position ?? null;
    const nextPos = nextTask?.task_position ?? null;
    let newPosition = calcNewPosition(prevPos, nextPos);

    // ── 3. Re-index the whole column if gap shrank below 1 ──────────────────
    //       This keeps positions clean and prevents floating-point blowup.
    let bulkUpdates = null;
    if (prevPos !== null && nextPos !== null && nextPos - prevPos < 1) {
      const reindexed = reindexColumn(colTasksAfterMove);
      newPosition = reindexed[movedIndex].task_position;
      bulkUpdates = reindexed;
    }

    // ── 4. Update task_position in local state ───────────────────────────────
    setTasks((prev) => {
      if (bulkUpdates) {
        const updateMap = Object.fromEntries(
          bulkUpdates.map((u) => [u.id, u.task_position]),
        );
        return prev.map((t) =>
          updateMap[t.id] !== undefined
            ? { ...t, task_position: updateMap[t.id] }
            : t,
        );
      }
      return prev.map((t) =>
        t.id === activeId ? { ...t, task_position: newPosition } : t,
      );
    });

    // ── 5. Persist to DB ─────────────────────────────────────────────────────
    /*
     * Expected API contract (PUT UPDATE_WORKSPACE_TASK_POSITION_URL):
     *
     * Request body:
     * {
     *   updates: [
     *     {
     *       workspaceTaskId: number,      -- task to update
     *       workspaceColumnId: number,    -- new (or same) column
     *       taskPosition: number          -- new fractional position value
     *     },
     *     ...                             -- extra items only on full re-index
     *   ]
     * }
     *
     * Success response: { success: true }
     *
     * The backend should do a bulk UPDATE:
     *   UPDATE utbl_workspace_tasks
     *   SET workspace_column_id = $col, task_position = $pos, updated_at = NOW()
     *   WHERE workspace_task_id = $id
     * for each entry in updates[].
     */
    try {
      const updates = bulkUpdates
        ? bulkUpdates.map((u) => ({
            workspaceTaskId: +u.id,
            workspaceColumnId: +targetColId,
            taskPosition: u.task_position,
          }))
        : [
            {
              workspaceTaskId: +activeId,
              workspaceColumnId: +targetColId,
              taskPosition: newPosition,
            },
          ];

      await axiosInstance.put(UPDATE_WORKSPACE_TASK_POSITION_URL, { updates });
    } catch (error) {
      console.error("Failed to save task position", error);
      toast.error("Could not save new position — reverting");
      setTasks(tasksSnapshot.current); // rollback
    }
  };

  /* ── add task ── */
  const handleAdd = (colId) => async (title, priority) => {
    try {
      const colTasks = getTasksByCol(colId);
      const lastPos = colTasks[colTasks.length - 1]?.task_position ?? 0;

      const payload = {
        workspaceId: +selectedWorkspaceId,
        workspaceColumnId: +colId,
        title,
        priorityId: PRIORITY_ID_MAP[priority],
        taskPosition: lastPos + GAP, // always appended at bottom
      };

      const res = await axiosInstance.post(ADD_WORKSPACE_TASK_URL, payload);
      const response = res.data;

      if (!response.success) {
        toast.error("Failed to create task");
        return;
      }

      const newTask = response.data;

      setTasks((prev) => [
        ...prev,
        {
          id: String(newTask.workspace_task_id),
          title,
          statusId: String(colId),
          priority,
          task_position: newTask.task_position ?? lastPos + GAP,
        },
      ]);

      setAddingIn(null);
      toast.success("Task added");
    } catch (error) {
      console.error("Can't add task", error);
      toast.error("Can't add task at the moment");
    }
  };

  const renameWorkspace = async (newTitle) => {
    try {
      const payload = {
        WorkspaceId: selectedWorkspaceId,
        WorkspaceName: newTitle,
      };

      const res = await axiosInstance.post(RENAME_WORKSPACE_URL, payload);
      if (res.status == 200) {
        // setTimeout(() => {
        //   setSelectedWorkspaceName(newTitle);
        // }, 500);
      } else {
        toast.error("Can't rename workspace");
      }
    } catch (error) {
      console.error("not able to rename workspace");
      toast.error("Can't rename workspace");
    } finally {
      setRefresh((prev) => !prev);
    }
  };

  /* ── fetch workspace ── */
  const handleGetWorkSpaceFullDetails = async () => {
    try {
      if (!selectedWorkspaceId) {
        toast.error("Workspace Id is required");
        return;
      }

      setLoading(true);

      const res = await axiosInstance.post(
        GET_WORKSPACE_FULL_DETAILS_BY_ID_URL,
        { workspaceId: +selectedWorkspaceId },
      );

      const response = res.data;

      if (!response.success) {
        toast.error("Failed to fetch workspace");
        return;
      }

      const apiColumns = response?.data?.columns ?? [];

      const sortedApiColumns = [...apiColumns].sort(
        (a, b) => a.column_position - b.column_position,
      );

      const styledColumns = sortedApiColumns.map((col, index) =>
        buildStyledColumn(col, index),
      );

      const formattedTasks = sortedApiColumns.flatMap((col) => {
        const colTasks = col?.tasks ?? [];
        return colTasks.map((task) => ({
          id: String(task.workspace_task_id),
          title: task.title,
          statusId: String(col.workspace_column_id),
          priority: mapPriority(task.priority_id),
          task_position: task.task_position ?? 0, // ← keep DB position in state
        }));
      });

      setColumns(styledColumns);
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Can't get workspace details", error);
      toast.error("Something went wrong fetching workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetWorkSpaceFullDetails();
  }, [selectedWorkspaceId]);

  return (
    <div className="min-h-screen px-8 pb-10 pt-6">
      {/* Header */}
      <div className="mb-4 relative">
        <div className="absolute right-0">
          <WorkspaceModeBadge selectedWorkspaceMode={selectedWorkspaceMode} />
        </div>

        <div
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            let text = e.currentTarget.textContent || "";

            if (text.length > 45) {
              text = text.slice(0, 45);
              e.currentTarget.textContent = text;

              const range = document.createRange();
              const sel = window.getSelection();
              range.selectNodeContents(e.currentTarget);
              range.collapse(false);
              sel?.removeAllRanges();
              sel?.addRange(range);
            }

            renameWorkspace(text);
          }}
          className="text-2xl font-black tracking-tight capitalize outline-none"
          style={{ color: BRAND?.secondary }}
        >
          {selectedWorkspaceName || "Project Board"}
        </div>
        <p
          className="text-[12px] mt-0.5"
          style={{ color: "rgba(62,62,85,0.4)" }}
        >
          Drag cards between columns to update status
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: `${BRAND?.secondary} transparent ${BRAND?.secondary} ${BRAND?.secondary}`,
            }}
          />
          <span
            className="ml-3 text-sm"
            style={{ color: "rgba(62,62,85,0.4)" }}
          >
            Loading workspace…
          </span>
        </div>
      )}

      {/* Empty */}
      {!loading && columns?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-4xl">📋</span>
          <p
            className="text-[13px] font-semibold"
            style={{ color: "rgba(62,62,85,0.4)" }}
          >
            No columns found for this workspace
          </p>
        </div>
      )}

      {/* Board */}
      {!loading && columns?.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {columns?.map((col) => (
              <Column
                key={col.id}
                col={col}
                tasks={getTasksByCol(col.id)}
                isOver={overColId === col.id}
                addingIn={addingIn}
                setAddingIn={setAddingIn}
                onAdd={handleAdd(col.id)}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeTask ? (
              <TaskCard
                task={activeTask}
                overlay
                onDelete={(taskId) => {
                  setTasks((prev) => prev.filter((t) => t.id !== taskId));
                }}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
