import React, { useEffect, useState } from "react";
import { VIEW_UPLOADED_FILE_URL } from "../../config/env";
import fileErrorImg from "../../assets/pngs/file_error.png";
import * as mammoth from "mammoth";

const FilePreviewTab = ({ tab }) => {
  const file = tab.file;
  const ext = file?.file_extension?.toLowerCase();

  const fileUrl = `${VIEW_UPLOADED_FILE_URL}/${file?.file_path}`;

  const [textContent, setTextContent] = useState("");
  const [docxHtml, setDocxHtml] = useState("");
  const [loadingText, setLoadingText] = useState(false);

  // ---- File Type Groups ----
  const imageExts = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
  const videoExts = ["mp4", "webm", "ogg"];
  const audioExts = ["mp3", "wav", "ogg"];
  const textExts = [
    "txt", "js", "jsx", "ts", "tsx", "html", "css", "json", "md", "xml",
    "csv", "yaml", "yml", "toml", "ini", "env", "sh", "bash", "py", "rb",
    "java", "c", "cpp", "h", "hpp", "cs", "go", "rs", "php", "swift",
    "kt", "sql", "log", "conf", "config", "gitignore", "dockerfile",
  ];
  const docxExts = ["docx", "doc"];
  const pdfExts = ["pdf"];

  const isPdf = pdfExts.includes(ext);
  const isImage = imageExts.includes(ext);
  const isVideo = videoExts.includes(ext);
  const isAudio = audioExts.includes(ext);
  const isText = textExts.includes(ext);
  const isDocx = docxExts.includes(ext);

  // ---- Fetch plain text content ----
  useEffect(() => {
    if (isText) {
      setLoadingText(true);
      fetch(fileUrl)
        .then((res) => res.text())
        .then((data) => setTextContent(data))
        .catch(() => setTextContent("Failed to load file"))
        .finally(() => setLoadingText(false));
    }
  }, [fileUrl, isText]);

  // ---- Fetch and parse docx content ----
  useEffect(() => {
    if (isDocx) {
      setLoadingText(true);
      fetch(fileUrl)
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) =>
          mammoth.convertToHtml({ arrayBuffer })
        )
        .then((result) => setDocxHtml(result.value))
        .catch(() => setDocxHtml("<p>Failed to load document</p>"))
        .finally(() => setLoadingText(false));
    }
  }, [fileUrl, isDocx]);

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      {/* IMAGE */}
      {isImage && (
        <img
          src={fileUrl}
          alt={file?.file_name}
          className="max-h-[80vh] max-w-[80vw] object-contain"
          onError={(e) => (e.target.src = fileErrorImg)}
        />
      )}

      {/* VIDEO */}
      {isVideo && (
        <video controls className="max-h-[70vh] max-w-[80vw]">
          <source src={fileUrl} />
          Your browser does not support video.
        </video>
      )}

      {/* AUDIO */}
      {isAudio && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-400">{file?.file_name}</p>
          <audio controls className="w-[400px]">
            <source src={fileUrl} />
            Your browser does not support audio.
          </audio>
        </div>
      )}

      {/* PDF */}
      {isPdf && (
        <iframe
          src={fileUrl}
          title="PDF Viewer"
          className="w-[90vw] h-[85vh]"
        />
      )}

      {/* TEXT / CODE */}
      {isText && (
        <div className="w-full h-full max-w-[90vw] max-h-[80vh] overflow-auto p-4">
          {loadingText ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <pre
              className="whitespace-pre-wrap text-sm"
              style={{ userSelect: "text", cursor: "text" }}
            >
              {textContent}
            </pre>
          )}
        </div>
      )}

      {/* DOCX / DOC */}
      {isDocx && (
        <div className="w-full h-full max-w-[90vw] max-h-[80vh] overflow-auto p-4">
          {loadingText ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div
              className="text-sm prose max-w-none"
              style={{ userSelect: "text", cursor: "text" }}
              dangerouslySetInnerHTML={{ __html: docxHtml }}
            />
          )}
        </div>
      )}

      {/* FALLBACK */}
      {!isImage && !isVideo && !isAudio && !isText && !isPdf && !isDocx && (
        <div className="text-gray-400 text-center">
          <p className="font-medium">{file?.file_name}</p>
          <p className="text-sm mt-1">Preview not supported</p>
        </div>
      )}
    </div>
  );
};

export default FilePreviewTab;