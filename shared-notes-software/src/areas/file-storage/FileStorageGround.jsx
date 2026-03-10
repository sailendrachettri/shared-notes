import React, { useState } from "react";
import MainLayout from "../../reusable/layouts/MainLayout";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GrStorage } from "react-icons/gr";

const icons = {
  folder: (color = "#FFB900") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 6C2 4.9 2.9 4 4 4H9.17C9.7 4 10.2 4.21 10.57 4.59L11.83 5.84C12.21 6.22 12.7 6.44 13.24 6.44H20C21.1 6.44 22 7.34 22 8.44V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z"
        fill={color}
      />
      <path d="M2 10H22" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
    </svg>
  ),
  pdf: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#E74C3C" />
      <rect x="3" y="2" width="14" height="18" rx="2" fill="url(#pdfGrad)" />
      <path d="M14 2L17 5V8H14V2Z" fill="#C0392B" />
      <text
        x="5"
        y="15"
        fontSize="5"
        fill="white"
        fontWeight="bold"
        fontFamily="Arial"
      >
        PDF
      </text>
      <defs>
        <linearGradient
          id="pdfGrad"
          x1="3"
          y1="2"
          x2="17"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6B6B" />
          <stop offset="1" stopColor="#E74C3C" />
        </linearGradient>
      </defs>
    </svg>
  ),
  txt: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#5B9BD5" />
      <path d="M14 2L17 5V8H14V2Z" fill="#2E75B6" />
      <line
        x1="6"
        y1="11"
        x2="14"
        y2="11"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="6"
        y1="13.5"
        x2="14"
        y2="13.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="6"
        y1="16"
        x2="11"
        y2="16"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  png: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#27AE60" />
      <path d="M14 2L17 5V8H14V2Z" fill="#1E8449" />
      <circle cx="8" cy="11" r="1.5" fill="white" opacity="0.8" />
      <path
        d="M5 16L8 12L11 14.5L13 13L15.5 16H5Z"
        fill="white"
        opacity="0.8"
      />
    </svg>
  ),
  xlsx: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#107C41" />
      <path d="M14 2L17 5V8H14V2Z" fill="#0A5C2F" />
      <text
        x="5.5"
        y="16"
        fontSize="7"
        fill="white"
        fontWeight="bold"
        fontFamily="Arial"
      >
        XLS
      </text>
    </svg>
  ),
  pptx: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#D04423" />
      <path d="M14 2L17 5V8H14V2Z" fill="#A33519" />
      <rect
        x="6"
        y="10"
        width="8"
        height="5"
        rx="1"
        fill="white"
        opacity="0.3"
      />
      <text
        x="5.5"
        y="16"
        fontSize="5.5"
        fill="white"
        fontWeight="bold"
        fontFamily="Arial"
      >
        PPT
      </text>
    </svg>
  ),
  default: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#8E8E8E" />
      <path d="M14 2L17 5V8H14V2Z" fill="#6B6B6B" />
    </svg>
  ),
};

const ChevronRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="9,18 15,12 9,6" />
  </svg>
);

const ArrowLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="15,18 9,12 15,6" />
  </svg>
);

const ArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="9,18 15,12 9,6" transform="rotate(180 12 12)" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UploadIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="16,16 12,12 8,16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const FolderPlusIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);

const GridIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const DotsIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="5" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
  </svg>
);

const SortIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line
      x1="12"
      y1="18"
      x2="12"
      y2="18"
      strokeLinecap="round"
      strokeWidth="3"
    />
  </svg>
);

const getFileIcon = (file) => {
  if (file.type === "folder") return icons.folder();
  const map = {
    pdf: icons.pdf,
    txt: icons.txt,
    png: icons.png,
    jpg: icons.png,
    xlsx: icons.xlsx,
    pptx: icons.pptx,
  };
  return (map[file.extension] || icons.default)();
};

const getLargeIcon = (file) => {
  if (file.type === "folder") {
    return (
      <svg width="43" height="52" viewBox="0 0 56 56" fill="none">
        <path
          d="M4 14C4 11.8 5.8 10 8 10H21.4C22.5 10 23.5 10.45 24.2 11.22L26.6 13.8C27.3 14.57 28.3 15 29.4 15H48C50.2 15 52 16.8 52 19V44C52 46.2 50.2 48 48 48H8C5.8 48 4 46.2 4 44V14Z"
          fill="#FFB900"
        />
        <path
          d="M4 22H52V44C52 46.2 50.2 48 48 48H8C5.8 48 4 46.2 4 44V22Z"
          fill="#FFC832"
        />
        <rect x="4" y="22" width="48" height="2" fill="#FFB900" opacity="0.5" />
      </svg>
    );
  }
  const colorMap = {
    pdf: "#E74C3C",
    txt: "#5B9BD5",
    png: "#27AE60",
    jpg: "#27AE60",
    xlsx: "#107C41",
    pptx: "#D04423",
  };
  const labelMap = {
    pdf: "PDF",
    txt: "TXT",
    png: "PNG",
    jpg: "JPG",
    xlsx: "XLS",
    pptx: "PPT",
  };
  const c = colorMap[file.extension] || "#8E8E8E";
  const label =
    labelMap[file.extension] || file.extension?.toUpperCase() || "FILE";
  return (
    <svg width="44" height="52" viewBox="0 0 44 56" fill="none">
      <path d="M4 2H30L40 12V54H4V2Z" rx="3" fill={c} />
      <path d="M4 2H30L40 12V54H4V2Z" fill="url(#docGrad)" />
      <path d="M30 2L40 12H30V2Z" fill="rgba(0,0,0,0.2)" />
      <text
        x="8"
        y="38"
        fontSize="9"
        fill="white"
        fontWeight="bold"
        fontFamily="'Segoe UI', Arial"
      >
        {label}
      </text>
      <defs>
        <linearGradient
          id="docGrad"
          x1="4"
          y1="2"
          x2="40"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={c} stopOpacity="0.9" />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
    </svg>
  );
};

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

const files = [
  {
    name: "Project Docs",
    type: "folder",
    size: "--",
    modified: "Nov 12, 2024",
    items: 12,
    category: "folder",
  },
  {
    name: "Design Assets",
    type: "folder",
    size: "--",
    modified: "Nov 8, 2024",
    items: 8,
    category: "folder",
  },
  {
    name: "Archives",
    type: "folder",
    size: "--",
    modified: "Oct 22, 2024",
    items: 34,
    category: "folder",
  },
  {
    name: "report.pdf",
    type: "file",
    size: "1.2 MB",
    modified: "Nov 14, 2024",
    extension: "pdf",
  },
  {
    name: "meeting-notes.txt",
    type: "file",
    size: "48 KB",
    modified: "Nov 15, 2024",
    extension: "txt",
  },
  {
    name: "image.png",
    type: "file",
    size: "2.4 MB",
    modified: "Nov 7, 2024",
    extension: "png",
  },
  {
    name: "budget.xlsx",
    type: "file",
    size: "890 KB",
    modified: "Nov 12, 2024",
    extension: "xlsx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
  {
    name: "presentation.pptx",
    type: "file",
    size: "5.1 MB",
    modified: "Nov 10, 2024",
    extension: "pptx",
  },
];

export default function FileExplorer() {
  const [view, setView] = useState("list");
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Documents");
  const [expandedNav, setExpandedNav] = useState(["Quick access"]);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );
  const folders = filtered.filter((f) => f.type === "folder");
  const fileItems = filtered.filter((f) => f.type === "file");

  const toggleExpand = (label) => {
    setExpandedNav((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  return (
    <>
      <MainLayout
        sidebar={
          <section>
            {/* Sidebar */}
            <div className="flex-1 overflow-auto py-1 px-1 mt-2">
              {/* Brand */}
              <div className="flex items-center gap-3 px-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow">
                  <GrStorage  size={24} />
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
                      <ChevronRight />
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
          </section>
        }
        content={
          <section className="flex flex-col h-full min-h-0 px-3">
            {/* Top toolbar */}
            <div className="border-b border-gray-200 bg-white pt-2 ">
              {/* Navigation row */}
              <div className="flex items-center gap-1 mb-2">
                {/* Back */}
                <button className="p-1.5 rounded text-gray-500 hover:bg-primary/10 cursor-pointer hover:text-primary transition-colors">
                  <MdKeyboardArrowLeft />
                </button>

                {/* Forward */}
                <button className="p-1.5 rounded text-gray-400 hover:bg-primary/10 cursor-pointer hover:text-primary transition-colors">
                  <MdKeyboardArrowRight />
                </button>

                {/* Address bar */}
                <div className="flex items-center gap-1 flex-1 px-3 py-1 mx-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-white hover:border-primary transition-all cursor-pointer text-[12.5px]">
                  {icons.folder("#FFB900")}

                  <span className="text-gray-400 mx-1">
                    <ChevronRight />
                  </span>

                  <span className="font-medium text-gray-700">This PC</span>

                  <span className="text-gray-400 mx-1">
                    <ChevronRight />
                  </span>

                  <span className="font-medium text-gray-700">Documents</span>

                  <span className="text-gray-400 mx-1">
                    <ChevronRight />
                  </span>

                  <span className="text-primary font-medium">Projects</span>
                </div>

                {/* Toolbar actions */}
                <div className="flex items-center gap-1">
                  {/* Upload */}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-md bg-primary text-white text-[12px] font-medium hover:bg-primary/90 transition-colors">
                    <UploadIcon /> Upload
                  </button>

                  {/* New folder */}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-md border border-gray-300 bg-white hover:bg-primary/10 hover:text-primary hover:border-primary/20 text-[12px] transition-colors">
                    <FolderPlusIcon /> New folder
                  </button>

                  <div className="w-px h-5 bg-gray-200 mx-1" />

                  {/* Grid view */}
                  <button
                    onClick={() => setView("grid")}
                    className={`p-1.5 rounded transition-colors
        ${
          view === "grid"
            ? "bg-primary/10 text-primary"
            : "text-gray-500 hover:bg-primary/10 hover:text-primary"
        }`}
                  >
                    <GridIcon />
                  </button>

                  {/* List view */}
                  <button
                    onClick={() => setView("list")}
                    className={`p-1.5 rounded transition-colors
        ${
          view === "list"
            ? "bg-primary/10 text-primary"
            : "text-gray-500 hover:bg-primary/10 hover:text-primary"
        }`}
                  >
                    <ListIcon />
                  </button>

                  {/* Sort */}
                  <button className="p-1.5 rounded text-gray-500 hover:bg-primary/10 hover:text-primary transition-colors ml-1">
                    <SortIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* File area */}
            <div className="flex-1 overflow-auto min-h-0">
              {view === "list" ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {["Name", "Date modified", "Type", "Size"].map((h, i) => (
                        <th
                          key={h}
                          className={`text-left px-3 py-[6px] text-[11.5px] font-semibold text-gray-500 tracking-wide cursor-pointer select-none
              ${i === 0 ? "w-[45%]" : i === 3 ? "w-[10%]" : "w-[20%]"}`}
                        >
                          {h}
                        </th>
                      ))}
                      <th className="w-[5%]" />
                    </tr>
                  </thead>

                  <tbody>
                    {/* Folders */}
                    {folders.map((file, i) => (
                      <FileRow
                        key={i}
                        file={file}
                        index={i}
                        selected={selectedFile === `f${i}`}
                        onSelect={() => setSelectedFile(`f${i}`)}
                      />
                    ))}

                    {/* Divider */}
                    {folders.length > 0 && fileItems.length > 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="h-[4px] bg-gray-50 border-b border-gray-100"
                        />
                      </tr>
                    )}

                    {/* Files */}
                    {fileItems.map((file, i) => (
                      <FileRow
                        key={i}
                        file={file}
                        index={i}
                        selected={selectedFile === `d${i}`}
                        onSelect={() => setSelectedFile(`d${i}`)}
                      />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4">
                  {/* Folders */}
                  {folders.length > 0 && (
                    <>
                      <div className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2 pl-1">
                        FOLDERS
                      </div>

                      <div className="grid gap-1 mb-5 grid-cols-[repeat(auto-fill,minmax(130px,1fr))]">
                        {folders.map((file, i) => (
                          <GridItem
                            key={i}
                            file={file}
                            index={i}
                            selected={selectedFile === `gf${i}`}
                            onSelect={() => setSelectedFile(`gf${i}`)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Files */}
                  {fileItems.length > 0 && (
                    <>
                      <div className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2 pl-1">
                        FILES
                      </div>

                      <div className="grid gap-1 grid-cols-[repeat(auto-fill,minmax(130px,1fr))]">
                        {fileItems.map((file, i) => (
                          <GridItem
                            key={i}
                            file={file}
                            index={i}
                            selected={selectedFile === `gd${i}`}
                            onSelect={() => setSelectedFile(`gd${i}`)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        }
      />
    </>
  );
}

function FileRow({ file, index, selected, onSelect }) {
  return (
    <tr
      onClick={onSelect}
      onDoubleClick={() => {}}
      className={`group select-none cursor-default transition-colors
      ${selected ? "bg-blue-50" : "hover:bg-gray-100"}`}
    >
      <td className="px-3 py-[5px]">
        <div className="flex items-center gap-2">
          {getFileIcon(file)}
          <span className="text-[13px] text-gray-800 font-normal">
            {file.name}
          </span>
        </div>
      </td>

      <td className="px-2 py-[4px] text-[12.5px] text-gray-500">
        {file.modified}
      </td>

      <td className="px-2 py-[4px] text-[12.5px] text-gray-500">
        {file.type === "folder"
          ? "File folder"
          : `${file.extension?.toUpperCase()} File` || "File"}
      </td>

      <td className="px-2 py-[4px] text-[12.5px] text-gray-500">{file.size}</td>

      <td className="px-[6px] py-[5px] text-right">
        <button
          className={`p-[2px] rounded text-gray-400 hover:bg-gray-200
          ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          transition`}
        >
          <DotsIcon />
        </button>
      </td>
    </tr>
  );
}

function GridItem({ file, index, selected, onSelect }) {
  const isLongName = file.name.length > 22;
  const displayName = isLongName ? file.name.slice(0, 22) + "…" : file.name;

  return (
    <div
      onClick={onSelect}
      className={`flex flex-col items-center py-3 rounded-md select-none transition-all border
  ${
    selected
      ? "bg-[#d2556407] border-[#d25564]"
      : "border-transparent hover:bg-[#d2556410] hover:border-[#d2556413]"
  }`}
    >
      <div className="mb-2">{getLargeIcon(file)}</div>

      <div className="text-[12px] text-center text-gray-800 break-words leading-[1.3] max-w-[110px]">
        {displayName}
      </div>

      <div className="text-[11px] text-gray-400 mt-[2px]">
        {file.type === "folder" ? `${file.items} items` : file.size}
      </div>
    </div>
  );
}
