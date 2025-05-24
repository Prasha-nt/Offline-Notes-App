import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";

import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import useOnlineStatus from "./hooks/useOnlineStatus";

// Setup Dexie DB
const db = new Dexie("NotesDB");
db.version(1).stores({
  notes: "id,title,content,updatedAt,synced",
});

function App() {
  const isOnline = useOnlineStatus();

  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [syncStatusMap, setSyncStatusMap] = useState({});

  useEffect(() => {
    async function loadNotes() {
      const allNotes = await db.notes.toArray();
      setNotes(allNotes);
      if (allNotes.length > 0) setSelectedNoteId(allNotes[0].id);
    }
    loadNotes();
  }, []);

  const saveNoteLocally = useCallback(async (updatedNote) => {
    const noteToSave = { ...updatedNote, synced: false };
    await db.notes.put(noteToSave);
    setNotes((prev) => prev.map((n) => (n.id === noteToSave.id ? noteToSave : n)));
  }, []);

  const createNote = async () => {
    const newNote = {
      id: uuidv4(),
      title: "",
      content: "",
      updatedAt: new Date().toISOString(),
      synced: false,
    };
    await db.notes.add(newNote);
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  };

  const deleteNote = async (id) => {
    await db.notes.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSyncStatusMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    if (isOnline) {
      try {
        await axios.delete(`http://localhost:3001/notes/${id}`);
      } catch {}
    }

    if (selectedNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const onNoteChange = async (updatedNote) => {
    await saveNoteLocally(updatedNote);
  };

  const syncNote = async (note) => {
    setSyncStatusMap((prev) => ({
      ...prev,
      [note.id]: { syncing: true, error: false, synced: false },
    }));

    try {
      const res = await axios.get(`http://localhost:3001/notes/${note.id}`).catch(() => null);

      if (!res || !res.data) {
        await axios.post("http://localhost:3001/notes", note);
      } else {
        const serverNote = res.data;
        if (new Date(note.updatedAt) > new Date(serverNote.updatedAt)) {
          await axios.put(`http://localhost:3001/notes/${note.id}`, note);
        }
      }

      const syncedNote = { ...note, synced: true };
      await db.notes.put(syncedNote);
      setNotes((prev) => prev.map((n) => (n.id === syncedNote.id ? syncedNote : n)));

      setSyncStatusMap((prev) => ({
        ...prev,
        [note.id]: { syncing: false, error: false, synced: true },
      }));
    } catch {
      setSyncStatusMap((prev) => ({
        ...prev,
        [note.id]: { syncing: false, error: true, synced: false },
      }));
    }
  };

  useEffect(() => {
    if (!isOnline) return;
    notes.filter((note) => !note.synced).forEach(syncNote);
  }, [isOnline, notes]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(135deg, #410179, #8530d1, #a25ce0, #a473ce, #a669db)",
        color: "white",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <NoteList
        notes={notes}
        onSelect={setSelectedNoteId}
        selectedNoteId={selectedNoteId}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderLeft: "2px solid rgba(255,255,255,0.2)",
          position: "relative",
        }}
      >
        {/* Online/Offline Status badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "600",
            fontSize: "0.9rem",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: isOnline ? "#4ade80" : "#f87171", // green or red
              boxShadow: `0 0 8px ${isOnline ? "#4ade80" : "#f87171"}`,
            }}
            title={isOnline ? "Online" : "Offline"}
          />
          <span>{isOnline ? "Online" : "Offline"}</span>
        </div>

        <div
          style={{
            padding: "0.75rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "2.5rem", // leave space for status badge
          }}
        >
          <button
            onClick={createNote}
            style={{
              padding: "0.5rem 1.25rem",
              background: "#a473ce",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8530d1")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#a473ce")}
          >
            ✏️ New Note
          </button>

          {selectedNote && (
            <button
              onClick={() => deleteNote(selectedNote.id)}
              style={{
                padding: "0.5rem 1.25rem",
                background: "#e53e3e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b42323")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e53e3e")}
            >
              🗑️ Delete
            </button>
          )}
        </div>

        <NoteEditor
          note={selectedNote}
          onChange={onNoteChange}
          syncStatus={syncStatusMap[selectedNoteId] || {}}
        />
      </div>
    </div>
  );
}

export default App;
