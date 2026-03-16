import React from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineCreateNewFolder,
  MdGridView,
  MdOutlineCloudUpload,
} from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import ExpandSearch from "../../reusable/inputs/ExpandSearch";

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
  fileRef,
  showHomePage,
  selectedCategoryName,
  setShowHomePage,
  setActiveNav,
  setSearch,
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
          <div
            className={`${showHomePage ? "cursor-not-allowed" : ""} flex items-center gap-1 flex-1 px-3 py-1 mx-2 rounded-full border border-slate-200 bg-slate-50/50  transition-all cursor-pointer text-[12.5px]`}
          >
            {showHomePage ? (
              <div className="flex items-center text-sm text-slate-600 gap-1">
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
            ) : (
              <div>{selectedCategoryName}</div>
            )}
          </div>

          {/* Toolbar actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <ExpandSearch setSearch={setSearch} />
            {/* Upload */}
            <button
              onClick={() => {
                fileRef.current.click();
                setShowHomePage(true);
                setActiveNav(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-md bg-primary text-white text-[12px] font-medium hover:bg-primary/90 transition-colors"
            >
              <MdOutlineCloudUpload size={18} /> <span>Upload</span>
            </button>

            {/* New folder */}
            <button
              onClick={() => {
                setCreatingFolder(true);
                setNewFolderName("New Folder");
                setShowHomePage(true);
                setActiveNav(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-md border border-gray-300 bg-white hover:bg-primary/10 hover:text-primary hover:border-primary/20 text-[12px] transition-colors"
            >
              <MdOutlineCreateNewFolder size={18} className="text-slate-700" />{" "}
              <span>New folder</span>
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
              <MdGridView size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopToolBar;
