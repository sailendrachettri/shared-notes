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
  GridItem,
  setSelectedFile,
  selectedFile,
  createInputRef
}) => {
  return (
    <>
      <div className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2 pl-1">
        FOLDERS
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
  );
};

export default GridStructureView;
