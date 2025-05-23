// src/components/SyncStatusBadge.jsx
import React from "react";

export default function SyncStatusBadge({ syncing, error, synced }) {
  let statusText = "";
  let color = "gray";

  if (error) {
    statusText = "Error syncing";
    color = "red";
  } else if (syncing) {
    statusText = "Syncing...";
    color = "orange";
  } else if (synced) {
    statusText = "Synced";
    color = "green";
  } else {
    statusText = "Unsynced";
    color = "gray";
  }

  return (
    <span
      style={{
        padding: "0.25rem 0.5rem",
        borderRadius: "0.25rem",
        backgroundColor: color,
        color: "white",
        fontSize: "0.75rem",
        fontWeight: "600",
      }}
      title={statusText}
    >
      {statusText}
    </span>
  );
}
