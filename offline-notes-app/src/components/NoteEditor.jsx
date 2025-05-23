// src/components/NoteEditor.jsx
import React, { useEffect, useState } from "react";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";

import "react-mde/lib/styles/css/react-mde-all.css";

export default function NoteEditor({ note, onChange, syncStatus }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [selectedTab, setSelectedTab] = useState("write");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note]);

  // Debounced update for autosave
  useEffect(() => {
    if (!note) return;

    const handler = setTimeout(() => {
      onChange({ ...note, title, content, updatedAt: new Date().toISOString() });
    }, 500);

    return () => clearTimeout(handler);
  }, [title, content, note, onChange]);

  if (!note) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#999",
          fontStyle: "italic",
        }}
      >
        Select or create a note to get started
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column" }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note Title"
        style={{
          fontSize: "1.5rem",
          marginBottom: "1rem",
          border: "1px solid #ccc",
          padding: "0.5rem",
          borderRadius: "4px",
        }}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ReactMde
          value={content}
          onChange={setContent}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) => Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)}
          childProps={{
            textArea: {
              style: {
                height: "300px",
                resize: "vertical",
              },
            },
          }}
        />
      </div>

      <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
        {syncStatus?.syncing && <span style={{ color: "orange" }}>Syncing...</span>}
        {syncStatus?.error && <span style={{ color: "red" }}>Sync Error</span>}
        {syncStatus?.synced && <span style={{ color: "green" }}>Synced</span>}
        {!syncStatus && <span>Not synced</span>}
      </div>
    </div>
  );
}
