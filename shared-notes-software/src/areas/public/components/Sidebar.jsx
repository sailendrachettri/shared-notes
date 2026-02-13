import React, { useState } from "react";

const sidebarItems = [
  { sidebar_id: 1, sidebar_title: "Project Alpha" },
  { sidebar_id: 2, sidebar_title: "Project Beta" },
  { sidebar_id: 3, sidebar_title: "Project Gamma" },
  { sidebar_id: 4, sidebar_title: "Project Delta" },
  { sidebar_id: 5, sidebar_title: "Project Omega" },
  { sidebar_id: 6, sidebar_title: "Project Sigma" },
  { sidebar_id: 7, sidebar_title: "Project Nova" },
  { sidebar_id: 8, sidebar_title: "Project Orion" },
  { sidebar_id: 9, sidebar_title: "Project Phoenix" },
  { sidebar_id: 10, sidebar_title: "Project Titan" },
  { sidebar_id: 11, sidebar_title: "Project Atlas" },
  { sidebar_id: 12, sidebar_title: "Project Eclipse" },
  { sidebar_id: 13, sidebar_title: "Project Horizon" },
  { sidebar_id: 14, sidebar_title: "Project Zenith" },
  { sidebar_id: 15, sidebar_title: "Project Vertex" },
  { sidebar_id: 16, sidebar_title: "Project Quantum" },
  { sidebar_id: 17, sidebar_title: "Project Pulse" },
  { sidebar_id: 18, sidebar_title: "Project Fusion" },
  { sidebar_id: 19, sidebar_title: "Project Nebula" },
  { sidebar_id: 20, sidebar_title: "Project Infinity" },
];

const Sidebar = ({ setSelectedNoteId }) => {
  const [active, setActive] = useState(1);

  const handleSelectNote = (noteId) => {
    console.log(noteId);
    setSelectedNoteId(noteId);
    setActive(noteId);
  };

  return (
    <aside className="h-full flex flex-col bg-white ">
      {/* Project List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
        {sidebarItems.map((item) => (
          <button
            key={item.sidebar_id}
            onClick={() => handleSelectNote(item.sidebar_id)}
            className={`w-full text-sm text-left px-3 py-2 cursor-pointer rounded-xl transition-all duration-200
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
