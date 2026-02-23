/**
 * WorkSpaceBoardView — Soft Minimal Brand Theme
 * primary:   #d25564  (rose-red)
 * secondary: #3e3e55  (deep navy-slate)
 * ternary:   #ffd788  (warm gold)
 *
 * Install dependencies:
 *   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-icons
 */

import React, { useState } from "react";
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

/* ─── Brand tokens ──────────────────────────────────────────────── */
const BRAND = {
  primary:   "#d25564",
  secondary: "#3e3e55",
  ternary:   "#ffd788",
};

/* ─── Data ───────────────────────────────────────────────────────── */
const initialTasks = [
  { id: "1", title: "Design login page UI",      statusId: "todo",       priority: "High" },
  { id: "2", title: "Build authentication API",  statusId: "inprogress", priority: "Medium" },
  { id: "3", title: "Fix dashboard bugs",        statusId: "done",       priority: "Low" },
  { id: "4", title: "Create database schema",    statusId: "todo",       priority: "High" },
  { id: "5", title: "Integrate payment gateway", statusId: "inprogress", priority: "High" },
  { id: "6", title: "Deploy to production",      statusId: "done",       priority: "Medium" },
  { id: "7", title: "Write documentation",       statusId: "todo",       priority: "Low" },
  { id: "8", title: "Improve performance",       statusId: "inprogress", priority: "Medium" },
];

const COLUMNS = [
  {
    id: "todo",
    label: "Todo",
    Icon: FaRegClock,
    accent: BRAND.primary,
    accentLight: "rgba(210,85,100,0.08)",
    accentBorder: "rgba(210,85,100,0.15)",
    colBg: "#fdf8f8",           // barely-there rose
    emptyDot: "rgba(210,85,100,0.18)",
  },
  {
    id: "inprogress",
    label: "In Progress",
    Icon: MdOutlinePendingActions,
    accent: BRAND.secondary,
    accentLight: "rgba(62,62,85,0.06)",
    accentBorder: "rgba(62,62,85,0.13)",
    colBg: "#f7f7fb",           // barely-there navy
    emptyDot: "rgba(62,62,85,0.15)",
  },
  {
    id: "done",
    label: "Done",
    Icon: FaCheckCircle,
    accent: "#b8924a",          // readable gold
    accentLight: "rgba(255,215,136,0.18)",
    accentBorder: "rgba(184,146,74,0.2)",
    colBg: "#fdfbf5",           // barely-there cream
    emptyDot: "rgba(184,146,74,0.2)",
  },
];

const PRIORITY = {
  High:   { color: "#c0394a", bg: "rgba(210,85,100,0.09)",  dot: "#d25564" },
  Medium: { color: "#3e3e55", bg: "rgba(62,62,85,0.09)",    dot: "#3e3e55" },
  Low:    { color: "#9a7a30", bg: "rgba(255,215,136,0.28)", dot: "#c9a030" },
};

let _uid = 200;

/* ─── TaskCard ──────────────────────────────────────────────────── */
function TaskCard({ task, overlay = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const p = PRIORITY[task.priority] ?? PRIORITY.Medium;

  const inner = (
    <div
      className={[
        "rounded-2xl p-4 select-none transition-all duration-150",
        overlay   ? "scale-[1.04] rotate-1" : "",
        isDragging ? "opacity-25 scale-[0.97]" : "",
        !overlay && !isDragging ? "hover:-translate-y-0.5" : "",
      ].join(" ")}
      style={{
        background: "white",
        border: "1px solid rgba(62,62,85,0.08)",
        boxShadow: overlay
          ? "0 24px 48px rgba(62,62,85,0.14)"
          : isDragging
          ? "none"
          : "0 1px 3px rgba(62,62,85,0.07), 0 4px 12px rgba(62,62,85,0.04)",
      }}
    >
      <div className="flex items-start gap-2.5">
        <span
          {...(!overlay ? listeners : {})}
          {...(!overlay ? attributes : {})}
          className="mt-0.5 flex-shrink-0 cursor-grab active:cursor-grabbing transition-colors"
          style={{ color: "rgba(62,62,85,0.2)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(62,62,85,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(62,62,85,0.2)")}
        >
          <FaGripVertical size={12} />
        </span>
        <p
          className="text-[13px] font-medium leading-snug flex-1 capitalize"
          style={{ color: BRAND.secondary }}
        >
          {task.title}
        </p>
      </div>

      <div className="mt-3.5 flex justify-end">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[9px] font-bold uppercase tracking-wider"
          style={{ color: p.color, background: p.bg }}
        >
          <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: p.dot }} />
          {task.priority}
        </span>
      </div>
    </div>
  );

  if (overlay) return inner;
  return <div ref={setNodeRef} style={style}>{inner}</div>;
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
        background: "white",
        border: `1px solid ${col.accentBorder}`,
        boxShadow: "0 2px 12px rgba(62,62,85,0.06)",
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
        className="w-full rounded-xl px-3 py-2 text-[13px] resize-none focus:outline-none placeholder-slate-300"
        style={{
          background: col.accentLight,
          border: `1px solid ${col.accentBorder}`,
          color: BRAND.secondary,
        }}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="rounded-xl px-3 py-1.5 text-[13px] cursor-pointer focus:outline-none"
        style={{
          background: col.accentLight,
          border: `1px solid ${col.accentBorder}`,
          color: BRAND.secondary,
        }}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <div className="flex items-center gap-2">
        <button
          onClick={submit}
          className="rounded-xl px-3.5 py-1.5 text-[11px] font-bold text-white hover:opacity-85 transition-opacity"
          style={{ background: col.accent }}
        >
          Add task
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl p-1.5 transition-colors"
          style={{
            border: "1px solid rgba(62,62,85,0.12)",
            color: "rgba(62,62,85,0.4)",
            background: "rgba(62,62,85,0.03)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(62,62,85,0.07)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(62,62,85,0.03)")}
        >
          <FaTimes size={10} />
        </button>
      </div>
    </div>
  );
}

/* ─── Column ────────────────────────────────────────────────────── */
function Column({ col, tasks, isOver, addingIn, setAddingIn, onAdd }) {
  const ids = tasks.map((t) => t.id);
  const isEmpty = tasks.length === 0 && addingIn !== col.id;
  const { setNodeRef: setDropRef } = useDroppable({ id: col.id });

  return (
    <div
      className="flex flex-col rounded-3xl overflow-hidden transition-all duration-200"
      style={{
        background: isOver ? col.accentLight : col.colBg,
        border: `1px solid ${isOver ? col.accent + "50" : "rgba(62,62,85,0.07)"}`,
        boxShadow: isOver
          ? `0 0 0 3px ${col.accent}18, 0 12px 32px ${col.accent}10`
          : "0 2px 20px rgba(62,62,85,0.05)",
      }}
    >
      {/* Thin accent top line */}
      <div
        className="h-[3px] w-full"
        style={{ background: `linear-gradient(90deg, ${col.accent}, ${col.accent}88)` }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span
            className="flex items-center justify-center w-6 h-6 rounded-lg"
            style={{ background: col.accentLight }}
          >
            <col.Icon size={12} style={{ color: col.accent }} />
          </span>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ color: col.accent }}
          >
            {col.label}
          </span>
          <span
            className="rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-black"
            style={{ background: col.accentLight, color: col.accent }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setAddingIn(col.id)}
          className="w-7 h-7 flex items-center justify-center rounded-xl transition-all hover:scale-105"
          style={{
            background: col.accentLight,
            color: col.accent,
            border: `1px solid ${col.accentBorder}`,
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
                borderColor: isOver ? col.accent + "60" : col.emptyDot,
                background: isOver ? col.accentLight : "transparent",
              }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: isOver ? col.accentLight : "rgba(62,62,85,0.04)",
                  border: `1.5px dashed ${isOver ? col.accent : "rgba(62,62,85,0.15)"}`,
                }}
              >
                {isOver
                  ? <span style={{ color: col.accent, fontSize: 14 }}>↓</span>
                  : <span style={{ color: "rgba(62,62,85,0.25)", fontSize: 14 }}>+</span>
                }
              </span>
              <p
                className="text-[11px] font-semibold"
                style={{ color: isOver ? col.accent : "rgba(62,62,85,0.35)" }}
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
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}

          {addingIn === col.id && (
            <AddForm col={col} onAdd={onAdd} onCancel={() => setAddingIn(null)} />
          )}
        </div>
      </SortableContext>

      {/* Footer */}
      {addingIn !== col.id && (
        <button
          className="flex items-center gap-1.5 w-full px-4 py-3.5 text-[11px] font-semibold transition-all"
          style={{ color: "rgba(62,62,85,0.35)" }}
          onClick={() => setAddingIn(col.id)}
          onMouseEnter={(e) => (e.currentTarget.style.color = col.accent)}
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
export default function WorkSpaceBoardView() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState(null);
  const [overColId, setOverColId] = useState(null);
  const [addingIn, setAddingIn] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const getCol = (id) => {
    if (COLUMNS.some((c) => c.id === id)) return id;
    return tasks.find((t) => t.id === id)?.statusId ?? null;
  };

  const getTasksByCol = (colId) => tasks.filter((t) => t.statusId === colId);

  const onDragStart = ({ active }) =>
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);

  const onDragOver = ({ active, over }) => {
    if (!over) { setOverColId(null); return; }
    const ovCol = getCol(over.id);
    setOverColId(ovCol);
    const acCol = getCol(active.id);
    if (!ovCol || acCol === ovCol) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, statusId: ovCol } : t))
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

  return (
    <div
      className="min-h-screen px-8 py-10"
      style={{
        // Warm near-white — barely tinted with brand cream
        background: "#faf9f7",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          {/* Three tiny brand-colored pills */}
          <span className="w-2 h-2 rounded-full" style={{ background: BRAND.primary }} />
          <span className="w-2 h-2 rounded-full" style={{ background: BRAND.secondary }} />
          <span className="w-2 h-2 rounded-full" style={{ background: BRAND.ternary }} />
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
        <p
          className="text-[12px] mt-0.5"
          style={{ color: "rgba(62,62,85,0.4)" }}
        >
          Drag cards between columns to update status
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {COLUMNS.map((col) => (
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
    </div>
  );
}