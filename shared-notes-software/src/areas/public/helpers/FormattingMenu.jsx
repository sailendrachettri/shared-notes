import { BubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";

const FormattingMenu = ({ editor }) => {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  if (!editor) return null;

  const textColors = [
    "#000000",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
  ];

  const bgColors = [
    "#fef08a",
    "#bbf7d0",
    "#bfdbfe",
    "#e9d5ff",
    "#fbcfe8",
    "#fecaca",
  ];

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ editor }) => {
        const { from, to } = editor.state.selection;
        return from !== to;
      }}
    >
      <div className="flex items-center gap-1 bg-white shadow-lg rounded-lg p-2 border">

        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        >
          <b>B</b>
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        >
          <i>I</i>
        </button>

        {/* Underline */}
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
        >
          <u>U</u>
        </button>

        {/* Strike */}
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 ${editor.isActive("strike") ? "bg-gray-200" : ""}`}
        >
          <s>S</s>
        </button>

        {/* Inline Code */}
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-2 ${editor.isActive("code") ? "bg-gray-200" : ""}`}
        >
          {"</>"}
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Text Color */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTextColor(!showTextColor);
              setShowHighlight(false);
            }}
            className="px-2"
          >
            🎨
          </button>

          {showTextColor && (
            <div className="absolute top-8 left-0 bg-white shadow-md p-2 rounded flex gap-1 flex-wrap w-40">
              {textColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowTextColor(false);
                  }}
                  className="w-5 h-5 rounded-full border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight */}
        <div className="relative">
          <button
            onClick={() => {
              setShowHighlight(!showHighlight);
              setShowTextColor(false);
            }}
            className="px-2"
          >
            🖍
          </button>

          {showHighlight && (
            <div className="absolute top-8 left-0 bg-white shadow-md p-2 rounded flex gap-1 flex-wrap w-40">
              {bgColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setHighlight({ color }).run();
                    setShowHighlight(false);
                  }}
                  className="w-5 h-5 rounded border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-2 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
        >
          ⬅
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-2 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
        >
          ↔
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-2 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
        >
          ➡
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Clear Formatting */}
        <button
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          className="px-2"
        >
          🧹
        </button>
      </div>
    </BubbleMenu>
  );
};

export default FormattingMenu;