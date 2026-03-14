import React from "react";

const FileStorageHeading = ({ heading }) => {
  return (
    <div>
      <p className="text-[11px] uppercase text-slate-400 mb-2">
        {heading || "Documents"}
      </p>
    </div>
  );
};

export default FileStorageHeading;
