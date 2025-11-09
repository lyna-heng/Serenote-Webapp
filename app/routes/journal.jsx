import React from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";

const STORAGE_KEY = "serenote_journals";

function loadJournalFromStorage(id) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const journals = JSON.parse(raw);
    return journals.find((j) => String(j.id) === String(id)) || null;
  } catch {
    return null;
  }
}

/**
 * Helper to update page in localStorage (fallback)
 */
function updatePageInStorage(journalId, pageId, { title, content }) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : [];
    const j = all.find((x) => String(x.id) === String(journalId));
    if (!j) return null;
    const p = j.pages.find((x) => String(x.id) === String(pageId));
    if (!p) return null;
    if (typeof title !== "undefined") p.title = title;
    if (typeof content !== "undefined") p.content = content;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return { ...p };
  } catch {
    return null;
  }
}

export default function JournalPage() {
  const { journalId } = useParams();

  const outlet = useOutletContext?.() || {};
  const {
    journals: ctxJournals,
    addPage: ctxAddPage,
    updatePage: ctxUpdatePage,
    deletePage: ctxDeletePage,
  } = outlet;

  const [journal, setJournal] = React.useState(null);
  const [activePageIndex, setActivePageIndex] = React.useState(0);
  const [draft, setDraft] = React.useState("");
  const [titleDraft, setTitleDraft] = React.useState("");

  // load journal from context or fallback to storage
  React.useEffect(() => {
    if (Array.isArray(ctxJournals)) {
      const found = ctxJournals.find((j) => String(j.id) === String(journalId)) || null;
      setJournal(found);
      setActivePageIndex(0);
    } else {
      const found = loadJournalFromStorage(journalId);
      setJournal(found);
      setActivePageIndex(0);
    }
  }, [ctxJournals, journalId]);

  // sync drafts when active page changes
  React.useEffect(() => {
    if (!journal) {
      setDraft("");
      setTitleDraft("");
      return;
    }
    const page = journal.pages?.[activePageIndex] ?? null;
    setDraft(page?.content ?? "");
    setTitleDraft(page?.title ?? "");
  }, [journal, activePageIndex]);

  // Add page: call context action if available, else localStorage fallback.
  const addPage = (content = "", title = "") => {
    if (!journal) return;
    if (typeof ctxAddPage === "function") {
      // prefer ctxAddPage — let layout handle state update/persistence
      ctxAddPage(journal.id, { content, title });
      return;
    }

    // fallback: write to localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex((j) => String(j.id) === String(journal.id));
      if (idx === -1) return;
      const j = all[idx];
      const nextId = j.pages.length ? j.pages[j.pages.length - 1].id + 1 : 1;
      const newPage = { id: nextId, title, content, createdAt: Date.now() };
      j.pages.push(newPage);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      setJournal({ ...j });
      setActivePageIndex(j.pages.length - 1);
    } catch {}
  };

  // Save both title + content. Calls ctxUpdatePage if available (preferred).
  const savePage = () => {
    const page = journal?.pages?.[activePageIndex];
    if (!page) return;

    const payload = { title: titleDraft, content: draft };

    if (typeof ctxUpdatePage === "function") {
      // flexible call: layout may accept (journalId, pageId, payload)
      // or (journalId, pageId, newContent) — pass payload and let layout interpret.
      try {
        ctxUpdatePage(journal.id, page.id, payload);
      } catch {
        // ignore errors — fallback below will run
      }
      return;
    }

    // fallback: update localStorage and local state
    const updated = updatePageInStorage(journal.id, page.id, payload);
    if (updated) {
      // reload the journal from storage to reflect changes
      const reloaded = loadJournalFromStorage(journal.id);
      setJournal(reloaded);
    }
  };

  // Delete page (uses ctxDeletePage if available, else localStorage)
  const removePage = () => {
    const page = journal?.pages?.[activePageIndex];
    if (!page) return;

    if (typeof ctxDeletePage === "function") {
      ctxDeletePage(journal.id, page.id);
      setActivePageIndex((i) => Math.max(0, i - 1));
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : [];
      const j = all.find((x) => String(x.id) === String(journal.id));
      if (!j) return;
      j.pages = j.pages.filter((p) => String(p.id) !== String(page.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      setJournal({ ...j });
      setActivePageIndex((i) => Math.max(0, i - 1));
    } catch {}
  };

  if (!journal) {
    return (
      <main className="journal-missing">
        <h2>Journal not found</h2>
        <p>This journal doesn't exist or may have been removed.</p>
        <p>
          <Link to="/journals">Back to journals</Link>
        </p>
      </main>
    );
  }

  const pages = journal.pages ?? [];
  const currentNumber = pages.length ? activePageIndex + 1 : 0;
  const totalNumber = pages.length;

  // value to show under journal title: prefer page title, fallback to "Page X" or "No pages yet"
  const subheadingText =
    totalNumber === 0 ? "No pages yet" : (pages[activePageIndex]?.title || `Page ${currentNumber}`);

  return (
    <main className="journal-page">
      <div className="journal-topbar">
        <div className="journal-title-wrap">
          <h1 className="journal-title">{journal.journalName}</h1>

          {/* Editable page title shown as subheading */}
          <div className="journal-subheading-wrap">
            {totalNumber === 0 ? (
              <div className="journal-subheading">{subheadingText}</div>
            ) : (
              <input
                className="page-title-input"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                placeholder={`Page ${currentNumber} title`}
                aria-label="Page title"
                onBlur={savePage} // auto-save on blur
              />
            )}
          </div>
        </div>

        <div className="journal-actions">
          <button type="button" className="btn" onClick={() => addPage("", "")}>
            + New Page
          </button>
          <button type="button" className="btn btn-primary" onClick={savePage} disabled={!pages.length}>
            Save
          </button>
          <button type="button" className="btn btn-danger" onClick={removePage} disabled={!pages.length}>
            Delete Page
          </button>
        </div>
      </div>

      <div className="journal-body">
        {/* Optional page list on the left can remain for quick navigation */}
        <aside className="page-list" aria-label="Pages">
          <h4>Pages</h4>
          <ul>
            {pages.length === 0 && <li className="empty-note">No pages yet</li>}
            {pages.map((p, idx) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={idx === activePageIndex ? "page-item active" : "page-item"}
                  onClick={() => setActivePageIndex(idx)}
                >
                  {p.title ? p.title : `Page ${p.id}`}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="page-canvas" aria-label="Page editor">
          {pages.length === 0 ? (
            <div className="empty-page">
              <p>No pages. Use “New Page” to create one.</p>
            </div>
          ) : (
            <div className="page-editor-wrapper">
              <textarea
                className="page-editor"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write here..."
              />

              {/* Bottom-right page counter */}
              <div className="page-counter" aria-hidden>
                {`${currentNumber} / ${totalNumber}`}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}