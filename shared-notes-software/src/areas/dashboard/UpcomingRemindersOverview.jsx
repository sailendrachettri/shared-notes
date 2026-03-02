import React from "react";
import { FiClock } from "react-icons/fi";

const UpcomingRemindersOverview = () => {
  const reminders = [
    {
      id: 1,
      title: "Client Review",
      project: "Marketing Strategy",
      day: "04",
      month: "MAR",
      time: "6:30 PM",
    },
    {
      id: 2,
      title: "Finalize Wireframes",
      project: "Shared Notes",
      day: "05",
      month: "MAR",
      time: "10:00 AM",
    },
    {
      id: 3,
      title: "Submit Budget",
      project: "Mobile App",
      day: "06",
      month: "MAR",
      time: "4:00 PM",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiClock className="text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-800">
            Upcoming
          </h2>
        </div>
        {/* <span className="text-xs text-slate-500">Top 3</span> */}
      </div>

      {/* Reminder List */}
      <div className="flex flex-col">
        {reminders.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition"
          >
            {/* Date Box */}
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center">
              <span className="text-sm font-semibold text-slate-800 leading-none">
                {item.day}
              </span>
              <span className="text-[10px] text-slate-500 leading-none">
                {item.month}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-800 truncate">
                {item.title}
              </span>
              <span className="text-xs text-slate-500 truncate">
                {item.project} • {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingRemindersOverview;