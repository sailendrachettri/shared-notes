import React, { useState } from "react";

const sidebarItems = [
  { sidebar_id: 1, sidebar_title: "Project Alpha" },
  { sidebar_id: 2, sidebar_title: "Project Beta" },
  { sidebar_id: 3, sidebar_title: "Project Gamma" },
  { sidebar_id: 4, sidebar_title: "Project Delta" },
  { sidebar_id: 5, sidebar_title: "Project Omega" },
];

const Sidebar = () => {
  const [active, setActive] = useState(1);

  return (
    <aside className="h-full flex flex-col bg-white">

      {/* Project List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.sidebar_id}
            onClick={() => setActive(item.sidebar_id)}
            className={`w-full text-left px-4 py-3 cursor-pointer rounded-xl transition-all duration-200
              ${
                active === item.sidebar_id
                  ? "bg-slate-50 text-primary"
                  : "text-gray-600  hover:text-gray-500"
              }
            `}
          >
            {item.sidebar_title}
          </button>
        ))}
      </div>
      
    </aside>
  );
};

export default Sidebar;
