import React from "react";
import { FcOpenedFolder } from "react-icons/fc";

const FolderCard = ({ folder, isSelected, onClick, onDoubleClick, onContextMenu }) => {
  const name = folder?.folder_name ?? "";
  const displayName = name.length > 30 ? name.slice(0, 30) + "…" : name;

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className={`flex flex-col items-center py-2.5 px-1.5 rounded-lg select-none transition-all border cursor-default
        ${
          isSelected
            ? "bg-[#d2556407] border-primary/30"
            : "border-transparent hover:bg-[#d2556410] hover:border-[#d2556413]"
        }`}
    >
      <FcOpenedFolder size={40} />
      <p className="text-[12px] text-center text-gray-800 break-words leading-[1.3] max-w-[88px] px-1 mt-1.5">
        {displayName}
      </p>
    </div>
  );
};

export default FolderCard;
