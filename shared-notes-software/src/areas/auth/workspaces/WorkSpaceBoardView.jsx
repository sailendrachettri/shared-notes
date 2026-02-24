/**
 * WorkSpaceBoardView — Soft Minimal Brand Theme
 * primary: #d25564 (rose-red)
 * secondary: #3e3e55 (deep navy-slate)
 * ternary: #ffd788 (warm gold)
 *
 * Install dependencies:
 * npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-icons
 */
import React, { useState, useEffect } from "react";
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
  FaTimes,
  FaGripVertical,
} from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { axiosInstance } from "../../../api/axios";
import { GET_WORKSPACE_FULL_DETAILS_BY_ID_URL } from "../../../api/api_routes";
import toast from "react-hot-toast";

/* ─── Brand tokens ──────────────────────────────────────────────── */
const BRAND = {
  primary: "#d25564",
  secondary: "#3e3e55",
  ternary: "#ffd788",
};

/* ─── Column style config (cycled for dynamic columns) ─────────── */
const COLUMN_STYLE_PRESETS = [
  {
    accent: BRAND.secondary,
    accentLight: "rgba(62,62,85,0.06)",
    accentBorder: "rgba(62,62,85,0.13)",
    colBg: "#f7f7fb",
    emptyDot: "rgba(62,62,85,0.15)",
    Icon: FaRegClock,
  },
  {
    accent: BRAND.secondary,
    accentLight: "rgba(62,62,85,0.06)",
    accentBorder: "rgba(62,62,85,0.13)",
    colBg: "#f7f7fb",
    emptyDot: "rgba(62,62,85,0.15)",
    Icon: MdOutlinePendingActions,
  },
  {
    accent: BRAND.secondary,
    accentLight: "rgba(62,62,85,0.06)",
    accentBorder: "rgba(62,62,85,0.13)",
    colBg: "#f7f7fb",
    emptyDot: "rgba(62,62,85,0.15)",
    Icon: FaCheckCircle,
  },
];

/**
 * Merges an API column with a style preset.
 * Index is used to cycle through presets if there are more columns than presets.
 */
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

const mapPriority = (priorityId) => {
  switch (priorityId) {
    case 1: return "High";
    case 2: return "Medium";
    case 3: return "Low";
    default: return "Medium";
  }
};

let _uid = 200;

/* ─── TaskCard ──────────────────────────────────────────────────── */
function TaskCard({ task, overlay = false }) {
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
      className="rounded-2xl p-3 flex flex-col gap-2 select-none"
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
      {/* grip + title row */}
      <div className="flex items-start gap-2">
        <span
          {...listeners}
          {...attributes}
          className="mt-0.5 shrink-0 cursor-grab active:cursor-grabbing transition-colors"
          style={{ color: "rgba(62,62,85,0.2)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(62,62,85,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(62,62,85,0.2)")}
        >
          <FaGripVertical size={11} />
        </span>
        <p className="text-[13px] font-semibold leading-snug flex-1" style={{ color: BRAND.secondary }}>
          {task.title}
        </p>
      </div>
      {/* priority badge */}
      <div className="flex items-center gap-1 pl-5">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: p.dot }}
        />
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
          style={{ color: p.color, background: p.bg }}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );

  if (overlay) return inner;

  return (
    <div ref={setNodeRef} style={style}>
      {inner}
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
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
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
              className="px-3 py-1 text-[11px] rounded-lg border cursor-pointer border-slate-200 transition-all duration-150 flex items-center gap-1"
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
          style={{ background: col?.accent ?? BRAND.secondary }}
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
function Column({ col, tasks, isOver, addingIn, setAddingIn, onAdd }) {
  // tasks may be undefined/null while loading — always default to []
  const safeTasks = tasks ?? [];
  const ids = safeTasks.map((t) => t.id);
  const isEmpty = safeTasks.length === 0 && addingIn !== col?.id;
  const { setNodeRef: setDropRef } = useDroppable({ id: col?.id });

  return (
    <div
      className="flex flex-col rounded-3xl overflow-hidden transition-all duration-200"
      style={{
        background: isOver ? col?.accentLight : col?.colBg,
        border: `1px solid ${isOver ? (col?.accent ?? BRAND.secondary) + "50" : "rgba(62,62,85,0.07)"}`,
        boxShadow: isOver
          ? `0 0 0 3px ${col?.accent ?? BRAND.secondary}18, 0 12px 32px ${col?.accent ?? BRAND.secondary}10`
          : "0 2px 20px rgba(62,62,85,0.05)",
      }}
    >
      {/* Thin accent top line */}
      <div
        className="h-[3px] w-full"
        style={{
          background: `linear-gradient(90deg, ${col?.accent ?? BRAND.secondary}, ${(col?.accent ?? BRAND.secondary)}88)`,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span
            className="flex items-center justify-center w-6 h-6 rounded-lg"
            style={{ background: col?.accentLight }}
          >
            {col?.Icon && <col.Icon size={12} style={{ color: col?.accent }} />}
          </span>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ color: col?.accent }}
          >
            {col?.label}
          </span>
          <span
            className="rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-black"
            style={{ background: col?.accentLight, color: col?.accent }}
          >
            {safeTasks.length}
          </span>
        </div>
        <button
          onClick={() => setAddingIn(col?.id)}
          className="w-7 h-7 flex items-center cursor-pointer justify-center rounded-xl transition-all hover:scale-105"
          style={{
            background: col?.accentLight,
            color: col?.accent,
            border: `1px solid ${col?.accentBorder}`,
          }}
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
                  ? (col?.accent ?? BRAND.secondary) + "60"
                  : col?.emptyDot,
                background: isOver ? col?.accentLight : "transparent",
              }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: isOver ? col?.accentLight : "rgba(62,62,85,0.04)",
                  border: `1.5px dashed ${isOver ? col?.accent : "rgba(62,62,85,0.15)"}`,
                }}
              >
                {isOver ? (
                  <span style={{ color: col?.accent, fontSize: 14 }}>↓</span>
                ) : (
                  <span style={{ color: "rgba(62,62,85,0.25)", fontSize: 14 }}>+</span>
                )}
              </span>
              <p
                className="text-[11px] font-semibold"
                style={{ color: isOver ? col?.accent : "rgba(62,62,85,0.35)" }}
              >
                {isOver ? "Drop here" : "No tasks yet"}
              </p>
              {!isOver && (
                <p className="text-[10px]" style={{ color: "rgba(62,62,85,0.25)" }}>
                  Add one below or drag a card in
                </p>
              )}
            </div>
          ) : (
            safeTasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}

          {addingIn === col?.id && (
            <AddForm col={col} onAdd={onAdd} onCancel={() => setAddingIn(null)} />
          )}
        </div>
      </SortableContext>

      {/* Footer */}
      {addingIn !== col?.id && (
        <button
          className="flex items-center gap-1.5 w-full px-4 py-3.5 text-[11px] cursor-pointer font-semibold transition-all"
          style={{ color: "rgba(62,62,85,0.35)" }}
          onClick={() => setAddingIn(col?.id)}
          onMouseEnter={(e) => (e.currentTarget.style.color = col?.accent ?? BRAND.secondary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(62,62,85,0.35)")}
        >
          <FaPlus size={8} />
          Add a task
        </button>
      )}
    </div>
  );
}

/* ─── Board ─────────────────────────────────────────────────────── */
export default function WorkSpaceBoardView({ selectedWorkspaceId }) {
  // Start with empty arrays — tasks and columns will be populated from the API
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [overColId, setOverColId] = useState(null);
  const [addingIn, setAddingIn] = useState(null);
  const [columns, setColumns] = useState([]); // styled columns (merged API + presets)
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const getCol = (id) => {
    if (columns.some((c) => c.id === id)) return id;
    return tasks.find((t) => t.id === id)?.statusId ?? null;
  };

  const getTasksByCol = (colId) =>
    tasks.filter((t) => t.statusId === colId);

  const onDragStart = ({ active }) =>
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);

  const onDragOver = ({ active, over }) => {
    if (!over) { setOverColId(null); return; }
    const ovCol = getCol(over.id);
    setOverColId(ovCol);
    const acCol = getCol(active.id);
    if (!ovCol || acCol === ovCol) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, statusId: ovCol } : t)),
    );
  };

  const onDragEnd = ({ active, over }) => {
    setActiveTask(null);
    setOverColId(null);
    if (!over || active.id === over.id) return;
    setTasks((prev) => {
      const ai = prev.findIndex((t) => t.id === active.id);
      const oi = prev.findIndex((t) => t.id === over.id);
      if (ai === -1 || oi === -1) return prev;
      return arrayMove(prev, ai, oi);
    });
  };

  const handleAdd = (colId) => (title, priority) => {
    setTasks((prev) => [
      ...prev,
      { id: String(++_uid), title, statusId: colId, priority },
    ]);
    setAddingIn(null);
  };

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

      // Sort columns by position then build styled column objects
      const sortedApiColumns = [...apiColumns].sort(
        (a, b) => a.column_position - b.column_position,
      );

      const styledColumns = sortedApiColumns.map((col, index) =>
        buildStyledColumn(col, index),
      );

      // Flatten all tasks from all columns (tasks array per column may be null/undefined)
      const formattedTasks = sortedApiColumns.flatMap((col) => {
        const colTasks = col?.tasks ?? []; // guard against null tasks array
        return colTasks.map((task) => ({
          id: String(task.workspace_task_id),
          title: task.title,
          statusId: String(col.workspace_column_id),
          priority: mapPriority(task.priority_id),
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
    <div className="min-h-screen px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[9px] font-black uppercase tracking-[0.22em] ml-1"
            style={{ color: "rgba(62,62,85,0.35)" }}
          >
            Workspace
          </span>
        </div>
        <h1
          className="text-2xl font-black tracking-tight"
          style={{ color: BRAND.secondary }}
        >
          Project Board
        </h1>
        <p className="text-[12px] mt-0.5" style={{ color: "rgba(62,62,85,0.4)" }}>
          Drag cards between columns to update status
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${BRAND.secondary} transparent ${BRAND.secondary} ${BRAND.secondary}` }}
          />
          <span className="ml-3 text-sm" style={{ color: "rgba(62,62,85,0.4)" }}>
            Loading workspace…
          </span>
        </div>
      )}

      {/* Empty state — API returned no columns */}
      {!loading && columns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-4xl">📋</span>
          <p className="text-[13px] font-semibold" style={{ color: "rgba(62,62,85,0.4)" }}>
            No columns found for this workspace
          </p>
        </div>
      )}

      {/* Board */}
      {!loading && columns.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {columns.map((col) => (
              <Column
                key={col.id}
                col={col}
                tasks={getTasksByCol(col.id)}
                isOver={overColId === col.id}
                addingIn={addingIn}
                setAddingIn={setAddingIn}
                onAdd={handleAdd(col.id)}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeTask ? <TaskCard task={activeTask} overlay /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}