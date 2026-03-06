import React from "react";
import { FiClock } from "react-icons/fi";

const UpcomingRemindersOverview = ({ userFullReport }) => {
  const reminders = userFullReport?.upcoming_events || [];

  const formatDateParts = (dateString, timeString) => {
    if (!dateString) return {};

    const date = new Date(dateString);

    // If backend sends separate time field
    if (timeString) {
      const [hours, minutes] = timeString.split(":");
      date.setHours(hours);
      date.setMinutes(minutes);
    }

    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
      fullDate: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const isToday = (dateString) => {
    if (!dateString) return false;

    const today = new Date();
    const date = new Date(dateString);

    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-slate-100">
          <FiClock className="text-slate-600 text-lg" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Upcoming</h2>
      </div>

      {/* Reminder List */}
      <div className="flex flex-col">
        {reminders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-sm font-medium text-slate-700">
              No upcoming reminders
            </div>

            <div className="text-xs text-slate-500 mt-1">
              Stay on track by scheduling your events and reminders.
            </div>

            {/* <div className="text-xs text-slate-400 mt-3">
              Configure your event calendar from the sidebar.
            </div> */}
          </div>
        )}

        {reminders.slice(0, 3).map((item) => {
          const { day, month, fullDate, time } = formatDateParts(
            item?.event_date,
            item?.event_time,
          );

          const today = isToday(item?.event_date);

          return (
            <div
              key={item?.event_id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition"
            >
              {/* Date Box */}
              <div
                className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center
                ${
                  today
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                <span className="text-sm font-semibold leading-none">
                  {day}
                </span>
                <span
                  className={`text-[10px] leading-none ${
                    today ? "text-white/80" : "text-slate-500"
                  }`}
                >
                  {month}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800 text-wrap first-letter:capitalize">
                  {item?.event_title}
                  {today && (
                    <span className="ml-10 text-xs py-0.5 px-3 bg-primary/5 text-primary text-center rounded-full">
                      Today
                    </span>
                  )}
                </span>

                <span className="text-xs text-slate-500 truncate">
                  {item?.event_category_name} • {fullDate}
                  {time && ` • ${time}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingRemindersOverview;
