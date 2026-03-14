// DownloadToast.jsx — Discord-style download progress UI
import {
  IoDocumentOutline,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoArrowDownOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const DownloadToast = ({ downloadState, onDismiss }) => {
  if (!downloadState?.active) return null;

  const { fileName, downloadedSize, totalSize, percentage, status } =
    downloadState;

  const isDone = status === "done";
  const isError = status === "error";

  return (
    <div
      className={`
        fixed bottom-5 right-5 z-50 w-[340px]
        bg-[#1e1f22] border border-[#2b2d31]
        rounded-xl shadow-2xl shadow-black/60
        transition-all duration-300 ease-out
        ${downloadState.active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
      `}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[#2b2d31]">
        <div className="flex items-center gap-2">
          <IoArrowDownOutline className="text-[#5865f2] text-sm" />
          <span className="text-[#b5bac1] text-xs font-semibold tracking-widest uppercase">
            {isDone ? "Downloaded" : isError ? "Failed" : "Downloading"}
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="text-[#4e5058] hover:text-[#b5bac1] transition-colors rounded-full hover:bg-[#2b2d31] p-0.5"
        >
          <IoCloseOutline size={15} />
        </button>
      </div>

      {/* File row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* File icon */}
        <div
          className={`
            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
            ${isDone ? "bg-[#248046]/20" : isError ? "bg-[#da373c]/20" : "bg-[#5865f2]/20"}
          `}
        >
          {isDone ? (
            <IoCheckmarkCircleOutline className="text-[#23a559] text-xl" />
          ) : isError ? (
            <IoAlertCircleOutline className="text-[#da373c] text-xl" />
          ) : (
            <IoDocumentOutline className="text-[#5865f2] text-xl" />
          )}
        </div>

        {/* File name + size */}
        <div className="flex-1 min-w-0">
          <p className="text-[#e0e1e5] text-sm font-medium truncate leading-tight">
            {fileName}
          </p>
          <p className="text-[#6d6f78] text-xs mt-0.5">
            {isDone ? (
              <span className="text-[#23a559]">
                {formatBytes(totalSize)} — Saved to Downloads
              </span>
            ) : isError ? (
              <span className="text-[#da373c]">Something went wrong</span>
            ) : (
              <>
                <span className="text-[#949ba4]">
                  {formatBytes(downloadedSize)}
                </span>
                {totalSize > 0 && (
                  <span className="text-[#6d6f78]">
                    {" "}/ {formatBytes(totalSize)}
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Percentage badge */}
        {!isDone && !isError && (
          <span className="text-[#5865f2] text-xs font-bold tabular-nums">
            {percentage}%
          </span>
        )}

        {/* Open folder icon when done */}
        {isDone && (
          <button className="text-[#4e5058] hover:text-[#b5bac1] transition-colors">
            <IoFolderOpenOutline size={17} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {!isError && (
        <div className="px-4 pb-3">
          <div className="w-full h-1.5 bg-[#2b2d31] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out
                ${isDone ? "bg-[#23a559]" : "bg-[#5865f2]"}
                ${!isDone && percentage < 100 ? "relative" : ""}
              `}
              style={{ width: `${isDone ? 100 : percentage}%` }}
            >
              {/* Shimmer animation while downloading */}
              {!isDone && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};