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
    middleware: [
      offset(8), // distance from element
      flip(), // flip if no space
      shift({ padding: 8 }), // stay inside viewport
    ],
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
          className={`z-50 bg-[#f6f6f6] text-slate-700 text-xs px-3 py-2 rounded-md max-w-[420px] ${text?.length > 100 ? "min-w-[340px]" : ""} whitespace-normal break-words`}
        >
          <div>{text}</div>
          {fileType && <div>Item Type: {fileType}</div>}
          {fileSize && <div>Item Size: {formatFileSize(fileSize || 0)}</div>}
          {visibility && (
            <div className="capitalize">Visibility: {visibility}</div>
          )}
          {lastModified && <div>Last Modified: {formatePrettyDateTime(lastModified)}</div>}
        </div>
      )}
    </>
  );
}
