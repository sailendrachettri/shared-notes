import NoResultFound from "../../utils/info-screen/NoResultFound";
import dirSvg from "../../assets/svgs/files_dir.svg";
import FileCard from "./FileCard";
import FolderCard from "./FolderCard";
import { getMenuPosition } from "../../utils/window-functions/getMenuPosition";

const GridStructureView = ({
  dataItems,
  setSelectedFile,
  selectedFile,
  heading,
  openFolder,
  isSubfolder,
  itemTypeName,
  setContextMenu,
}) => {
  const isEmpty = !dataItems || dataItems.length === 0;

  console.log(isEmpty);
  console.log(isSubfolder);
  console.log(itemTypeName);

  return (
    <section className="mb-6">
      {/* Section heading */}
      {itemTypeName == "file" && !isEmpty && (
        <p className="text-[11px] uppercase font-semibold text-gray-400 tracking-wider mb-2.5 pl-0.5">
          {heading || "Documents"}
        </p>
      )}
      {itemTypeName == "folder" && !isEmpty && (
        <p className="text-[11px] uppercase font-semibold text-gray-400 tracking-wider mb-2.5 pl-0.5">
          {heading || "Documents"}
        </p>
      )}

      {itemTypeName === "file" ? (
        // ── File card grid ──
        <div className="grid gap-2.5 grid-cols-[repeat(auto-fill,minmax(148px,1fr))]">
          {dataItems?.map((file) => (
            <FileCard
              key={file.file_id}
              file={file}
              isSelected={selectedFile?.file_id === file.file_id}
              onClick={() => setSelectedFile(file)}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedFile(file);
                const pos = getMenuPosition(e.pageX, e.pageY);

                setContextMenu({
                  x: pos.x,
                  y: pos.y,
                  type: "file",
                });
              }}
            />
          ))}
        </div>
      ) : (
        // ── Folder icon grid ──
        <div className="grid gap-1 grid-cols-[repeat(auto-fill,minmax(100px,1fr))]">
          {dataItems?.map((folder, i) => (
            <FolderCard
              key={folder.folder_id ?? i}
              folder={folder}
              isSelected={selectedFile?.folder_id === folder?.folder_id}
              onClick={() => setSelectedFile(folder)}
              onDoubleClick={() => openFolder(folder)}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedFile(folder);
                const pos = getMenuPosition(e.pageX, e.pageY);

                setContextMenu({
                  x: pos.x,
                  y: pos.y,
                  type: "folder",
                });
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default GridStructureView;
