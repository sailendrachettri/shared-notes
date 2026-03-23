import React from "react";

const FilePreviewTab = ({ tab }) => {
  const file = tab.file;

  const ext = file.file_extension?.toLowerCase();

  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);
  const isVideo = ["mp4", "webm", "ogg"].includes(ext);

  return (
    <div
      key={tab.id}
      className="h-full flex items-center justify-center"
    >
      {isImage && (
        <img
          src={file.file_path}
          className="max-h-full max-w-full object-contain"
        />
      )}

      {isVideo && (
        <video controls className="max-h-full max-w-full">
          <source src={file.file_path} />
        </video>
      )}

      {!isImage && !isVideo && (
        <div className="text-gray-400 text-center">
          <p>{file.file_name}</p>
          <p>Preview not supported</p>
        </div>
      )}
    </div>
  );
};

export default FilePreviewTab;
