import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { FcOpenedFolder } from "react-icons/fc";

const FolderCard = ({
  folder,
  isSelected,
  onClick,
  onDoubleClick,
  onContextMenu,
  renaming,
  handleRename,
  setRenaming,
}) => {
  const name = folder?.folder_name ?? "";
  const displayName = name.length > 30 ? name.slice(0, 30) + "…" : name;
  console.log(renaming);
  const [editName, setEditName] = useState(name || "");
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!editName.trim()) {
        customToast.error("Please enter a valid name");
        return;
      }
      handleRename(editName);
      setRenaming(false);
    } else if (e.key === "Escape") {
      handleRename(null);
      setRenaming(false);
    }
  };

  const handleBlur = () => {
    handleRename(null);
    setRenaming(false);
  };

  useEffect(() => {
    if (renaming) {
      setEditName(name || "");

      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [renaming, name]);

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
      {/* <p className="text-[12px] text-center text-gray-800 wrap-break-word leading-[1.3] w-22 px-1 mt-1.5">
        {}
      </p> */}
      <div className="mt-2 max-w-[90px] text-center pt-2">
        {renaming && isSelected ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full text-[12px] text-center border border-primary rounded px-1 outline-none"
          />
        ) : (
          <div className="tooltip text-[12px] text-center text-gray-800 break-words leading-[1.3] line-clamp-5 max-w-[90px]">
            {displayName}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderCard;
