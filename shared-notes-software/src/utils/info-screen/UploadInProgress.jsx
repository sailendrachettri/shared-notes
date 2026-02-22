import React from "react";

const UploadInProgress = () => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-3">
          {/* Spinner */}
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>

          {/* Message */}
          <p className="text-gray-700 text-sm font-medium">
            Upload in progress...
          </p>
          <p className="text-gray-500 text-xs">
            Please wait while we securely upload your file.
          </p>
        </div>
      </div>
    </>
  );
};

export default UploadInProgress;
