import React from "react";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { Outlet, useLoaderData, useLocation } from "react-router";
import JournalSidebar from "../components/JournalSidebar.jsx";

const STORAGE_KEY = "serenote_journals";

export async function clientLoader() {
  await new Promise((r) => setTimeout(r, 100));
  const initialJournals = [
    { id: 1, journalName: "Family", pages: [{ id: 1, content: "First family note", createdAt: Date.now() }] },
    { id: 2, journalName: "Trips", pages: [{ id: 1, content: "Packing list", createdAt: Date.now() }] },
    { id: 3, journalName: "Friends", pages: [] },
  ];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return { journals: raw ? JSON.parse(raw) : initialJournals };
  } catch {
    return { journals: initialJournals };
  }
}

export default function Layout() {
  const { journals: loaded } = useLoaderData();

  const [journals, setJournals] = React.useState(loaded);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(journals));
    } catch {}
  }, [journals]);

  const addJournal = (name) => {
    const nextId = journals.length ? journals[journals.length - 1].id + 1 : 1;
    const j = { id: nextId, journalName: name || `New Journal ${nextId}`, pages: [] };
    setJournals((p) => [...p, j]);
    return j;
  };

  const addPage = (journalId, content = "") => {
    setJournals((prev) =>
      prev.map((j) => {
        if (String(j.id) !== String(journalId)) return j;
        const nextPageId = j.pages.length ? j.pages[j.pages.length - 1].id + 1 : 1;
        const newPage = { id: nextPageId, content, createdAt: Date.now() };
        return { ...j, pages: [...j.pages, newPage] };
      })
    );
  };

  const updatePage = (journalId, pageId, newContent) => {
    setJournals((prev) =>
      prev.map((j) => {
        if (String(j.id) !== String(journalId)) return j;
        return {
          ...j,
          pages: j.pages.map((p) => (String(p.id) === String(pageId) ? { ...p, content: newContent } : p)),
        };
      })
    );
  };

  const deletePage = (journalId, pageId) => {
    setJournals((prev) =>
      prev.map((j) => {
        if (String(j.id) !== String(journalId)) return j;
        return { ...j, pages: j.pages.filter((p) => String(p.id) !== String(pageId)) };
      })
    );
  };

  const outletContext = React.useMemo(
    () => ({ journals, addJournal, addPage, updatePage, deletePage, setJournals }),
    [journals]
  );

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  // hide sidebar automatically when on a single journal page
  const onJournalPage = /^\/journals\/\d+/.test(location.pathname);
  const toggleSidebar = () => setIsSidebarOpen((s) => !s);

  return (
    <div className="app-layout">
      {onJournalPage ? (
        <JournalSidebar />) : (!onJournalPage && isSidebarOpen && <Sidebar onToggle={toggleSidebar} />
      )}

      <main className="main-content">
        {/* pass toggle + open state into Header so it can show reopen button */}
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} onJournalPage={onJournalPage} />
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}
