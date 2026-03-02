import React from "react";
import { FiFileText, FiGrid, FiCheckSquare } from "react-icons/fi";

const OverviewDashboard = () => {
  const stats = [
    {
      id: 1,
      title: "Notes",
      value: 4,
      icon: <FiFileText className="text-xl" />,
    },
    {
      id: 2,
      title: "Workspaces",
      value: 8,
      icon: <FiGrid className="text-xl" />,
    },
    {
      id: 3,
      title: "Active Projects",
      value: 2,
      icon: <FiCheckSquare className="text-xl" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-5">
      {stats.map((item) => (
        <div
          key={item.id}
          className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            {/* Left Content */}
            <div className="flex flex-col">
              <span className="text-sm text-slate-500 font-medium">
                {item.title}
              </span>
              <span className="text-3xl font-semibold text-slate-800 mt-1">
                {item.value}
              </span>
            </div>

            {/* Icon */}
            {/* <div className="p-3 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-200">
              {item.icon}
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewDashboard;