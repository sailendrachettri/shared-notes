import { FiCalendar, FiClock, FiTag, FiTrash2 } from "react-icons/fi";
import {
  formatDate,
  formatTime,
} from "../../utils/date-time/formatePrettyDateTime";
import { useState } from "react";
import DeleteConfirmModal from "../../reusable/DeleteConfirmModal";
import toast from "react-hot-toast";
import { axiosInstance } from "../../api/axios";
import { DELETE_EVENT_URL } from "../../api/api_routes";

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

export default function EventCard({
  event,
  setDeleteEventId,
  setShowDeleteModal,
}) {
  const dayLabel = daysFromNow(event?.eventDate);

  const isToday = dayLabel === "Today";

  return (
    <div
      className="
    bg-white px-4 py-3 rounded-xl border border-slate-200
    hover:shadow-md hover:-translate-y-[1px]
    transition-all duration-200
    flex justify-between items-center
  "
    >
      {/* LEFT SIDE */}
      <div className="flex-1 min-w-0">
        {/* Title Row */}
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-slate-800 text-sm truncate first-letter:capitalize">
            {event?.eventTitle}
          </h3>

          {isToday && (
            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
              Today
            </span>
          )}
        </div>

        {/* Meta Row (single line) */}
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <FiCalendar size={12} />
            {formatDate(event?.eventDate)}
          </span>

          {event?.eventTime && (
            <span className="flex items-center gap-1">
              <FiClock size={12} />
              {formatTime(event?.eventTime)}
            </span>
          )}

          {event?.eventCategoryName && (
            <span className="flex items-center gap-1 text-slate-400">
              <FiTag size={12} />
              {event.eventCategoryName}
            </span>
          )}

          <span className="text-[10px] text-slate-400">{dayLabel}</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <button
        onClick={() => {
          setDeleteEventId(event?.eventId);
          setShowDeleteModal(true);
        }}
        className="
      ml-3 p-2 rounded-lg 
      text-slate-400 hover:text-red-600 cursor-pointer 
      hover:bg-red-50 transition
    "
      >
        <FiTrash2 size={14} />
      </button>
    </div>
  );
}
