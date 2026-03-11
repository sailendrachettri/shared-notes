import React from "react";

const GridStructureView = ({
  getLargeIcon,
  setNewFolderName,
  createFolder,
  setCreatingFolder,
  creatingFolder,
  newFolderName,
  view,
  folders,
  setSelectedFile,
  selectedFile,
  createInputRef,
  heading
}) => {

  return (
    <>
      <div className="text-[11px] uppercase font-semibold text-gray-400 tracking-wider mb-2 pl-1">
        {heading || 'FOLDERS'}
      </div>

      <div className="grid gap-1 mb-5 grid-cols-[repeat(auto-fill,minmax(100px,1fr))]">
        
        {/* Create new folder input */}
        {creatingFolder && view === "grid" && (
          <div
            ref={createInputRef}
            className="flex flex-col h-fit items-center rounded-md border bg-[#d2556407] border-[#d25564]"
          >
            <div className="mb-2">{getLargeIcon({ type: "folder" })}</div>

            <input
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createFolder();
                if (e.key === "Escape") setCreatingFolder(false);
              }}
              className="text-[12px] border-t border-primary focus:outline-none focus:border-primary rounded text-center w-full py-1"
            />
          </div>
        )}

        {/* Folder items */}
        {folders?.map((file, i) => {
          const isLongName = file?.folder_name?.length > 22;
          const displayName = isLongName
            ? file.folder_name.slice(0, 22) + "…"
            : file.folder_name;

          const selected = selectedFile?.folder_id === file?.folder_id;

          return (
            <div
              key={file.folder_id || i}
              onClick={() => setSelectedFile(file)}
              className={`flex flex-col items-center py-2 px-1 rounded-md select-none transition-all border
                ${
                  selected
                    ? "bg-[#d2556407] border-[#d25564]"
                    : "border-transparent hover:bg-[#d2556410] hover:border-[#d2556413]"
                }`}
            >
              <div className="mb-1">{getLargeIcon(file)}</div>

              <div className="text-[12px] text-center text-gray-800 break-words leading-[1.2] max-w-[110px] px-[7px]">
                {displayName}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GridStructureView;