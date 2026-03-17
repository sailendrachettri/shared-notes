import {
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFilePdf,
} from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";
import Tooltip from "../../utils/tooltips/ToolTip";
import { VIEW_UPLOADED_FILE_URL } from "../../config/env";

const FILE_TYPE_MAP = {
  // Images
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
  // Video
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
  // Audio
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
  // PDF
  pdf: {
    group: "pdf",
    thumbBg: "bg-red-50",
    badgeBg: "bg-red-100",
    badgeText: "text-red-800",
  },
  // Docs
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
  // Spreadsheets
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
  // Archives
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

// ─── Helpers ────────────────────────────────────────────────────────────────

const getTypeConfig = (ext) =>
  FILE_TYPE_MAP[ext?.toLowerCase()] ?? DEFAULT_TYPE;

const getFileIcon = (ext, size = 28) => {
  const group = getTypeConfig(ext).group;
  const cls =
    {
      image: "text-pink-500",
      video: "text-purple-500",
      audio: "text-green-500",
      pdf: "text-red-500",
      document: "text-blue-500",
      archive: "text-amber-500",
      other: "text-gray-400",
    }[group] ?? "text-gray-400";

  const Icon =
    {
      image: FaFileImage,
      video: FaFileVideo,
      audio: FaFileAudio,
      pdf: FaFilePdf,
      document: HiDocumentText,
      archive: HiDocumentText,
      other: HiDocumentText,
    }[group] ?? HiDocumentText;

  return <Icon size={size} className={cls} />;
};

const FileCard = ({ file, isSelected, onClick, onContextMenu }) => {
  const ext = file?.file_extension?.toLowerCase();

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
        {/* Thumbnail */}
        {file?.thumb_path ? (
          <div>
            <img
              src={`${VIEW_UPLOADED_FILE_URL}/thumbnails/${file?.thumb_path}`}
              alt={file?.file_name?.substr(0, 5)}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-[60px]">
            {getFileIcon(ext, 60)}
          </div>
        )}

        {/* File Name */}
        <div className="tooltip text-[12px] text-center text-gray-800 break-words leading-[1.3] line-clamp-5 max-w-[90px] mt-2">
          {file?.file_name}
        </div>
      </Tooltip>
    </div>
  );
};

export default FileCard;
