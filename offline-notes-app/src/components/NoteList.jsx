// src/components/NoteList.jsx
import React, { useState, useMemo } from "react";

export default function NoteList({ notes, onSelect, selectedNoteId }) {
  const [search, setSearch] = useState("");

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
        width: "320px",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #410179, #8530d1, #a25ce0)",
        color: "white",
        borderRight: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "4px 0 20px rgba(0,0,0,0.2)",
      }}
    >
      <input
        type="text"
        placeholder="🔍 Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "0.75rem",
          border: "none",
          outline: "none",
          fontSize: "1rem",
          background: "rgba(255, 255, 255, 0.1)",
          color: "white",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {filteredNotes.length === 0 && (
          <p style={{ padding: "1rem", color: "#ccc", fontStyle: "italic" }}>
            No notes found
          </p>
        )}

        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelect(note.id)}
            style={{
              cursor: "pointer",
              padding: "1rem",
              margin: "0.5rem",
              borderRadius: "8px",
              background:
                note.id === selectedNoteId
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(255, 255, 255, 0.15)",
              border:
                note.id === selectedNoteId
                  ? "2px solid #ffffff"
                  : "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              transition: "all 0.2s ease-in-out",
              fontWeight: note.id === selectedNoteId ? "bold" : "normal",
              backdropFilter: "blur(12px)",
            }}
          >
            <div>{note.title || <i>(Untitled)</i>}</div>
            <small style={{ color: "#eee" }}>
              {new Date(note.updatedAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
