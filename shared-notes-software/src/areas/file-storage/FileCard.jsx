import Tooltip from "../../utils/tooltips/ToolTip";
import { VIEW_UPLOADED_FILE_URL } from "../../config/env";
import { getFileIcon } from "../../utils/string-formate/iconsMapping";
import { useEffect, useRef, useState } from "react";
import { customToast } from "../../utils/toast/toastConfig";
const FILE_TYPE_MAP = {
  jpg: {
    group: "image",
    thumbBg: "bg-pink-50",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
  },
  jpeg: {
    group: "image",
    thumbBg: "bg-pink-50",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
  },
  png: {
    group: "image",
    thumbBg: "bg-pink-50",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
  },
  svg: {
    group: "image",
    thumbBg: "bg-pink-50",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
  },
  gif: {
    group: "image",
    thumbBg: "bg-pink-50",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
  },
  webp: {
    group: "image",
    thumbBg: "bg-pink-50",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
  },
  mp4: {
    group: "video",
    thumbBg: "bg-purple-50",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
  },
  mkv: {
    group: "video",
    thumbBg: "bg-purple-50",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
  },
  webm: {
    group: "video",
    thumbBg: "bg-purple-50",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
  },
  mov: {
    group: "video",
    thumbBg: "bg-purple-50",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
  },
  mp3: {
    group: "audio",
    thumbBg: "bg-green-50",
    badgeBg: "bg-green-100",
    badgeText: "text-green-800",
  },
  wav: {
    group: "audio",
    thumbBg: "bg-green-50",
    badgeBg: "bg-green-100",
    badgeText: "text-green-800",
  },
  pdf: {
    group: "pdf",
    thumbBg: "bg-red-50",
    badgeBg: "bg-red-100",
    badgeText: "text-red-800",
  },
  doc: {
    group: "document",
    thumbBg: "bg-blue-50",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
  },
  docx: {
    group: "document",
    thumbBg: "bg-blue-50",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
  },
  txt: {
    group: "document",
    thumbBg: "bg-blue-50",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
  },
  xls: {
    group: "document",
    thumbBg: "bg-emerald-50",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
  xlsx: {
    group: "document",
    thumbBg: "bg-emerald-50",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
  csv: {
    group: "document",
    thumbBg: "bg-emerald-50",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
  zip: {
    group: "archive",
    thumbBg: "bg-amber-50",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
  },
  rar: {
    group: "archive",
    thumbBg: "bg-amber-50",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
  },
  "7z": {
    group: "archive",
    thumbBg: "bg-amber-50",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
  },
};

const DEFAULT_TYPE = {
  group: "other",
  thumbBg: "bg-gray-50",
  badgeBg: "bg-gray-100",
  badgeText: "text-gray-700",
};

const getTypeConfig = (ext) =>
  FILE_TYPE_MAP[ext?.toLowerCase()] ?? DEFAULT_TYPE;

// ─── Sprocket column (reused left & right) ───────────────────────────────────
const SprocketStrip = ({ side }) => (
  <div
    style={{
      position: "absolute",
      [side]: 0,
      top: 0,
      bottom: 0,
      width: "9px",
      background: "#111111",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-evenly",
      paddingBlock: "5px",
      zIndex: 2,
    }}
  >
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        style={{
          width: "5px",
          height: "4px",
          borderRadius: "1px",
          background: "#2b2b2b",
          border: "0.5px solid #3d3d3d",
          boxShadow: "inset 0 1px 1px rgba(0,0,0,0.9)",
        }}
      />
    ))}
  </div>
);

// ─── Windows Explorer–style video frame ──────────────────────────────────────
const VideoFrame = ({ thumbPath, fileName }) => (
  <div
    style={{
      position: "relative",
      width: "86px",
      height: "64px",
      flexShrink: 0,
    }}
  >
    {/* Main film-strip shell */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "4px",
        background: "#1a1a1a",
        boxShadow:
          "0 2px 6px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      <SprocketStrip side="left" />
      <SprocketStrip side="right" />

      {/* Viewable area between strips */}
      <div
        style={{
          position: "absolute",
          left: "9px",
          right: "9px",
          top: 0,
          bottom: 0,
          overflow: "hidden",
          background: "#0d0d0d",
        }}
      >
        {thumbPath ? (
          <img
            src={`${VIEW_UPLOADED_FILE_URL}/thumbnails/${thumbPath}`}
            alt={fileName?.substr(0, 5) + "..."}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          /* Dark fallback with centred play icon */
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(160deg, #1c1a2e 0%, #0d0b14 100%)",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: "14px solid rgba(255,255,255,0.45)",
                marginLeft: "2px",
                filter: "drop-shadow(0 0 4px rgba(255,255,255,0.15))",
              }}
            />
          </div>
        )}

        {/* Glossy top sheen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            top: 0,
            height: "35%",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>

    {/* Purple play-badge — bottom-right, mirrors Windows Explorer overlay */}
    <div
      style={{
        position: "absolute",
        bottom: "-5px",
        right: "-5px",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6b21a8 0%, #a855f7 100%)",
        border: "2px solid white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 5px rgba(0,0,0,0.4)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "3.5px solid transparent",
          borderBottom: "3.5px solid transparent",
          borderLeft: "6px solid white",
          marginLeft: "1px",
        }}
      />
    </div>
  </div>
);

// ─── FileCard ─────────────────────────────────────────────────────────────────
const FileCard = ({
  file,
  isSelected,
  onClick,
  onContextMenu,
  renaming,
  handleRename,
  setRenaming,
}) => {
  const ext = file?.file_extension?.toLowerCase();
  const isVideo = getTypeConfig(ext).group === "video";
  console.log(renaming);
  const [editName, setEditName] = useState(file?.file_name || "");
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
      setEditName(file?.file_name || "");

      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [renaming, file?.file_name]);

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`group relative flex flex-col items-center py-3 px-2 rounded-lg select-none transition-all border cursor-default w-[110px]
          ${
            isSelected
              ? "bg-[#d2556407] border-primary/30"
              : "border-transparent hover:bg-[#d2556410] hover:border-[#d2556413]"
          }`}
    >
      <Tooltip
        text={file?.file_name}
        fileSize={file?.file_size}
        fileType={ext}
        lastModified={file?.created_at}
        visibility={file?.file_visibility}
      >
        {/* Thumbnail / frame area */}
        <div
          className="flex items-center justify-center"
          style={{ height: "72px" }}
        >
          {isVideo ? (
            <VideoFrame
              thumbPath={file?.thumb_path}
              fileName={file?.file_name}
            />
          ) : file?.thumb_path ? (
            <img
              src={`${VIEW_UPLOADED_FILE_URL}/thumbnails/${file?.thumb_path}`}
              alt={file?.file_name?.substr(0, 5) + "..."}
            />
          ) : (
            <div className="flex items-center justify-center">
              <img src={getFileIcon(ext)} alt="" className="h-16" />
            </div>
          )}
        </div>

        {/* File Name */}
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
              {file?.file_name}
            </div>
          )}
        </div>
      </Tooltip>
    </div>
  );
};

export default FileCard;
