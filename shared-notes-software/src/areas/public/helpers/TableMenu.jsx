import React from "react";
import { useEffect } from "react";
import { useState } from "react";

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

export default TableMenu;
