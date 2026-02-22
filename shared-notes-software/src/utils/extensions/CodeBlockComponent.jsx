import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

const CodeBlockComponent = ({ node, editor, getPos }) => {
  const language = node.attrs.language || "javascript";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(node.textContent);
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
      <div className="flex justify-between items-center bg-[#1e1e1e] text-xs text-gray-300 px-3 py-1 rounded-t-lg">
        
        {/* 🔥 Dropdown instead of plain text */}
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-transparent text-gray-300 text-xs outline-none cursor-pointer"
        >
          <option value="javascript">JavaScript</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="json">JSON</option>
          <option value="sql">SQL</option>
        </select>

        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition"
        >
          Copy
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