import { useState } from "react";
/**
 * Props:
 *  - onAddJournal: (name: string) => void
 */
export default function NewJournal({ onAddJournal }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const openForm = () => {
    setName("");
    setOpen(true);
  };

  const closeForm = () => {
    setName("");
    setOpen(false);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (typeof onAddJournal === "function") onAddJournal(trimmed);
    closeForm();
  };

  return (
    <div className="new-journal-root">
      {open ? (
        <form className="new-journal-form" onSubmit={handleAdd}>
          <input
            className="new-journal-input"
            aria-label="Journal name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Journal name"
          />
          <button type="submit" className="btn btn-primary">Add</button>
          <button type="button" onClick={closeForm} className="btn btn-ghost">Cancel</button>
        </form>
      ) : (
        <button className="new-journal-btn" onClick={openForm} aria-expanded="false">
          New
        </button>
      )}
    </div>
  );
}