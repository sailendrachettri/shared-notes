import React from "react";
import { GrStorage } from "react-icons/gr";
import { MdKeyboardArrowRight } from "react-icons/md";


const navItems = [
  {
    label: "Quick access",
    items: [
      "All Files",
      "Documents",
      "Pictures",
      "Audios",
      "Videos",
      "Code",
      "Applications",
      "Design",
      "Databases",
      "Archives",
    ],
  },
];

const FileStorageSidebar = ({setActiveNav, toggleExpand, expandedNav, activeNav, icons}) => {
  return (
    <>
      <div className="flex-1 overflow-auto py-1 px-1 mt-2">
        {/* Brand */}
        <div className="flex items-center gap-3 px-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow">
            <GrStorage size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg">File Storage</h1>
            <p className="text-xs text-slate-400">By SharedNotes</p>
          </div>
        </div>

        <hr className="my-2 border-slate-200" />

        <div>
          {navItems.map((section) => (
            <div key={section.label}>
              <button
                onClick={() => toggleExpand(section.label)}
                className="flex items-center gap-1 w-full px-2 py-1 rounded text-left text-gray-500 hover:bg-gray-100 transition-colors"
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                }}
              >
                <span
                  style={{
                    transform: expandedNav.includes(section.label)
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.15s",
                    display: "inline-block",
                  }}
                >
                  <MdKeyboardArrowRight />
                </span>
                {section.label.toUpperCase()}
              </button>

              {expandedNav.includes(section.label) &&
                section.items.map((item) => {
                  const isActive = activeNav === item;

                  return (
                    <button
                      key={item}
                      onClick={() => setActiveNav(item)}
                      className={`flex items-center gap-2 w-full mt-1 pl-5 px-2 py-1.5 rounded-md text-left transition-colors text-[12.5px]
            ${
              isActive
                ? "bg-[#E8F0FE] text-primary"
                : "text-gray-700 hover:bg-gray-100 cursor-pointer"
            }`}
                    >
                      <span className="opacity-85">
                        {icons.folder(isActive ? "#d25564" : "#FFB900")}
                      </span>

                      <span>{item}</span>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FileStorageSidebar;
