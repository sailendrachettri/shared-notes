import {
  IoDocumentOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
  IoAlertCircleOutline,
  IoFolderOutline,
  IoRefreshOutline,
} from "react-icons/io5";

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const DownloadToast = ({ downloadState, onDismiss, onRetry }) => {
  if (!downloadState?.active) return null;

  const { fileName, downloadedSize, totalSize, percentage, status } = downloadState;
  const isDone = status === "done";
  const isError = status === "error";
  const isDownloading = status === "downloading";

  return (
    <div
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
      className={`
        fixed bottom-5 right-5 z-50 w-[340px]
        bg-white border border-gray-200
        rounded-[14px] overflow-hidden
        transition-all duration-300 ease-out
        ${downloadState.active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 pt-2.5 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* Status dot */}
          <span
            className={`
              w-[7px] h-[7px] rounded-full flex-shrink-0
              ${isDone ? "bg-[#1a7f4b]" : isError ? "bg-[#c0392b]" : "bg-[#d25564] animate-pulse"}
            `}
          />
          <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
            {isDone ? "Downloaded" : isError ? "Failed" : "Downloading"}
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-colors"
        >
          <IoCloseOutline size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="flex items-center gap-3 px-3.5 py-3">
        {/* Icon */}
        <div
          className={`
            flex-shrink-0 w-[38px] h-[38px] rounded-[10px]
            flex items-center justify-center
            ${isDone ? "bg-[#edf7f2]" : isError ? "bg-[#fdf0ef]" : "bg-[#fdf0f1]"}
          `}
        >
          {isDone ? (
            <IoCheckmarkOutline size={18} className="text-[#1a7f4b]" />
          ) : isError ? (
            <IoAlertCircleOutline size={18} className="text-[#c0392b]" />
          ) : (
            <IoDocumentOutline size={18} className="text-[#d25564]" />
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-gray-800 truncate leading-tight">
            {fileName}
          </p>
          <p className="text-[11.5px] mt-0.5">
            {isDone ? (
              <span className="text-[#1a7f4b]">
                {formatBytes(totalSize)} — saved to downloads
              </span>
            ) : isError ? (
              <span className="text-[#c0392b]">Download failed — try again</span>
            ) : (
              <>
                <span className="text-gray-500">{formatBytes(downloadedSize)}</span>
                {totalSize > 0 && (
                  <span className="text-gray-300"> / {formatBytes(totalSize)}</span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Right action */}
        {isDownloading && (
          <span className="text-[12px] font-semibold text-[#d25564] tabular-nums min-w-[34px] text-right">
            {percentage}%
          </span>
        )}
        {isDone && (
          <button className="w-[28px] h-[28px] rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#fdf0f1] hover:text-[#d25564] hover:border-[#f5c0c5] transition-all">
            <IoFolderOutline size={14} />
          </button>
        )}
        {isError && (
          <button
            onClick={onRetry}
            className="w-[28px] h-[28px] rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#fdf0f1] hover:text-[#d25564] hover:border-[#f5c0c5] transition-all"
          >
            <IoRefreshOutline size={14} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {!isError && (
        <div className="px-3.5 pb-3">
          <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden
                ${isDone ? "bg-[#1a7f4b]" : "bg-[#d25564]"}
              `}
              style={{ width: `${isDone ? 100 : percentage}%` }}
            >
              {isDownloading && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.4s_infinite]" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};