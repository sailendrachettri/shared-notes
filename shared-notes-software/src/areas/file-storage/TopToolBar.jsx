import React from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

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

const TopToolBar = ({
  view,
  setView,
  setCreatingFolder,
  setNewFolderName,
  goBack,
  folderStack,
  setCurrentFolderId,
  setFolderStack,
  goForward,
  forwardStack,
}) => {
  const visibleStack =
    folderStack.length > 5
      ? [
          { ...folderStack[0], realIndex: 0 },
          { id: "ellipsis", name: "..." },
          ...folderStack.slice(-3).map((f, i) => ({
            ...f,
            realIndex: folderStack.length - 3 + i,
          })),
        ]
      : folderStack.map((f, i) => ({ ...f, realIndex: i }));

  const navigateBreadcrumb = (index) => {
    const selected = folderStack[index];

    setCurrentFolderId(selected.id);

    setFolderStack(folderStack.slice(0, index + 1));
  };

  console.log(folderStack);

  return (
    <>
      <div className="border-b border-gray-200 bg-white pt-2 ">
        {/* Navigation row */}
        <div className="flex items-center gap-1 mb-2">
          {/* Back */}
          <button
            onClick={goBack}
            className={`${folderStack?.length > 0 ? "text-gray-500 cursor-pointer hover:text-primary hover:bg-primary/10" : "text-gray-400 cursor-not-allowed"} p-1.5 rounded transition-colors`}
          >
            <MdKeyboardArrowLeft />
          </button>

          {/* Forward */}
          <button
            onClick={goForward}
            className={`${forwardStack?.length > 0 ? "text-gray-500 cursor-pointer hover:text-primary hover:bg-primary/10" : "text-gray-400 cursor-not-allowed"} p-1.5 rounded    transition-colors`}
          >
            <MdKeyboardArrowRight />
          </button>

          {/* Address bar */}
          <div className="flex items-center gap-1 flex-1 px-3 py-1 mx-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-white transition-all cursor-pointer text-[12.5px]">
            <div className="flex items-center text-sm text-gray-600 gap-1">
              <span
                className="cursor-pointer hover:underline"
                onClick={() => {
                  setCurrentFolderId(null);
                  setFolderStack([]);
                }}
              >
                Home
              </span>

              {visibleStack?.map((item, index) => (
                <React.Fragment key={item?.id}>
                  <MdKeyboardArrowRight size={16} />

                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() => navigateBreadcrumb(item.realIndex)}
                  >
                    {item?.name}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Toolbar actions */}
          <div className="flex items-center gap-1">
            {/* Upload */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-md bg-primary text-white text-[12px] font-medium hover:bg-primary/90 transition-colors">
              <UploadIcon /> Upload
            </button>

            {/* New folder */}
            <button
              onClick={() => {
                setCreatingFolder(true);
                setNewFolderName("New Folder");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-md border border-gray-300 bg-white hover:bg-primary/10 hover:text-primary hover:border-primary/20 text-[12px] transition-colors"
            >
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
            {/* <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded transition-colors
        ${
          view === "list"
            ? "bg-primary/10 text-primary"
            : "text-gray-500 hover:bg-primary/10 hover:text-primary"
        }`}
            >
              <ListIcon />
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopToolBar;
