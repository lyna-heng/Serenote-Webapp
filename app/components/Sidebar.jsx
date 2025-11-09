// Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

function SidebarHeader({ onToggle }) {
  return (
    <div className="sidebar-header">
      <button className="close-sidebar-btn" onClick={onToggle}>
        Close Sidebar Button
      </button>
    </div>
  );
}

function SidebarList() {
  const links = [
    { to: "/journals", label: "Journals" },
    { to: "/stickers", label: "Stickers" },
    { to: "/explore", label: "Explore journals" },
    { to: "/favourites", label: "Favourites" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <nav className="sidebar-list">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => "sidebar-item" + (isActive ? " active" : "")}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar(props) {
  // props.onToggle may be undefined if parent doesn't pass it — that's fine
  return (
    <aside className="sidebar">
      <SidebarHeader onToggle={props.onToggle} />
      <SidebarList />
    </aside>
  );
}
