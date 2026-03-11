const GridStructureView = ({
  getLargeIcon,
  folders,
  setSelectedFile,
  selectedFile,
  heading,
}) => {
  return (
    <>
      {folders?.length > 0 && (
        <section>
          <div className="text-[11px] uppercase font-semibold text-gray-400 tracking-wider mb-2 pl-1">
            {heading || "FOLDERS"}
          </div>

          <div className="grid gap-1 mb-5 grid-cols-[repeat(auto-fill,minmax(100px,1fr))]">
            {/* Create new folder input */}

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
                  <div className="mb-1">{getLargeIcon({ type: "folder" })}</div>

                  <div className="text-[12px] text-center text-gray-800 break-words leading-[1.2] max-w-[110px] px-[7px]">
                    {displayName}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
};

export default GridStructureView;
