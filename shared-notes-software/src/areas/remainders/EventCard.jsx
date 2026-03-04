import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";

/* ---------- Helpers (can move to utils later) ---------- */

const TODAY = new Date().toISOString().split("T")[0];

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

export default function EventCard({
  event,
  onToggleDone,
  onDelete,
}) {
  const isToday = daysFromNow(event.date) === "Today";

  return (
    <div
      className={`bg-white p-5 rounded-2xl border border-slate-200 
      hover:shadow-md transition-all duration-200 
      flex justify-between items-start
      ${event.done ? "opacity-60" : ""}
      `}
    >
      {/* Left Content */}
      <div className="flex-1">
        {/* Title Row */}
        <div className="flex items-center gap-2 mb-2">
          <h3
            className={`font-semibold text-slate-800 ${
              event.done ? "line-through" : ""
            }`}
          >
            {event.title}
          </h3>

          {isToday && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              Today
            </span>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <FiCalendar size={14} />
            {formatDate(event.date)}
          </span>

          {event.time && (
            <span className="flex items-center gap-1">
              <FiClock size={14} />
              {event.time}
            </span>
          )}

          {event.location && (
            <span className="flex items-center gap-1">
              <FiMapPin size={14} />
              {event.location}
            </span>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex gap-2 ml-4">
        <button
          onClick={() => onToggleDone(event.id)}
          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
        >
          <FiCheck size={14} />
        </button>

        <button
          onClick={() => onDelete(event.id)}
          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
}