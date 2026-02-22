import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { useEffect } from "react";
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const CodeBlockComponent = ({ node, editor, getPos }) => {
  const language = node.attrs.language || "javascript";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!node?.textContent) return;

    try {
      await navigator.clipboard.writeText(node.textContent);
      setCopied(true);

      // Optional: reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      setCopied(false);

      // Optional: show user-friendly message
      toast.error("Copy failed. Please try again.");
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleLanguageChange = (e) => {
    const pos = getPos();

    editor
      .chain()
      .focus()
      .setNodeSelection(pos)
      .updateAttributes("codeBlock", {
        language: e.target.value,
      })
      .run();
  };

  return (
    <NodeViewWrapper className="relative group my-3">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#1e1e1e] text-xs text-slate-100 px-3 py-1 rounded-t-lg">
        {/* 🔥 Dropdown instead of plain text */}
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-transparent  text-xs outline-none cursor-pointer opacity-0 group-hover:opacity-100 transition"
        >
          <option className="text-slate-800 cursor-pointer" value="javascript">
            JavaScript
          </option>
          <option className="text-slate-800 cursor-pointer" value="css">
            CSS
          </option>
          <option className="text-slate-800 cursor-pointer" value="html">
            HTML
          </option>
          <option className="text-slate-800 cursor-pointer" value="json">
            JSON
          </option>
          <option className="text-slate-800 cursor-pointer" value="sql">
            SQL
          </option>
        </select>

        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition"
        >
          {copied ? (
            <span className="flex items-center gap-x-1 flex-nowrap cursor-pointer">
              <IoCheckmarkDoneOutline size={18} />
              <span>Copied</span>
            </span>
          ) : (
            <span className="flex items-center gap-x-1 flex-nowrap cursor-pointer">
              <IoCopyOutline size={18} /> <span>Copy</span>
            </span>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="bg-[#282c34] p-4 rounded-b-lg overflow-x-auto">
        <NodeViewContent as="code" spellCheck={false} />
      </pre>
    </NodeViewWrapper>
  );
};

export default CodeBlockComponent;
