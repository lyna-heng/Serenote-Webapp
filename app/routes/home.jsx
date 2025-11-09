import React from "react";
import NewJournal from "../components/NewJournal";
import { Link, useOutletContext } from "react-router-dom";

function JournalCard({ journal }) {
  return (
    <article className="journal-card" data-id={journal.id}>
      <div className="journal-card-artwork" aria-hidden="true">📓</div>
      <div className="journal-card-title">{journal.journalName}</div>
      <div className="journal-card-meta">{journal.pages?.length ?? 0} pages</div>
    </article>
  );
}

export default function Home() {
  // read journals/addJournal from Layout via Outlet context
  const outlet = useOutletContext() || {};
  const { journals = [], addJournal = () => {} } = outlet;

  return (
    <main className="page-container">
      <header className="page-header">
        <h2 className="page-heading">Your Journals</h2>
        <NewJournal onAddJournal={addJournal} />
      </header>

      <section className="journals-grid" aria-live="polite">
        {journals.map((j) => (
          <Link key={j.id} to={`/journals/${j.id}`} className="journal-link">
            <JournalCard journal={j} />
          </Link>
        ))}
      </section>
    </main>
  );
}
