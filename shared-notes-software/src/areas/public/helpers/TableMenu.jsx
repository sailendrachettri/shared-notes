import React, { useEffect, useState, useRef, useCallback } from "react";

// ─── CSS ────────────────────────────────────────────────────────────────────
const CSS = `
  /* ── Table cell borders (fixes Tailwind preflight reset) ── */
  .ProseMirror table {
    border-collapse: collapse !important;
    table-layout: fixed;
    width: 100%;
    overflow: hidden;
    margin: 0;
  }
  .ProseMirror table td,
  .ProseMirror table th {
    border: 1px solid #e0e0de !important;
    padding: 8px 12px;
    min-width: 60px;
    vertical-align: top;
    position: relative;
    box-sizing: border-box;
    word-break: break-word;
  }
  .ProseMirror table th {
    background: #f7f7f5;
    font-weight: 600;
    font-size: 13px;
    color: #6b6b68;
  }
  .ProseMirror table td > *,
  .ProseMirror table th > * { margin: 0; }
  .ProseMirror table .selectedCell {
    background: #dbeafe !important;
    border-color: #93c5fd !important;
  }
  .ProseMirror table .column-resize-handle {
    position: absolute;
    right: -2px; top: 0; bottom: 0;
    width: 4px;
    background: #4f90f0;
    cursor: col-resize;
    z-index: 20;
  }
  .ProseMirror.resize-cursor { cursor: col-resize; }

  /* ── Overlay: pointer-events NONE so it never blocks the table ── */
  .tm-overlay {
    position: absolute;
    pointer-events: none;
    z-index: 40;
  }

  /* Children restore pointer-events only on themselves */
  .tm-row-handles,
  .tm-col-handles,
  .tm-add-row,
  .tm-add-col {
    position: absolute;
    pointer-events: auto;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  .tm-show .tm-row-handles,
  .tm-show .tm-col-handles,
  .tm-show .tm-add-row,
  .tm-show .tm-add-col { opacity: 1; }

  /* ── Drag handle strips ── */
  .tm-row-handles { display: flex; flex-direction: column; }
  .tm-col-handles { display: flex; flex-direction: row; }

  .tm-drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    border-radius: 3px;
    flex-shrink: 0;
    transition: background 0.1s;
  }
  .tm-drag-handle:hover  { background: rgba(0,0,0,0.07); }
  .tm-drag-handle:active { cursor: grabbing; }

  /* ── Add row / col buttons ── */
  .tm-add-row, .tm-add-col {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border: 1.5px dashed #ccc;
    border-radius: 4px;
    background: #fff;
    color: #aaa;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    white-space: nowrap;
    transition: border-color 0.12s, color 0.12s, background 0.12s, opacity 0.15s ease;
  }
  .tm-add-row:hover, .tm-add-col:hover {
    border-color: #888;
    border-style: solid;
    color: #333;
    background: #f5f5f4;
  }
  .tm-add-row { height: 26px; }
  .tm-add-col { width: 26px; flex-direction: column; }

  /* ── Context menu ── */
  .tm-ctx {
    position: fixed;
    background: #fff;
    border: 1px solid #e4e4e2;
    border-radius: 8px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07);
    z-index: 9999;
    padding: 4px;
    min-width: 200px;
    font-family: inherit;
  }
  .tm-ctx-group { padding: 3px 0; border-bottom: 1px solid #f0f0ee; }
  .tm-ctx-group:last-child { border-bottom: none; }
  .tm-ctx-label {
    padding: 3px 8px 4px;
    font-size: 10px;
    font-weight: 700;
    color: #bbb;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .tm-ctx-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 6px 10px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 5px;
    color: #37352f;
    font-size: 13px;
    font-family: inherit;
    transition: background 0.1s;
    text-align: left;
  }
  .tm-ctx-btn:hover { background: #f7f7f5; }
  .tm-ctx-btn.tm-danger { color: #dc2626; }
  .tm-ctx-btn.tm-danger:hover { background: #fef2f2; }
  .tm-ctx-icon { width: 16px; text-align: center; font-style: normal; flex-shrink: 0; }
`;

// ─── Icons ───────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const DragDots = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor" opacity="0.35">
    <circle cx="2" cy="2"  r="1.1"/><circle cx="6" cy="2"  r="1.1"/>
    <circle cx="2" cy="6"  r="1.1"/><circle cx="6" cy="6"  r="1.1"/>
    <circle cx="2" cy="10" r="1.1"/><circle cx="6" cy="10" r="1.1"/>
  </svg>
);

// ─── Context Menu ─────────────────────────────────────────────────────────────
function ContextMenu({ x, y, editor, onClose }) {
  const ref = useRef();

  useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) onClose(); };
    // Delay so the triggering right-click doesn't immediately close it
    const t = setTimeout(() => document.addEventListener("mousedown", close), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", close); };
  }, [onClose]);

  const act = (fn) => { fn(); onClose(); };
  const c   = () => editor.chain().focus();

  const safeX = Math.min(x, window.innerWidth  - 212);
  const safeY = Math.min(y, window.innerHeight - 270);

  return (
    <div className="tm-ctx" ref={ref} style={{ left: safeX, top: safeY }}>
      <div className="tm-ctx-group">
        <div className="tm-ctx-label">Column</div>
        <button className="tm-ctx-btn" onClick={() => act(() => c().addColumnBefore().run())}>
          <i className="tm-ctx-icon">←</i> Insert left
        </button>
        <button className="tm-ctx-btn" onClick={() => act(() => c().addColumnAfter().run())}>
          <i className="tm-ctx-icon">→</i> Insert right
        </button>
        <button className="tm-ctx-btn tm-danger" onClick={() => act(() => c().deleteColumn().run())}>
          <i className="tm-ctx-icon">✕</i> Delete column
        </button>
      </div>
      <div className="tm-ctx-group">
        <div className="tm-ctx-label">Row</div>
        <button className="tm-ctx-btn" onClick={() => act(() => c().addRowBefore().run())}>
          <i className="tm-ctx-icon">↑</i> Insert above
        </button>
        <button className="tm-ctx-btn" onClick={() => act(() => c().addRowAfter().run())}>
          <i className="tm-ctx-icon">↓</i> Insert below
        </button>
        <button className="tm-ctx-btn tm-danger" onClick={() => act(() => c().deleteRow().run())}>
          <i className="tm-ctx-icon">✕</i> Delete row
        </button>
      </div>
      <div className="tm-ctx-group">
        <button className="tm-ctx-btn tm-danger" onClick={() => act(() => c().deleteTable().run())}>
          <i className="tm-ctx-icon">🗑</i> Delete table
        </button>
      </div>
    </div>
  );
}

// ─── TableMenu ────────────────────────────────────────────────────────────────
const TableMenu = ({ editor }) => {
  const [overlay, setOverlay] = useState(null);
  const [show, setShow]       = useState(false);
  const [ctxMenu, setCtxMenu] = useState(null);
  const showTimer = useRef();
  const hideTimer = useRef();
  const rafRef    = useRef();

  // ─── Measure using offsetTop/Left — scroll-stable, no viewport coords ───
  const measure = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!editor) return;

      const editorDom = editor.view.dom;           // the ProseMirror contenteditable div
      const tbl = editorDom.querySelector("table");

      if (!tbl) { setOverlay(null); return; }

      // Walk offsetParent chain until we hit the editorDom
      // This gives position relative to the editor div (stable on scroll)
      let offsetTop = 0, offsetLeft = 0, el = tbl;
      while (el && el !== editorDom) {
        offsetTop  += el.offsetTop;
        offsetLeft += el.offsetLeft;
        el = el.offsetParent;
      }

      const rows     = Array.from(tbl.querySelectorAll("tr"));
      const firstRow = rows[0];
      const cols     = firstRow ? Array.from(firstRow.querySelectorAll("td, th")) : [];

      setOverlay({
        top:        offsetTop,
        left:       offsetLeft,
        width:      tbl.offsetWidth,
        height:     tbl.offsetHeight,
        rowHeights: rows.map(r => r.offsetHeight),
        colWidths:  cols.map(c => c.offsetWidth),
      });
    });
  }, [editor]);

  // ─── Re-measure on transaction + resize. Clear on note switch ───────────
  useEffect(() => {
    if (!editor) return;

    const onTransaction = () => {
      // If table no longer exists, clear immediately
      if (!editor.view.dom.querySelector("table")) {
        setOverlay(null);
        setShow(false);
        return;
      }
      measure();
    };

    editor.on("transaction", onTransaction);
    window.addEventListener("resize", measure);
    measure(); // initial paint

    return () => {
      editor.off("transaction", onTransaction);
      window.removeEventListener("resize", measure);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Clean up on unmount / note switch
      setOverlay(null);
      setShow(false);
    };
  }, [editor, measure]);

  // ─── Right-click → context menu ─────────────────────────────────────────
  useEffect(() => {
    if (!editor) return;
    const handler = (e) => {
      const cell = e.target.closest("td, th");
      if (!cell || !editor.view.dom.contains(cell)) return;
      e.preventDefault();
      setCtxMenu({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, [editor]);

  // ─── Hover: debounced so moving between handles/buttons doesn't flicker ──
  const onEnter = useCallback(() => {
    clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => setShow(true), 50);
  }, []);

  const onLeave = useCallback(() => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setShow(false), 280);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────
  if (!overlay) return null;

  const { top, left, width, height, rowHeights, colWidths } = overlay;
  const PAD = 24; // px of space outside table for handle strip

  return (
    <>
      <style>{CSS}</style>

      <div
        className={`tm-overlay${show ? " tm-show" : ""}`}
        style={{
          // Expand the overlay bounding box so handles are reachable via hover
          // but overlay itself has pointer-events:none — won't block table clicks
          top:    top    - PAD,
          left:   left   - PAD,
          width:  width  + PAD + 34,
          height: height + PAD + 34,
        }}
      >
        {/* ── Row drag handles ── */}
        <div
          className="tm-row-handles"
          style={{ top: PAD, left: 2 }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {rowHeights.map((h, i) => (
            <div
              key={i}
              className="tm-drag-handle"
              style={{ height: h, width: 18 }}
              title="Drag row"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("tm/row", String(i));
              }}
            >
              <DragDots />
            </div>
          ))}
        </div>

        {/* ── Col drag handles ── */}
        <div
          className="tm-col-handles"
          style={{ left: PAD, top: 2 }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {colWidths.map((w, i) => (
            <div
              key={i}
              className="tm-drag-handle"
              style={{ width: w, height: 18 }}
              title="Drag column"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("tm/col", String(i));
              }}
            >
              <DragDots />
            </div>
          ))}
        </div>

        {/* ── Add Row ── */}
        <button
          className="tm-add-row"
          style={{ width, left: PAD, bottom: 6 }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onMouseDown={(e) => e.preventDefault()} // ← prevent stealing editor focus
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          <PlusIcon /> Add row
        </button>

        {/* ── Add Column ── */}
        <button
          className="tm-add-col"
          style={{ height, top: PAD, right: 6 }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onMouseDown={(e) => e.preventDefault()} // ← prevent stealing editor focus
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          <PlusIcon />
          <span style={{ writingMode: "vertical-rl", fontSize: 10, marginTop: 2 }}>Col</span>
        </button>
      </div>

      {/* ── Context menu ── */}
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          editor={editor}
          onClose={() => setCtxMenu(null)}
        />
      )}
    </>
  );
};

export default TableMenu;