import React from "react";
import { Link } from "react-router";

export default function JournalSidebar() {
  return (
    <aside className="journal-sidebar">
      <div className="journal-sidebar-top">
        <Link to="/" className="journal-back-btn" aria-label="Back to journals">
          &lt;
        </Link>
      </div>

      <nav className="journal-tools" aria-label="Journal tools">
        <button className="tool-btn" type="button" title="Pen">✎</button>
        <button className="tool-btn" type="button" title="Stamp">◯</button>
        <button className="tool-btn" type="button" title="Undo">⤺</button>
        <button className="tool-btn" type="button" title="Redo">⤻</button>
        <button className="tool-btn" type="button" title="Lasso">◐</button>
        <button className="tool-btn" type="button" title="Image">🖼</button>
        <button className="tool-btn" type="button" title="Draw">✏︎</button>
        <button className="tool-btn" type="button" title="Text">T</button>
        <button className="tool-btn" type="button" title="Shuffle">⇄</button>

        <div className="tool-swatches">
          <button className="color-swatch" aria-label="Color 1"></button>
          <button className="color-swatch" aria-label="Color 2"></button>
          <button className="color-swatch" aria-label="Color 3"></button>
        </div>

        <div className="tool-more">
          <button className="more-dots" aria-label="More"></button>
        </div>
      </nav>
    </aside>
  );
}
