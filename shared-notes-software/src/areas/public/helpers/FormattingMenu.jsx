import { useEffect } from "react";
import { useState } from "react";

const FormattingMenu = ({ editor }) => {
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    if (!editor) return;

    const checkSelection = () => {
      const { from, to } = editor.state.selection;
      setIsTextSelected(from !== to);

      if (from === to) {
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowLinkInput(false);
      }
    };

    editor.on("selectionUpdate", checkSelection);
    editor.on("transaction", checkSelection);

    return () => {
      editor.off("selectionUpdate", checkSelection);
      editor.off("transaction", checkSelection);
    };
  }, [editor]);

  if (!editor || !isTextSelected) return null;

  const colors = [
    { name: "Default", value: "#000000" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Yellow", value: "#eab308" },
    { name: "Green", value: "#22c55e" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
  ];

  const highlights = [
    { name: "None", value: "" },
    { name: "Yellow", value: "#fef08a" },
    { name: "Green", value: "#bbf7d0" },
    { name: "Blue", value: "#bfdbfe" },
    { name: "Purple", value: "#e9d5ff" },
    { name: "Pink", value: "#fbcfe8" },
    { name: "Red", value: "#fecaca" },
  ];

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  return (
    <div className="formatting-menu-wrapper">
      <div className="formatting-menu">
        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`formatting-button ${editor.isActive("bold") ? "is-active" : ""}`}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`formatting-button ${editor.isActive("italic") ? "is-active" : ""}`}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>

        {/* Underline */}
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`formatting-button ${editor.isActive("underline") ? "is-active" : ""}`}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>

        {/* Strikethrough */}
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`formatting-button ${editor.isActive("strike") ? "is-active" : ""}`}
          title="Strikethrough"
        >
          <s>S</s>
        </button>

        {/* Code */}
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`formatting-button ${editor.isActive("code") ? "is-active" : ""}`}
          title="Code (Ctrl+E)"
        >
          {"</>"}
        </button>

        <div className="formatting-divider"></div>

        {/* Text Color */}
        <div className="formatting-dropdown">
          <button
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHighlightPicker(false);
              setShowLinkInput(false);
            }}
            className="formatting-button"
            title="Text color"
          >
            A
          </button>
          {showColorPicker && (
            <div className="color-picker">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    if (color.value === "#000000") {
                      editor.chain().focus().unsetColor().run();
                    } else {
                      editor.chain().focus().setColor(color.value).run();
                    }
                    setShowColorPicker(false);
                  }}
                  className="color-option"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {color.value === "#000000" && "×"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Highlight */}
        <div className="formatting-dropdown">
          <button
            onClick={() => {
              setShowHighlightPicker(!showHighlightPicker);
              setShowColorPicker(false);
              setShowLinkInput(false);
            }}
            className="formatting-button"
            title="Highlight"
          >
            🖍
          </button>
          {showHighlightPicker && (
            <div className="color-picker">
              {highlights.map((highlight) => (
                <button
                  key={highlight.name}
                  onClick={() => {
                    if (!highlight.value) {
                      editor.chain().focus().unsetHighlight().run();
                    } else {
                      editor
                        .chain()
                        .focus()
                        .setHighlight({ color: highlight.value })
                        .run();
                    }
                    setShowHighlightPicker(false);
                  }}
                  className="color-option"
                  style={{ backgroundColor: highlight.value || "#fff" }}
                  title={highlight.name}
                >
                  {!highlight.value && "×"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="formatting-divider"></div>

        {/* Link */}
        <div className="formatting-dropdown">
          <button
            onClick={() => {
              setShowLinkInput(!showLinkInput);
              setShowColorPicker(false);
              setShowHighlightPicker(false);
              if (editor.isActive("link")) {
                const href = editor.getAttributes("link").href;
                setLinkUrl(href);
              }
            }}
            className={`formatting-button ${editor.isActive("link") ? "is-active" : ""}`}
            title="Add link"
          >
            🔗
          </button>
          {showLinkInput && (
            <div className="link-input-wrapper">
              <input
                type="url"
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setLink();
                  }
                }}
                className="link-input"
                autoFocus
              />
              <button onClick={setLink} className="link-button">
                ✓
              </button>
              {editor.isActive("link") && (
                <button
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    setLinkUrl("");
                    setShowLinkInput(false);
                  }}
                  className="link-button link-remove"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        <div className="formatting-divider"></div>

        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`formatting-button ${editor.isActive({ textAlign: "left" }) ? "is-active" : ""}`}
          title="Align left"
        >
          ⬅
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`formatting-button ${editor.isActive({ textAlign: "center" }) ? "is-active" : ""}`}
          title="Align center"
        >
          ↔
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`formatting-button ${editor.isActive({ textAlign: "right" }) ? "is-active" : ""}`}
          title="Align right"
        >
          ➡
        </button>
      </div>
    </div>
  );
};

export default FormattingMenu;
