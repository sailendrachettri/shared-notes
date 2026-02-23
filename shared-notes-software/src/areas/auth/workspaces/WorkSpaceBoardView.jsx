/**
 * WorkSpaceBoardView
 *
 * Install dependencies:
 *   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-icons
 *
 * Tailwind CSS must be set up in your project.
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

/* ─── Static data ───────────────────────────────────────────────── */

const initialTasks = [
  { id: "1", title: "Design login page UI",       statusId: "todo",       priority: "High" },
  { id: "2", title: "Build authentication API",   statusId: "inprogress", priority: "Medium" },
  { id: "3", title: "Fix dashboard bugs",         statusId: "done",       priority: "Low" },
  { id: "4", title: "Create database schema",     statusId: "todo",       priority: "High" },
  { id: "5", title: "Integrate payment gateway",  statusId: "inprogress", priority: "High" },
  { id: "6", title: "Deploy to production",       statusId: "done",       priority: "Medium" },
  { id: "7", title: "Write documentation",        statusId: "todo",       priority: "Low" },
  { id: "8", title: "Improve performance",        statusId: "inprogress", priority: "Medium" },
];

const COLUMNS = [
  {
    id: "todo",
    label: "Todo",
    Icon: FaRegClock,
    accent: "#8b5cf6",          // violet-500
    headerColor: "#a78bfa",     // violet-400
    accentBg: "rgba(139,92,246,0.12)",
    accentBorder: "rgba(139,92,246,0.3)",
  },
  {
    id: "inprogress",
    label: "In Progress",
    Icon: MdOutlinePendingActions,
    accent: "#f59e0b",          // amber-500
    headerColor: "#fbbf24",     // amber-400
    accentBg: "rgba(245,158,11,0.12)",
    accentBorder: "rgba(245,158,11,0.3)",
  },
  {
    id: "done",
    label: "Done",
    Icon: FaCheckCircle,
    accent: "#10b981",          // emerald-500
    headerColor: "#34d399",     // emerald-400
    accentBg: "rgba(16,185,129,0.12)",
    accentBorder: "rgba(16,185,129,0.3)",
  },
];

const PRIORITY = {
  High:   { label: "bg-red-500/10 text-red-400",     dot: "bg-red-400" },
  Medium: { label: "bg-amber-500/10 text-amber-400", dot: "bg-amber-400" },
  Low:    { label: "bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-400" },
};

let _uid = 200;

/* ─── Sortable Card ─────────────────────────────────────────────── */

function TaskCard({ task, overlay = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const p = PRIORITY[task.priority] ?? PRIORITY.Medium;

  const inner = (
    <div
      className={[
        "rounded-xl p-3.5 border select-none",
        "transition-all duration-150",
        overlay
          ? "bg-white/10 border-white/20 shadow-2xl scale-[1.04] rotate-1"
          : isDragging
          ? "opacity-25 scale-95 bg-white/5 border-white/5"
          : "bg-white/[0.055] border-white/[0.08] hover:bg-white/[0.085] hover:border-white/[0.15] hover:-translate-y-0.5 hover:shadow-lg cursor-default",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        {/* Grip — only interactive when not overlay */}
        <span
          {...(!overlay ? listeners : {})}
          {...(!overlay ? attributes : {})}
          className="mt-0.5 text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing flex-shrink-0 transition-colors"
        >
          <FaGripVertical size={13} />
        </span>
        <p className="text-sm font-medium text-slate-200 leading-snug flex-1">
          {task.title}
        </p>
      </div>
      <div className="mt-3 flex justify-end">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${p.label}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
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

/* ─── Add-task form ─────────────────────────────────────────────── */

function AddForm({ col, onAdd, onCancel }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), priority);
  };

  return (
    <div className="rounded-xl p-3 border border-white/10 bg-white/[0.07] flex flex-col gap-2">
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
        className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 border border-white/10 focus:outline-none focus:border-white/25 resize-none"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="rounded-lg bg-black/30 px-3 py-1.5 text-sm text-slate-300 border border-white/10 focus:outline-none focus:border-white/25 cursor-pointer"
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <div className="flex items-center gap-2 mt-0.5">
        <button
          onClick={submit}
          style={{ background: col.accent }}
          className="rounded-lg px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-opacity"
        >
          Add task
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
        >
          <FaTimes size={11} />
        </button>
      </div>
    </div>
  );
}

/* ─── Column ────────────────────────────────────────────────────── */

function Column({ col, tasks, isOver, addingIn, setAddingIn, onAdd }) {
  const ids = tasks.map((t) => t.id);
  const isEmpty = tasks.length === 0 && addingIn !== col.id;

  // Make the column itself a drop target so empty columns can receive cards
  const { setNodeRef: setDropRef } = useDroppable({ id: col.id });

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden border transition-all duration-200"
      style={{
        background: isOver ? col.accentBg : "rgba(255,255,255,0.025)",
        borderColor: isOver ? col.accent : "rgba(255,255,255,0.07)",
        boxShadow: isOver
          ? `0 0 0 1.5px ${col.accent}55, 0 8px 32px ${col.accent}22`
          : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* accent line */}
      <div className="h-0.5 w-full" style={{ background: col.accent, opacity: 0.8 }} />

      {/* header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2">
          <col.Icon size={14} style={{ color: col.headerColor }} />
          <span
            className="text-[11px] font-black uppercase tracking-[0.1em]"
            style={{ color: col.headerColor }}
          >
            {col.label}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold border"
            style={{
              color: col.headerColor,
              background: col.accentBg,
              borderColor: col.accentBorder,
            }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setAddingIn(col.id)}
          className="rounded-lg p-1.5 border text-xs transition-colors hover:bg-white/10"
          style={{ color: col.headerColor, borderColor: col.accentBorder }}
          title="Add task"
        >
          <FaPlus size={10} />
        </button>
      </div>

      {/* cards — ref attached here so the whole card area is droppable */}
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div
          ref={setDropRef}
          className="px-3 pb-2 flex flex-col gap-2.5 flex-1 transition-all duration-200"
          style={{ minHeight: isEmpty ? "120px" : "60px" }}
        >
          {isEmpty ? (
            /* ── Empty state ── */
            <div
              className="flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 py-8 gap-2"
              style={{
                borderColor: isOver ? col.accent : "rgba(255,255,255,0.08)",
                background: isOver ? `${col.accent}0f` : "transparent",
              }}
            >
              <span
                className="text-2xl opacity-30"
                style={{ filter: isOver ? `drop-shadow(0 0 6px ${col.accent})` : "none" }}
              >
                {isOver ? "✦" : "○"}
              </span>
              <p className="text-[11px] font-medium text-slate-500">
                {isOver ? "Release to drop here" : "No tasks yet"}
              </p>
              <p className="text-[10px] text-slate-600">
                {isOver ? "" : "Drag a card here or add one below"}
              </p>
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}

          {addingIn === col.id && (
            <AddForm
              col={col}
              onAdd={onAdd}
              onCancel={() => setAddingIn(null)}
            />
          )}
        </div>
      </SortableContext>

      {/* footer */}
      {addingIn !== col.id && (
        <button
          onClick={() => setAddingIn(col.id)}
          className="flex items-center gap-1.5 w-full px-4 py-3 text-[11px] font-medium transition-colors"
          style={{ color: `${col.headerColor}80` }}
          onMouseEnter={(e) => (e.currentTarget.style.color = col.headerColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = `${col.headerColor}80`)}
        >
          <FaPlus size={9} />
          Add another task
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
    // id could be a column id OR a task id — check column ids first
    if (COLUMNS.some((c) => c.id === id)) return id;
    return tasks.find((t) => t.id === id)?.statusId ?? null;
  };

  const getTasksByCol = (colId) => tasks.filter((t) => t.statusId === colId);

  const onDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
  };

  const onDragOver = ({ active, over }) => {
    if (!over) { setOverColId(null); return; }

    const ovCol = getCol(over.id);
    setOverColId(ovCol);

    const acCol = getCol(active.id);
    if (!ovCol || acCol === ovCol) return;

    // Move card to the new column on hover so it appears there
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
        background: "linear-gradient(140deg,#0b0c14 0%,#0f1622 55%,#0c1118 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">
          Workspace
        </p>
        <h1 className="text-[1.7rem] font-black text-slate-100 tracking-tight">
          Project Board
        </h1>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
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