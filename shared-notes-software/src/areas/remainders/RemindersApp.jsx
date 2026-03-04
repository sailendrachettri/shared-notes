import { useState } from "react";
import {
  FiBell,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiFlag,
  FiSun,
  FiSearch,
  FiEdit3,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiChevronRight,
  FiMapPin,
  FiUsers,
  FiTrendingUp,
  FiGift,
  FiUser,
  FiLayers,
  FiFolder,
  FiBriefcase,
} from "react-icons/fi";
import DropdownReusable from "../../utils/dropdowns/DropdownReusable";
import { BiSolidCommentAdd } from "react-icons/bi";
import AddEventForm from "./AddEventForm";

/* ---------- Constants ---------- */

const CATEGORIES = [
  { id: "all", label: "All Events", icon: FiBell },
  { id: "holiday", label: "Holidays", icon: FiSun },
  { id: "meeting", label: "Meetings", icon: FiUsers },
  { id: "work", label: "Work", icon: FiBriefcase },
  { id: "project", label: "Projects", icon: FiFolder },
  { id: "event", label: "Events", icon: FiCalendar },
  { id: "personal", label: "Personal", icon: FiUser },
  { id: "general", label: "General", icon: FiLayers },
];

const TODAY = new Date().toISOString().split("T")[0];

/* ---------- Helper Functions ---------- */

function daysFromNow(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date(TODAY)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return `In ${diff} days`;
}

function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ===================================================== */

export default function RemindersApp() {
  const [events, setEvents] = useState([]);
  const [activeCategory, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = events.filter((e) => {
    const mc = activeCategory === "all" || e.category === activeCategory;
    const ms = e.title.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  function toggleDone(id) {
    setEvents((ev) =>
      ev.map((e) => (e.id === id ? { ...e, done: !e.done } : e)),
    );
  }

  function deleteEv(id) {
    setEvents((ev) => ev.filter((e) => e.id !== id));
  }

  return (
    <div className="h-full flex gap-3 bg-slate-100 font-sans text-slate-800">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white  flex flex-col rounded-md ">
        {/* Brand */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow">
            <FiBell />
          </div>
          <div>
            <h1 className="font-bold text-lg">SharedNotes</h1>
            <p className="text-xs text-slate-400">Smart Reminder</p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {CATEGORIES?.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition
                ${
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-primary/5 text-slate-500 cursor-pointer"
                }`}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="h-12 w-12 absolute bottom-20 left-62 z-40 cursor-pointer rounded-full bg-primary  text-white py-2  shadow-lg shadow-primary/40 hover:shadow-primary/80 duration-150 transition"
        >
          <span className="flex items-center justify-center gap-x-2 flex-nowrap">
            <BiSolidCommentAdd size={20} />
          </span>
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col bg-white rounded-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Events & Remainders</h2>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center bg-slate-100 px-4 py-2 rounded-xl w-80">
            <FiSearch className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="bg-transparent ml-2 w-full outline-none text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 flex gap-8">
          {/* Event List */}
          <div className="flex-1 space-y-4">
            {filtered.length === 0 && (
              <div className="text-center text-slate-400 mt-20">
                <FiCalendar size={36} className="mx-auto mb-3 opacity-30" />
                No events found
              </div>
            )}

            {filtered.map((ev) => (
              <div
                key={ev.id}
                className={`bg-white p-5 rounded-2xl border hover:shadow-md transition flex justify-between items-start
                ${ev.done ? "opacity-60" : ""}
                `}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3
                      className={`font-semibold ${ev.done ? "line-through" : ""}`}
                    >
                      {ev.title}
                    </h3>
                    {daysFromNow(ev.date) === "Today" && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      {formatDate(ev.date)}
                    </span>
                    {ev.time && (
                      <span className="flex items-center gap-1">
                        <FiClock size={14} />
                        {ev.time}
                      </span>
                    )}
                    {ev.location && (
                      <span className="flex items-center gap-1">
                        <FiMapPin size={14} />
                        {ev.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleDone(ev.id)}
                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                  >
                    <FiCheck size={14} />
                  </button>
                  <button
                    onClick={() => deleteEv(ev.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showForm && <AddEventForm setShowForm={setShowForm} />}
        </div>
      </main>
    </div>
  );
}
