import React from "react";
import { VIEW_UPLOADED_FILE_URL } from "../../config/env";
import fileErrorImg from '../../assets/pngs/file_error.png';

const FilePreviewTab = ({ tab }) => {
  const file = tab.file;

  const ext = file?.file_extension?.toLowerCase();

  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);
  const isVideo = ["mp4", "webm", "ogg"].includes(ext);

  return (
    <div key={tab.id} className="h-full flex items-center justify-center">
      {isImage && (
        <img
          src={`${VIEW_UPLOADED_FILE_URL}/${file?.file_path}`}
          className="max-h-[70vh] max-w-[70vw] object-contain"
          onError={(e) => {
            e.target.src = fileErrorImg; 
          }}
        />
      )}

      {isVideo && (
        <video controls className="max-h-[50vh] max-w-[50vw]">
          <source src={`${VIEW_UPLOADED_FILE_URL}/${file?.file_path}`} />
        </video>
      )}

      {!isImage && !isVideo && (
        <div className="text-gray-400 text-center">
          <p>{file?.file_name}</p>
          <p>Preview not supported</p>
        </div>
      )}
    </div>
  );
};

export default FilePreviewTab;
