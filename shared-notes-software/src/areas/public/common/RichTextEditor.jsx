import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { SlashCommand } from "../../../utils/slash-suggest/SlashCommand";
import { formatePrettyDateTime } from "../../../utils/date-time/formatePrettyDateTime";
import coverDefaultImage from "../../../assets/pngs/logo.png";
import { useRef } from "react";
import { axiosInstance } from "../../../api/axios";
import {
  CHANGE_COVER_ICON_MST_NOTE_URL,
  CHANGE_COVER_ICON_SUB_PAGE_URL,
  CHANGE_COVER_IMAGE_MST_NOTE_URL,
  CHANGE_COVER_IMAGE_SUB_PAGE_URL,
  FILE_UPLOAD_URL,
  REMOVE_COVER_IMAGE_MST_NOTE_URL,
  REMOVE_COVER_IMAGE_SUB_PAGE_URL,
  VIEW_UPLOADED_FILE_URL,
} from "../../../api/api_routes";
import { useMemo } from "react";
import defaultIcon from "../../../assets/pngs/logo.png";
import toast from "react-hot-toast";

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

const TableMenu = ({ editor }) => {
  const [isTableActive, setIsTableActive] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const checkTableActive = () => {
      setIsTableActive(editor.isActive("table"));
    };

    editor.on("selectionUpdate", checkTableActive);
    editor.on("transaction", checkTableActive);

    return () => {
      editor.off("selectionUpdate", checkTableActive);
      editor.off("transaction", checkTableActive);
    };
  }, [editor]);

  if (!editor || !isTableActive) return null;

  return (
    <div className="table-menu-wrapper">
      <div className="table-menu">
        <button
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className="table-menu-button"
          title="Add column before"
        >
          ← Col
        </button>
        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className="table-menu-button"
          title="Add column after"
        >
          Col →
        </button>
        <button
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className="table-menu-button table-menu-delete"
          title="Delete column"
        >
          ✕ Col
        </button>
        <div className="table-menu-divider"></div>
        <button
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className="table-menu-button"
          title="Add row before"
        >
          ↑ Row
        </button>
        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className="table-menu-button"
          title="Add row after"
        >
          Row ↓
        </button>
        <button
          onClick={() => editor.chain().focus().deleteRow().run()}
          className="table-menu-button table-menu-delete"
          title="Delete row"
        >
          ✕ Row
        </button>
        <div className="table-menu-divider"></div>
        <button
          onClick={() => editor.chain().focus().deleteTable().run()}
          className="table-menu-button table-menu-delete"
          title="Delete table"
        >
          🗑 Table
        </button>
      </div>
    </div>
  );
};

const RichTextEditor = ({
  value,
  onChange,
  heading,
  lastUpdatedAt,
  onTitleChange,
  selectedNoteType,
  selectedNoteId,
  fullData,
}) => {
  const fileInputRef = useRef(null);
  const iconInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "editor-link",
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "task-list",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "task-item",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "editor-table",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Heading";
          }
          return "Type '/' for commands...";
        },
      }),
      SlashCommand,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      if (html !== value) {
        onChange(html);
      }
    },

    editorProps: {
      attributes: {
        class: "notion-editor-content",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    // Only update if the content is different
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
      editor.commands.focus("end");
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e) => {
      if (editor.isFocused) return;

      const activeTag = document.activeElement?.tagName;

      // Ignore if typing inside input/textarea/button
      if (["INPUT", "TEXTAREA", "BUTTON"].includes(activeTag)) return;

      if (e.key == "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        editor.chain().focus().insertContent(e.key).run();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  const handleChangeCoverClick = () => fileInputRef.current.click();

  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log(file);

    try {
      console.log("here");
      const formData = new FormData();
      formData.append("files", file);
      let res = await axiosInstance.post(FILE_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("res ", res);
      const uploadedUrl = res.data[0];

      const payload =
        selectedNoteType === "mst-note"
          ? { NoteId: selectedNoteId, CoverImage: uploadedUrl }
          : { SubPageId: selectedNoteId, CoverImage: uploadedUrl };

      res = await axiosInstance.post(
        selectedNoteType === "mst-note"
          ? CHANGE_COVER_IMAGE_MST_NOTE_URL
          : CHANGE_COVER_IMAGE_SUB_PAGE_URL,
        payload,
      );
      console.log(res);
    } catch (err) {
      console.error("Cover upload failed:", err);
    }
  };

  const handleRemoveCover = async () => {
    try {
      let res;

      const payload =
        selectedNoteType === "mst-note"
          ? { NoteId: selectedNoteId }
          : { SubPageId: selectedNoteId };

      res = await axiosInstance.post(
        selectedNoteType === "mst-note"
          ? REMOVE_COVER_IMAGE_MST_NOTE_URL
          : REMOVE_COVER_IMAGE_SUB_PAGE_URL,
        payload,
      );
      console.log(res);
      if (res?.data?.success == true && res?.data?.status == "UPDATED") {
        toast.success("Cover image removed");
      }
    } catch (error) {
      console.error("not able remove cover image");
      toast.error("Not able to remove cover image");
    }
  };

  // Change Icon
  const handleChangeIcon = () => iconInputRef.current.click();
  const handleIconSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log(file);

    try {
      console.log("here");
      const formData = new FormData();
      formData.append("files", file);
      let res = await axiosInstance.post(FILE_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("res ", res);
      const uploadedUrl = res.data[0];

      const payload =
        selectedNoteType === "mst-note"
          ? { NoteId: selectedNoteId, CoverIcon: uploadedUrl }
          : { SubPageId: selectedNoteId, CoverIcon: uploadedUrl };

      res = await axiosInstance.post(
        selectedNoteType === "mst-note"
          ? CHANGE_COVER_ICON_MST_NOTE_URL
          : CHANGE_COVER_ICON_SUB_PAGE_URL,
        payload,
      );
      console.log(res);
    } catch (err) {
      console.error("Cover upload failed:", err);
    }
  };

  const normalizedNote = useMemo(() => {
    if (!fullData) return null;

    const isSubPage = selectedNoteType === "sub-page";

    // Determine if cover should be shown
    const shouldShowCover = isSubPage
      ? !fullData?.sub_page_remove_cover && fullData?.sub_page_cover_image
      : !fullData?.mst_note_remove_cover && fullData?.mst_note_cover_image;

    // Determine if icon should be shown
    const shouldShowIcon = isSubPage
      ? !fullData?.sub_page_remove_icon && fullData?.sub_page_cover_icon
      : !fullData?.mst_note_remove_icon && fullData?.mst_note_cover_icon;

    return {
      title: fullData?.note_title,
      updatedAt: fullData?.updated_at,

      coverImage: shouldShowCover
        ? isSubPage
          ? fullData?.sub_page_cover_image
          : fullData?.mst_note_cover_image
        : null,

      icon: shouldShowIcon
        ? isSubPage
          ? fullData?.sub_page_cover_icon
          : fullData?.mst_note_cover_icon
        : null,

      shouldShowCover, // Add these to the return object
      shouldShowIcon,
    };
  }, [fullData, selectedNoteType]);

  const coverImage = normalizedNote?.coverImage
    ? `${VIEW_UPLOADED_FILE_URL}${normalizedNote?.coverImage}`
    : null;
  const coverIcon = normalizedNote?.icon
    ? `${VIEW_UPLOADED_FILE_URL}${normalizedNote?.icon}`
    : null;

  // Use these variables in your JSX
  const shouldShowCover = normalizedNote?.shouldShowCover;
  const shouldShowIcon = normalizedNote?.shouldShowIcon;

  console.log(fullData);
  console.log(coverImage);

  return (
    <div className="notion-editor-wrapper">
      {/* Cover Image Section - ALWAYS render this container */}
     { shouldShowCover && <div className="relative group">
        <div className="relative w-full h-20 lg:h-[30vh] overflow-hidden bg-slate-100">
          
            <>
              <img
                src={coverImage || coverDefaultImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={handleChangeCoverClick}
                    className="px-3 py-1.5 bg-white/90 hover:bg-white text-sm rounded shadow-lg"
                  >
                    Change cover
                  </button>
                  <button
                    onClick={handleRemoveCover}
                    className="px-3 py-1.5 bg-white/90 hover:bg-white text-sm rounded shadow-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </>
          

          {/* Show "Add Cover" button when no cover exists */}
          {!shouldShowCover && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleChangeCoverClick}
                className="px-4 py-2 bg-white/90 hover:bg-white text-sm rounded shadow-lg"
              >
                Add cover
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelected}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>}

      {/* Content Section with Icon */}
      <div className="max-w-[900px] mx-auto px-8 lg:px-24">
        {/* Icon - ALWAYS overlaps the cover area */}

        {shouldShowIcon && <div className={`relative ${shouldShowCover ? '-mt-12' : 'pt-10'}  mb-4 group/icon inline-block `}>
          <img
            src={coverIcon || defaultIcon}
            alt="Icon"
            className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform bg-white"
          />

          {/* Hover Edit Button */}
          <div className={`absolute ${shouldShowCover ? '-top-2' : 'top-8'}   -right-2 opacity-0 group-hover/icon:opacity-100 transition-opacity`}>
            <button
              onClick={handleChangeIcon}
              className="p-1.5 bg-white rounded-full shadow-lg text-xs hover:bg-slate-100"
            >
              ✏️
            </button>
          </div>

          <input
            type="file"
            ref={iconInputRef}
            onChange={handleIconSelected}
            className="hidden"
            accept="image/*"
          />
        </div>}

        {/* Title */}
        <div className="pb-4">
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              let text = e.currentTarget.textContent || "";

              if (text.length > 45) {
                text = text.slice(0, 45);
                e.currentTarget.textContent = text;

                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(e.currentTarget);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
              }

              onTitleChange(text);
            }}
            className="text-4xl font-bold outline-none text-slate-800 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300"
            data-placeholder="Untitled"
          >
            {heading && <span className="capitalize">{heading}</span>}
          </div>

          {lastUpdatedAt && (
            <p className="text-sm text-slate-400 mt-2">
              Edited {formatePrettyDateTime(lastUpdatedAt)}
            </p>
          )}
        </div>

        {/* Editor Content */}
        <div className="notion-editor-container pb-32">
          {editor && <FormattingMenu editor={editor} />}
          {editor && <TableMenu editor={editor} />}
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
