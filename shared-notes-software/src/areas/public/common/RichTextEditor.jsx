import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "link",
  "image",
];

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write something...",
  height = "600px",
}) => {
  return (
    <>
      <section>
        <div className="max-h-[80vh] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            style={{ height }}
            className="overflow-y-auto hide-scrollbar"
          />
        </div>
      </section>
    </>
  );
};

export default RichTextEditor;
