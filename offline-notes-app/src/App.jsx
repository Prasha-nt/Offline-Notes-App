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
  const [syncStatusMap, setSyncStatusMap] = useState({}); // { noteId: { syncing, synced, error } }

  // Load notes from IndexedDB on mount
  useEffect(() => {
    async function loadNotes() {
      const allNotes = await db.notes.toArray();
      setNotes(allNotes);
      if (allNotes.length > 0) setSelectedNoteId(allNotes[0].id);
    }
    loadNotes();
  }, []);

  // Save note locally and mark as unsynced
  const saveNoteLocally = useCallback(
    async (updatedNote) => {
      const noteToSave = { ...updatedNote, synced: false };
      await db.notes.put(noteToSave);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteToSave.id ? noteToSave : n))
      );
    },
    []
  );

  // Create new note
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

  // Delete note locally and remotely if synced
  const deleteNote = async (id) => {
    await db.notes.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSyncStatusMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    // Also delete remotely if online and note was synced
    if (isOnline) {
      try {
        await axios.delete(`http://localhost:3001/notes/${id}`);
      } catch (error) {
        // ignore error - could retry later
      }
    }

    // Select another note if deleted note was selected
    if (selectedNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Update note callback from editor
  const onNoteChange = async (updatedNote) => {
    await saveNoteLocally(updatedNote);
  };

  // Sync function for one note
  const syncNote = async (note) => {
    setSyncStatusMap((prev) => ({
      ...prev,
      [note.id]: { syncing: true, error: false, synced: false },
    }));

    try {
      if (!note.synced) {
        // Try to find note on server
        const res = await axios.get(`http://localhost:3001/notes/${note.id}`).catch(() => null);

        if (!res || !res.data) {
          // Not found on server, create it
          await axios.post("http://localhost:3001/notes", note);
        } else {
          // Exists, update if local is newer (last-write-wins)
          const serverNote = res.data;
          if (new Date(note.updatedAt) > new Date(serverNote.updatedAt)) {
            await axios.put(`http://localhost:3001/notes/${note.id}`, note);
          }
        }
      }

      // Mark note synced locally
      const syncedNote = { ...note, synced: true };
      await db.notes.put(syncedNote);
      setNotes((prev) =>
        prev.map((n) => (n.id === syncedNote.id ? syncedNote : n))
      );

      setSyncStatusMap((prev) => ({
        ...prev,
        [note.id]: { syncing: false, error: false, synced: true },
      }));
    } catch (error) {
      setSyncStatusMap((prev) => ({
        ...prev,
        [note.id]: { syncing: false, error: true, synced: false },
      }));
    }
  };

  // Sync all unsynced notes when online
  useEffect(() => {
    if (!isOnline) return;

    notes
      .filter((note) => !note.synced)
      .forEach((note) => {
        syncNote(note);
      });
  }, [isOnline, notes]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <NoteList
        notes={notes}
        onSelect={setSelectedNoteId}
        selectedNoteId={selectedNoteId}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: "0.5rem 1rem",
            borderBottom: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button onClick={createNote} style={{ padding: "0.5rem 1rem" }}>
            + New Note
          </button>
          {selectedNote && (
            <button
              onClick={() => deleteNote(selectedNote.id)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#e53e3e",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete Note
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
