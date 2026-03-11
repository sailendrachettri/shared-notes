import React, { useState } from "react";
import MainLayout from "../../reusable/layouts/MainLayout";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GrStorage } from "react-icons/gr";
import FileStorageSidebar from "./FileStorageSidebar";
import TopToolBar from "./TopToolBar";
import { useEffect } from "react";
import { ADD_FOLDER_URL } from "../../api/api_routes";
import { axiosInstance } from "../../api/axios";
import toast from "react-hot-toast";
import { getItem } from "../../api/storage";
import { useRef } from "react";
import GridStructureView from "./GridStructureView";
import { IoFolderOpenOutline } from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";

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

const getLargeIcon = (file) => {
  if (file?.type === "folder") {
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
  const c = colorMap[file?.extension] || "#8E8E8E";
  const label =
    labelMap[file?.extension] || file?.extension?.toUpperCase() || "FILE";
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

export default function FileExplorer({
  sharedFolders,
  privateFolders,
  creatingFolder,
  publicFolders,
  setCreatingFolder,
  search,
  setSearch,
}) {
  const [view, setView] = useState("grid");
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeNav, setActiveNav] = useState("Documents");
  const [expandedNav, setExpandedNav] = useState(["Quick access"]);
  const [contextMenu, setContextMenu] = useState(null);

  const [newFolderName, setNewFolderName] = useState("");
  const createInputRef = useRef(null);

  const sections = [
    { heading: "Private Folders", data: privateFolders },
    { heading: "Shared Folders", data: sharedFolders },
    { heading: "Public Folders", data: publicFolders },
  ];

  const toggleExpand = (label) => {
    setExpandedNav((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  const handleCreateFolder = async () => {
    const userData = await getItem("user");

    try {
      if (!newFolderName.trim()) return;

      if (!userData?.userId) {
        toast.error("Please login and try again");
        return;
      }

      const payload = {
        FolderName: newFolderName,
        ParentFolderId: null,
        UserId: userData?.userId || null,
        FolderVisibility: userData?.userId ? "private" : "public",
      };

      const res = await axiosInstance.post(ADD_FOLDER_URL, payload);
      if (res?.data?.success === true && res?.data?.status === "CREATED") {
        toast.success(res?.data?.message || "Folder created successfully");
        setSelectedFile({ folder_id: res?.data?.folder_id });
        setCreatingFolder(false);
        setNewFolderName("");
      } else if (
        res?.data?.success === false &&
        res?.data?.status === "EXISTS"
      ) {
        toast.error(res?.data?.message || "Folder already exist");
      } else {
        toast.error("Can't create folder at the moment");
      }
    } catch (error) {
      console.error("Not able to create folder", error);
      toast.error("Can't create folder at the moment");
    } finally {
      // setRefresh((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        creatingFolder &&
        createInputRef.current &&
        !createInputRef.current.contains(e.target)
      ) {
        setCreatingFolder(false);
        setNewFolderName("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [creatingFolder]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyN") {
        e.preventDefault();
        setCreatingFolder(true);
        setNewFolderName("New Folder");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <>
      <MainLayout
        sidebar={
          <section>
            {/* Sidebar */}
            <FileStorageSidebar
              setActiveNav={setActiveNav}
              activeNav={activeNav}
              expandedNav={expandedNav}
              icons={icons}
              toggleExpand={toggleExpand}
            />
          </section>
        }
        content={
          <section className="flex flex-col h-full min-h-0 px-3">
            {/* Top toolbar */}
            <TopToolBar
              icons={icons}
              setView={setView}
              view={view}
              setCreatingFolder={setCreatingFolder}
              setNewFolderName={setNewFolderName}
            />

            {/* File area */}
            <div
              className="flex-1 overflow-auto min-h-0"
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({
                  x: e.pageX,
                  y: e.pageY,
                  type: "blank",
                });
              }}
            >
              <div className="p-4">
                {/* Folders */}
                <div>
                  {creatingFolder && view === "grid" && (
                    <div
                      ref={createInputRef}
                      className="flex flex-col h-[100px] w-[100px] mb-3 items-center rounded-md border bg-[#d2556407] border-[#d25564]"
                    >
                      <div className="mb-2">
                        {getLargeIcon({ type: "folder" })}
                      </div>
                      <input
                        autoFocus
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreateFolder();
                          if (e.key === "Escape") setCreatingFolder(false);
                        }}
                        className="text-[12px] border-t border-primary focus:outline-none focus:border-primary rounded text-center w-full py-1"
                      />
                    </div>
                  )}

                  {sections?.map((section, index) => (
                    <GridStructureView
                      getLargeIcon={getLargeIcon}
                      key={index}
                      folders={section.data}
                      setSelectedFile={setSelectedFile}
                      selectedFile={selectedFile}
                      heading={section.heading}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* right click options */}

            {contextMenu && (
              <div
                style={{
                  top: contextMenu.y,
                  left: contextMenu.x,
                }}
                className="fixed bg-white border border-slate-200 px-1 shadow-lg rounded-md w-44 py-1 z-[999]"
              >
                <button
                  className="w-full flex flex-nowrap gap-x-2 text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  <HiOutlineRefresh size={20} />
                  <span> Refresh</span>
                </button>

                <button
                  className="w-full flex flex-nowrap gap-x-2 text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setCreatingFolder(true);
                    setNewFolderName("New Folder");
                    setContextMenu(null);
                  }}
                >
                  <IoFolderOpenOutline size={20} /> <span>New Folder</span>
                </button>
              </div>
            )}
          </section>
        }
      />
    </>
  );
}
