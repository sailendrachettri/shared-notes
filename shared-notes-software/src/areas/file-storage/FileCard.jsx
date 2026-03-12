import {
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFilePdf,
} from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineDownloadDone } from "react-icons/md";
import { VIEW_UPLOADED_FILE_URL } from "../../config/env";

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
};

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

const FileCard = ({ file, isSelected, onClick }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const ext = file.file_extension?.toLowerCase();
  const { thumbBg, badgeBg, badgeText } = getTypeConfig(ext);

  const downloadFile = async (file) => {
    setDownloading(true);
    try {
      const response = await fetch(
        `${VIEW_UPLOADED_FILE_URL}/${file?.file_path}`,
      );
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      setDownloaded(true);
      toast.success("File download successful");
    } catch (error) {
      toast.error("Not able to download file");
      console.error("Download error:", error);
    } finally {
      setDownloading(false);
      setTimeout(() => setDownloaded(false), 1000);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`flex flex-col rounded-xl overflow-hidden cursor-pointer border transition-all select-none
        ${
          isSelected
            ? "border-primary border-[1.5px] bg-[#d2556405]"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
        }`}
    >
      {/* Thumbnail */}
      <div className={`h-24 flex items-center justify-center ${thumbBg}`}>
        {getFileIcon(ext, 30)}
      </div>

      {/* Footer */}
      <div className="px-2.5 pt-2 pb-2 flex flex-col gap-1.5 border-t border-gray-100 bg-white">
        <p
          className="text-[12.5px] font-medium text-gray-800 truncate leading-tight"
          title={file.file_name}
        >
          {file.file_name}
        </p>

        <div className="flex items-center gap-1.5">
          {/* Extension badge */}
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md shrink-0 ${badgeBg} ${badgeText}`}
          >
            {ext}
          </span>

          {/* File size */}
          <span className="text-[11px] text-gray-400 flex-1 text-right">
            {formatFileSize(file.file_size)}
          </span>

          {/* Download */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadFile(file);
            }}
            className="flex items-center justify-center w-6 h-6 rounded-md border border-gray-200 bg-gray-50 text-gray-400
              hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all shrink-0"
          >
            {downloading ? (
              <span>...</span>
            ) : (
              <span>
                {downloaded ? (
                  <MdOutlineDownloadDone size={14} />
                ) : (
                  <MdDownload size={14} />
                )}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
