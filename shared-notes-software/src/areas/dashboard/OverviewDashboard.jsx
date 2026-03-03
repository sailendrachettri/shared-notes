import React from "react";
import { FiFileText, FiGrid, FiCheckSquare } from "react-icons/fi";

const OverviewDashboard = () => {
  const stats = [
    {
      id: 1,
      title: "Shared Notes",
      value: 4,
      icon: <FiFileText className="text-xl" />,
    },
    {
      id: 2,
      title: "Private Notes",
      value: 8,
      icon: <FiFileText className="text-xl" />,
    },
    {
      id: 3,
      title: "Workspaces",
      value: 8,
      icon: <FiGrid className="text-xl" />,
    },
    {
      id: 4,
      title: "Active Projects",
      value: 2,
      icon: <FiCheckSquare className="text-xl" />,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-5 w-full">
      {stats.map((item) => (
        <div
          key={item.id}
          className="group w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between w-full ">
            {/* Left Content */}
            <div className="flex flex-col">
              <span className="text-sm text-slate-500 font-medium text-nowrap">
                {item.title}
              </span>
              <span className="text-3xl font-semibold text-slate-800 mt-1">
                {item.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewDashboard;
