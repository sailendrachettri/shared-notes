/**
 * WorkSpaceBoardView — Brand Theme
 * primary:   #d25564  (rose-red)
 * secondary: #3e3e55  (deep navy-slate)
 * ternary:   #ffd788  (warm gold)
 *
 * Install dependencies:
 *   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-icons
 *
 * Tailwind CSS must be configured in your project.
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
  primary:   "#d25564",   // rose-red
  secondary: "#3e3e55",   // deep navy-slate
  ternary:   "#ffd788",   // warm gold
};

/* ─── Data ───────────────────────────────────────────────────────── */
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

// Each column uses one of the brand colors as its accent
const COLUMNS = [
  {
    id: "todo",
    label: "Todo",
    Icon: FaRegClock,
    accent: BRAND.primary,           // rose-red
    headerColor: "#b8404f",
    accentBg: "rgba(210,85,100,0.07)",
    accentBorder: "rgba(210,85,100,0.2)",
    colBg: "#fff8f8",
  },
  {
    id: "inprogress",
    label: "In Progress",
    Icon: MdOutlinePendingActions,
    accent: BRAND.secondary,         // deep navy-slate
    headerColor: "#3e3e55",
    accentBg: "rgba(62,62,85,0.06)",
    accentBorder: "rgba(62,62,85,0.18)",
    colBg: "#f5f5f9",
  },
  {
    id: "done",
    label: "Done",
    Icon: FaCheckCircle,
    accent: "#c9a030",               // darker ternary so text is readable
    headerColor: "#a07820",
    accentBg: "rgba(255,215,136,0.2)",
    accentBorder: "rgba(201,160,48,0.3)",
    colBg: "#fffdf3",
  },
];

// Priority badges mapped to brand palette
const PRIORITY = {
  High:   { tag: "text-[#b8404f]",   bg: "rgba(210,85,100,0.10)",  dot: BRAND.primary },
  Medium: { tag: "text-[#3e3e55]",   bg: "rgba(62,62,85,0.10)",    dot: BRAND.secondary },
  Low:    { tag: "text-[#a07820]",   bg: "rgba(255,215,136,0.35)", dot: "#c9a030" },
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
        "rounded-2xl p-4 border select-none transition-all duration-150",
        overlay
          ? "shadow-2xl scale-[1.04] rotate-1"
          : isDragging
          ? "opacity-30 scale-95"
          : "hover:shadow-md hover:-translate-y-0.5",
      ].join(" ")}
      style={{
        background: "white",
        borderColor: overlay ? BRAND.primary + "40" : "rgba(62,62,85,0.1)",
        boxShadow: overlay
          ? `0 20px 40px rgba(210,85,100,0.2)`
          : isDragging
          ? "none"
          : "0 1px 4px rgba(62,62,85,0.08)",
      }}
    >
      <div className="flex items-start gap-2">
        <span
          {...(!overlay ? listeners : {})}
          {...(!overlay ? attributes : {})}
          className="mt-0.5 flex-shrink-0 cursor-grab active:cursor-grabbing transition-colors"
          style={{ color: "rgba(62,62,85,0.25)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = BRAND.secondary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(62,62,85,0.25)")}
        >
          <FaGripVertical size={13} />
        </span>
        <p className="text-sm font-semibold leading-snug flex-1" style={{ color: BRAND.secondary }}>
          {task.title}
        </p>
      </div>
      <div className="mt-3 flex justify-end">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${p.tag}`}
          style={{ background: p.bg }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.dot }} />
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
        boxShadow: "0 2px 8px rgba(62,62,85,0.08)",
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
        className="w-full rounded-xl px-3 py-2 text-sm resize-none focus:outline-none"
        style={{
          background: col.accentBg,
          border: `1px solid ${col.accentBorder}`,
          color: BRAND.secondary,
        }}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="rounded-xl px-3 py-1.5 text-sm cursor-pointer focus:outline-none"
        style={{
          background: col.accentBg,
          border: `1px solid ${col.accentBorder}`,
          color: BRAND.secondary,
        }}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <div className="flex items-center gap-2 mt-0.5">
        <button
          onClick={submit}
          className="rounded-xl px-3 py-1.5 text-xs font-black text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: col.accent }}
        >
          Add task
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl p-1.5 transition-colors hover:bg-slate-100"
          style={{ border: `1px solid rgba(62,62,85,0.15)`, color: BRAND.secondary + "80" }}
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
  const { setNodeRef: setDropRef } = useDroppable({ id: col.id });

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: isOver ? col.accentBg : col.colBg,
        border: `1.5px solid ${isOver ? col.accent : "rgba(62,62,85,0.1)"}`,
        boxShadow: isOver
          ? `0 0 0 3px ${col.accent}22, 0 8px 24px ${col.accent}18`
          : "0 2px 16px rgba(62,62,85,0.07)",
      }}
    >
      {/* Thick accent top bar */}
      <div className="h-1.5 w-full" style={{ background: col.accent }} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <col.Icon size={15} style={{ color: col.accent }} />
          <span
            className="text-[11px] font-black uppercase tracking-[0.12em]"
            style={{ color: col.headerColor }}
          >
            {col.label}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-black border"
            style={{
              color: col.accent,
              background: col.accentBg,
              borderColor: col.accentBorder,
            }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setAddingIn(col.id)}
          className="rounded-xl p-1.5 border transition-all hover:shadow-sm"
          style={{
            color: col.accent,
            borderColor: col.accentBorder,
            background: "white",
          }}
          title="Add task"
        >
          <FaPlus size={10} />
        </button>
      </div>

      {/* Cards */}
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div
          ref={setDropRef}
          className="px-3 pb-2 flex flex-col gap-2.5 flex-1 transition-all duration-200"
          style={{ minHeight: isEmpty ? "130px" : "60px" }}
        >
          {isEmpty ? (
            <div
              className="flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-8 gap-2 transition-all duration-200"
              style={{
                borderColor: isOver ? col.accent : "rgba(62,62,85,0.12)",
                background: isOver ? col.accentBg : "rgba(255,255,255,0.6)",
              }}
            >
              <span
                className="text-2xl transition-all duration-200"
                style={{
                  color: isOver ? col.accent : "rgba(62,62,85,0.2)",
                  filter: isOver ? `drop-shadow(0 0 5px ${col.accent}88)` : "none",
                }}
              >
                {isOver ? "✦" : "◯"}
              </span>
              <p
                className="text-[11px] font-bold"
                style={{ color: isOver ? col.headerColor : "rgba(62,62,85,0.4)" }}
              >
                {isOver ? "Release to drop here" : "No tasks yet"}
              </p>
              {!isOver && (
                <p className="text-[10px]" style={{ color: "rgba(62,62,85,0.3)" }}>
                  Drag a card here or add one below
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
          className="flex items-center gap-1.5 w-full px-4 py-3 text-[11px] font-semibold transition-colors"
          style={{ color: col.accent + "99" }}
          onClick={() => setAddingIn(col.id)}
          onMouseEnter={(e) => (e.currentTarget.style.color = col.accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = col.accent + "99")}
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
     
    >
      {/* Page header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-[0.22em] mb-1"
            style={{ color: BRAND.primary + "aa" }}
          >
            Workspace
          </p>
          <h1
            className="text-[1.9rem] font-black tracking-tight"
            style={{ color: BRAND.secondary }}
          >
            Project Board
          </h1>
          <p className="text-sm mt-1" style={{ color: BRAND.secondary + "66" }}>
            Drag cards between columns to update their status
          </p>
        </div>

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