import React from "react";
import { FiFileText, FiClock, FiArrowUpRight } from "react-icons/fi";

const RecentNotesSection = () => {
  // Dummy data
  const notes = [
    {
      id: 1,
      title: "Product Strategy Planning",
      workspace: "Product Roadmap",
      edited: "2 hours ago",
    },
    {
      id: 2,
      title: "Marketing Launch Checklist",
      workspace: "Marketing Strategy",
      edited: "Yesterday",
    },
    {
      id: 3,
      title: "Mobile App Feature Ideas",
      workspace: "Mobile App Planning",
      edited: "3 days ago",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Recently Edited
        </h2>
        <button className="text-xs text-primary font-medium hover:underline">
          View All
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {notes.map((note) => (
          <div
            key={note.id}
            className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            {/* Top */}
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-xl bg-slate-100">
                <FiFileText className="text-slate-600 text-lg" />
              </div>

              <FiArrowUpRight className="text-slate-400 group-hover:text-primary transition-colors duration-200" />
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-slate-800 mb-1 truncate">
              {note.title}
            </h3>

            {/* Workspace */}
            <p className="text-xs text-slate-500 truncate mb-3">
              {note.workspace}
            </p>

            {/* Footer */}
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <FiClock />
              {note.edited}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentNotesSection;