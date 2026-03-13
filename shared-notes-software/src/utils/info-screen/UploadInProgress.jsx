import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

const UploadInProgress = ({ progress = 0, onCancelClick }) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white group relative rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-3">
          {/* Spinner */}
          {/* <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div> */}
          <div
            onClick={onCancelClick}
            title="Cancle Upload"
            className="absolute right-3 top-3 invisible group-hover:visible text-slate-500 hover:text-primary cursor-pointer"
          >
            <IoCloseCircleOutline size={16} />
          </div>
          <div className="mini-loader"></div>

          {/* Message */}
          <p className="text-gray-700 text-sm font-medium">
            Upload in progress...
          </p>
          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-gray-500">{progress}% uploaded</p>

          <p className="text-gray-500 text-xs">
            Please wait while we securely upload your file.
          </p>
        </div>
      </div>
    </>
  );
};

export default UploadInProgress;
