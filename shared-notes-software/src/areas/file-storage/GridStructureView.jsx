import NoResultFound from "../../utils/info-screen/NoResultFound";
import dirSvg from "../../assets/svgs/files_dir.svg";
import FileCard from "./FileCard";
import FolderCard from "./FolderCard";

const GridStructureView = ({
  dataItems,
  setSelectedFile,
  selectedFile,
  heading,
  openFolder,
  isSubfolder,
  itemTypeName,
}) => {
  const isEmpty = !dataItems || dataItems.length === 0;

  if (isEmpty) {
    return (
      <section>
        {isSubfolder === "yes" && (
          <NoResultFound
            desc="This folder is empty. Create a new folder (Ctrl + Shift + N) or upload files by right-clicking anywhere in this area."
            img={dirSvg}
            title="Empty Directory"
          />
        )}
      </section>
    );
  }

  return (
    <section className="mb-6">
      {/* Section heading */}
      <p className="text-[11px] uppercase font-semibold text-gray-400 tracking-wider mb-2.5 pl-0.5">
        {heading || "Documents"}
      </p>

      {itemTypeName === "file" ? (
        // ── File card grid ──
        <div className="grid gap-2.5 grid-cols-[repeat(auto-fill,minmax(148px,1fr))]">
          {dataItems?.map((file) => (
            <FileCard
              key={file.file_id}
              file={file}
              isSelected={selectedFile?.file_id === file.file_id}
              onClick={() => setSelectedFile(file)}
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
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default GridStructureView;
