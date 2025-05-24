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
          color: "#ddd",
          fontStyle: "italic",
          background: "linear-gradient(to bottom right, #410179, #8530d1, #a25ce0, #a473ce, #a669db)",
        }}
      >
        Select or create a note to get started
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom right, #410179, #8530d1, #a25ce0, #a473ce, #a669db)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          color: "white",
        }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            border: "none",
            padding: "0.75rem",
            borderRadius: "8px",
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            outline: "none",
          }}
        />

        <ReactMde
          value={content}
          onChange={setContent}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
          }
          childProps={{
            textArea: {
              style: {
                minHeight: "300px",
                resize: "vertical",
                padding: "1rem",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
              },
            },
          }}
        />

        <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
          {syncStatus?.syncing && <span style={{ color: "orange" }}>⏳ Syncing...</span>}
          {syncStatus?.error && <span style={{ color: "red" }}>❌ Sync Error</span>}
          {syncStatus?.synced && <span style={{ color: "#00ffae" }}>✅ Synced</span>}
          {!syncStatus && <span style={{ color: "#ccc" }}>Not synced</span>}
        </div>
      </div>
    </div>
  );
}
