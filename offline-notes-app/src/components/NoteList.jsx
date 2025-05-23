// src/components/NoteList.jsx
import React, { useState, useMemo } from "react";

export default function NoteList({ notes, onSelect, selectedNoteId }) {
  const [search, setSearch] = useState("");

  // Filter notes by title/content with simple case-insensitive search
  const filteredNotes = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(lowerSearch) ||
          n.content.toLowerCase().includes(lowerSearch)
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [notes, search]);

  return (
    <div
      style={{
        width: "300px",
        borderRight: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "0.5rem",
          border: "none",
          borderBottom: "1px solid #ccc",
          outline: "none",
        }}
      />
      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {filteredNotes.length === 0 && (
          <p style={{ padding: "1rem", color: "#777" }}>No notes found</p>
        )}
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelect(note.id)}
            style={{
              cursor: "pointer",
              padding: "0.75rem 1rem",
              backgroundColor: note.id === selectedNoteId ? "#f0f0f0" : "white",
              borderBottom: "1px solid #ddd",
              fontWeight: note.id === selectedNoteId ? "bold" : "normal",
            }}
          >
            <div>{note.title || <i>(Untitled)</i>}</div>
            <small style={{ color: "#999" }}>
              {new Date(note.updatedAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
