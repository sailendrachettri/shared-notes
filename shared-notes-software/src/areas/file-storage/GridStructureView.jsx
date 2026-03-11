import { FcOpenedFolder } from "react-icons/fc";

const GridStructureView = ({
  folders,
  setSelectedFile,
  selectedFile,
  heading,
  openFolder,
}) => {
  console.log(folders);

  return (
    <>
      {folders?.length > 0 && (
        <section>
          <div className="text-[11px] uppercase font-semibold text-gray-400 tracking-wider mb-2 pl-1">
            {heading || "FOLDERS"}
          </div>

          <div className="grid gap-1 mb-5 grid-cols-[repeat(auto-fill,minmax(100px,1fr))] cursor-default">
            {/* Create new folder input */}

            {/* Folder items */}
            {folders?.map((folder, i) => {
              const isLongName = folder?.folder_name?.length > 22;
              const displayName = isLongName
                ? folder.folder_name.slice(0, 30) + "…"
                : folder.folder_name;

              const selected = selectedFile?.folder_id === folder?.folder_id;

              return (
                <div
                  key={folder.folder_id || i}
                  onClick={() => setSelectedFile(folder)}
                  onDoubleClick={() => openFolder(folder)}
                  className={`flex flex-col items-center py-2 px-1 rounded-md select-none transition-all border
                ${
                  selected
                    ? "bg-[#d2556407] border-primary"
                    : "border-transparent hover:bg-[#d2556410] hover:border-[#d2556413]"
                }`}
                >
                  <FcOpenedFolder size={40} />

                  <div className="text-[12px] text-center text-gray-800 wrap-break-word leading-[1.2] max-w-27.5 px-1.75">
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
