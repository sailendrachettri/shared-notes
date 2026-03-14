import { useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { formatePrettyDateTime } from "../date-time/formatePrettyDateTime";
import { formatFileSize } from "../string-formate/FormateFileSize";

export default function Tooltip({
  children,
  text,
  fileType,
  fileSize,
  visibility,
  lastModified,
}) {
  const [open, setOpen] = useState(false);
  let timer;

  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    // placement: "right-bottom",
    middleware: [offset({ mainAxis: 10 }), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  return (
    <>
      <div
        ref={refs.setReference}
        onMouseEnter={() => {
          timer = setTimeout(() => setOpen(true), 700);
        }}
        onMouseLeave={() => {
          clearTimeout(timer);
          setOpen(false);
        }}
        className="inline-block"
      >
        {children}
      </div>

      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={`z-50 bg-[#f6f6f6] text-slate-600 text-xs px-3 py-2 rounded-md shadow-md max-w-[420px] ${text?.length > 100 ? "min-w-[340px]" : ""} whitespace-normal break-words`}
        >
          <div className="mt-1 text-slate-800">{text}</div>
          {fileType && (
            <div className="mt-1">
              Item Type: <span className="text-slate-800">{fileType}</span>
            </div>
          )}
          {fileSize && (
            <div className="mt-1">
              Item Size:{" "}
              <span className="text-slate-800">
                {formatFileSize(fileSize || 0)}
              </span>
            </div>
          )}
          {visibility && (
            <div className="capitalize mt-1">
              Visibility: <span className="text-slate-800">{visibility}</span>
            </div>
          )}
          {lastModified && (
            <div className="mt-1">
              Last Modified:{" "}
              <span className="text-slate-800">
                {formatePrettyDateTime(lastModified)}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
