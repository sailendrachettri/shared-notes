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
import { IoImageOutline } from "react-icons/io5";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import lowlight from "../../../utils/editor/codeHighlight";
import { BubbleMenu } from "@tiptap/react/menus";
import { axiosInstance } from "../../../api/axios";
import {
  CHANGE_COVER_ICON_MST_NOTE_URL,
  CHANGE_COVER_ICON_SUB_PAGE_URL,
  CHANGE_COVER_IMAGE_MST_NOTE_URL,
  CHANGE_COVER_IMAGE_SUB_PAGE_URL,
  FILE_UPLOAD_URL,
  REMOVE_COVER_ICON_MST_NOTE_URL,
  REMOVE_COVER_ICON_SUB_PAGE_URL,
  REMOVE_COVER_IMAGE_MST_NOTE_URL,
  REMOVE_COVER_IMAGE_SUB_PAGE_URL,
  VIEW_UPLOADED_FILE_URL,
} from "../../../api/api_routes";
import { useMemo } from "react";
import defaultIcon from "../../../assets/pngs/logo.png";
import toast from "react-hot-toast";
import FormattingMenu from "../helpers/FormattingMenu";
import TableMenu from "../helpers/TableMenu";
import { CustomCodeBlock } from "../../../utils/extensions/CustomCodeBlock";
import UploadInProgress from "../../../utils/info-screen/UploadInProgress";

const RichTextEditor = ({
  value,
  onChange,
  heading,
  lastUpdatedAt,
  onTitleChange,
  selectedNoteType,
  selectedNoteId,
  fullData,
  setRefresh,
}) => {
  const fileInputRef = useRef(null);
  const iconInputRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const titleRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      // CodeBlockLowlight.configure({
      //   lowlight,
      //   defaultLanguage: "javascript",
      //   HTMLAttributes: {
      //     spellcheck: "false",
      //   },
      // }),
      CustomCodeBlock.configure({
        lowlight,
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

  useEffect(() => {
    if (titleRef.current && heading !== titleRef.current.textContent) {
      titleRef.current.textContent = heading || "";
    }
  }, [heading]);

  const handleChangeCoverClick = () => fileInputRef?.current?.click();
  const handleChangeIconClick = () => iconInputRef?.current?.click();

  const handleChangeCover = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("files", file);
      let res = await axiosInstance.post(FILE_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

      // console.log(res);
      // console.log(payload);
    } catch (err) {
      console.error("Cover upload failed:", err);
    } finally {
      setRefresh((prev) => !prev);
      setTimeout(() => {
        setUploading(false);
      }, 1000);
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
      res;
      if (res?.data?.success == true && res?.data?.status == "UPDATED") {
        toast.success("Cover image removed");
      }
    } catch (error) {
      console.error("not able remove cover image");
      toast.error("Not able to remove cover image");
    } finally {
      setRefresh((prev) => !prev);
    }
  };

  const handleRemoveIcon = async () => {
    try {
      let res;
      const payload =
        selectedNoteType === "mst-note"
          ? { NoteId: selectedNoteId }
          : { SubPageId: selectedNoteId };

      res = await axiosInstance.post(
        selectedNoteType === "mst-note"
          ? REMOVE_COVER_ICON_MST_NOTE_URL
          : REMOVE_COVER_ICON_SUB_PAGE_URL,
        payload,
      );
      if (res?.data?.success == true && res?.data?.status == "UPDATED") {
        toast.success("Icon removed successful!");
      } else {
        toast.error("Can't remove icon at the moment");
      }
    } catch (err) {
      toast.error("Can't remove icon at the moment");
      console.error("Cover upload failed:", err);
    } finally {
      setShowMenu(false);
      setRefresh((prev) => !prev);
    }
  };

  const handleChangeIcon = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // console.log(file);

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("files", file);
      let res = await axiosInstance.post(FILE_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
      // console.log(payload);
      // console.log(res);
    } catch (err) {
      console.error("Cover upload failed:", err);
    } finally {
      setRefresh((prev) => !prev);
      setTimeout(() => {
        setUploading(false);
      }, 1000);
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
    ? `${VIEW_UPLOADED_FILE_URL}/${normalizedNote?.coverImage}`
    : null;
  const coverIcon = normalizedNote?.icon
    ? `${VIEW_UPLOADED_FILE_URL}/${normalizedNote?.icon}`
    : null;

  // Use these variables in your JSX
  const shouldShowCover = normalizedNote?.shouldShowCover;
  const shouldShowIcon = normalizedNote?.shouldShowIcon;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notion-editor-wrapper">
      {/* Cover Image Section - ALWAYS render this container */}
      {shouldShowCover && (
        <div className="relative group">
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
          </div>
        </div>
      )}

      {/* Content Section with Icon */}
      <div className="mx-auto px-8 lg:px-16">
        {/* Icon - ALWAYS overlaps the cover area */}

        {shouldShowIcon && (
          <div
            className={`relative ${shouldShowCover ? "-mt-12" : "pt-10"}  group/icon inline-block `}
          >
            <img
              onClick={() => setShowMenu((prev) => !prev)}
              src={coverIcon || defaultIcon}
              alt="Icon"
              className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform bg-white"
            />

            {/* Hover Edit Button */}
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute -right-16 mt-2 w-36 bg-white rounded-lg shadow-xl border-slate-200 border text-sm z-50"
              >
                <button
                  onClick={handleChangeIconClick}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 cursor-pointer"
                >
                  Change icon
                </button>
                <button
                  onClick={handleRemoveIcon}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 cursor-pointer"
                >
                  Remove icon
                </button>
              </div>
            )}
          </div>
        )}

        {/*  Add buttons */}
        <section
          className={`${!shouldShowCover && !shouldShowIcon ? "pt-3 pb-2" : "pt-1"} `}
        >
          <div
            className={`flex items-center group gap-3 xl:py-1 relative z-20`}
          >
            {!shouldShowIcon && (
              <button
                onClick={handleChangeIconClick}
                className="flex items-center gap-2 px-4 py-1.25
           text-[11px] text-gray-500 
           hover:bg-gray-100 hover:text-gray-800 
           rounded-md transition-all 
           opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <FaRegFaceSmileBeam className="text-base" />
                <span>Add icon</span>
              </button>
            )}

            {!shouldShowCover && (
              <button
                onClick={handleChangeCoverClick}
                className="flex items-center gap-2 px-4 py-1.25
           text-[11px] text-gray-500 
           hover:bg-gray-100 hover:text-gray-800 
           rounded-md transition-all 
           opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <IoImageOutline className="text-base" />
                <span>Add cover</span>
              </button>
            )}
          </div>
        </section>

        {/* Title */}
        <div className="pb-4">
          <div
            ref={titleRef}
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
            className="text-2xl xl:text-4xl capitalize font-bold outline-none text-slate-800 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300"
            data-placeholder="Untitled"
          ></div>

          {lastUpdatedAt && (
            <p className="text-xs xl:text-sm text-slate-400 mt-2">
              Edited {formatePrettyDateTime(lastUpdatedAt)}
            </p>
          )}
        </div>

        {/* Editor Content */}
        <div className="notion-editor-container relative [&_.ProseMirror>p]:first-letter:uppercase">
          
          {editor && <FormattingMenu editor={editor} />}
          {editor && <TableMenu editor={editor} />}
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Input for icon and image hiddden by default */}
      <div>
        <input
          type="file"
          ref={iconInputRef}
          onChange={handleChangeIcon}
          className="hidden"
          accept="image/*"
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChangeCover}
          className="hidden"
          accept="image/*"
        />
      </div>

      {uploading && (
        <UploadInProgress />
      )}
    </div>
  );
};

export default RichTextEditor;
