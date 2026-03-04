import { FiCalendar, FiClock, FiTag, FiTrash2 } from "react-icons/fi";
import {
  formatDate,
  formatTime,
} from "../../utils/date-time/formatePrettyDateTime";

/* ---------- Helpers ---------- */

function daysFromNow(dateStr) {
  const today = new Date();
  const eventDate = new Date(dateStr);

  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diff = Math.ceil((eventDate - today) / 86400000);

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return `In ${diff} days`;
}

/* ===================================================== */

export default function EventCard({ event, onDelete }) {
  const dayLabel = daysFromNow(event?.eventDate);
  const isToday = dayLabel === "Today";

  return (
    <div
      className="
        bg-white p-5 rounded-2xl border border-slate-200
        hover:shadow-lg hover:-translate-y-0.5
        transition-all duration-200
        flex justify-between items-start
      "
    >
      {/* LEFT CONTENT */}
      <div className="flex-1">
        {/* Title + Today Badge */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-slate-800 text-base first-letter:capitalize">
            {event?.eventTitle}
          </h3>

          {isToday && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
              Today
            </span>
          )}
        </div>

        {/* Category Badge */}
        {event?.eventCategoryName && (
          <div className="mb-2">
            <span
              className="inline-flex items-center gap-1 text-xs 
              bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full"
            >
              <FiTag size={12} />
              {event.eventCategoryName}
            </span>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <FiCalendar size={14} />
            {formatDate(event?.eventDate)}
          </span>

          {event?.eventTime && (
            <span className="flex items-center gap-1">
              <FiClock size={14} />
              {formatTime(event?.eventTime)}
            </span>
          )}

          <span className="text-xs text-slate-400">{dayLabel}</span>
        </div>
      </div>

      {/* RIGHT ACTION */}
      <div className="ml-4">
        <button
          onClick={() => onDelete(event?.eventId)}
          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
}
