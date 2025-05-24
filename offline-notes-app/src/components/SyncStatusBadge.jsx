// src/components/SyncStatusBadge.jsx
import React from "react";

export default function SyncStatusBadge({ syncing, error, synced }) {
  let statusText = "";
  let background = "linear-gradient(to right, #999, #aaa)";
  let emoji = "📄";

  if (error) {
    statusText = "Error syncing";
    background = "linear-gradient(to right, #d72638, #ff5e5b)";
    emoji = "⚠️";
  } else if (syncing) {
    statusText = "Syncing...";
    background = "linear-gradient(to right, #f9a825, #fbc02d)";
    emoji = "🔄";
  } else if (synced) {
    statusText = "Synced";
    background = "linear-gradient(to right, #4caf50, #81c784)";
    emoji = "✅";
  } else {
    statusText = "Unsynced";
    background = "linear-gradient(to right, #757575, #9e9e9e)";
    emoji = "📄";
  }

  return (
    <span
      style={{
        padding: "0.4rem 0.8rem",
        borderRadius: "20px",
        background,
        color: "white",
        fontSize: "0.8rem",
        fontWeight: "600",
        backdropFilter: "blur(6px)",
        boxShadow: "0 0 8px rgba(0,0,0,0.2)",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
      title={statusText}
    >
      <span>{emoji}</span> {statusText}
    </span>
  );
}
