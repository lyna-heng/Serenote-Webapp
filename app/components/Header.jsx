// Header.jsx
import { useLocation } from "react-router";

export default function Header({ onToggleSidebar, isSidebarOpen, onJournalPage }) {
  const { pathname } = useLocation();

  const titles = {
    "/journals": "Journals",
    "/stickers": "Stickers",
    "/explore": "Explore journals",
    "/favourites": "Favourites",
    "/profile": "Profile",
  };

  const pageTitle = titles[pathname] || "Serenote";

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-title-container">
          {!isSidebarOpen && !onJournalPage && (
            <button
              className="sidebar-reopen-btn"
              onClick={onToggleSidebar}
              aria-label="Open sidebar"
            >
              ☰
            </button>
          )}
          <h1 className="header-title">{pageTitle}</h1>
        </div>
      </div>

      <div className="header-icons">
        <button className="icon-btn">🔔</button>
        <button className="icon-btn">🏪</button>
        <button className="icon-btn">👤</button>
      </div>
    </header>
  );
}
