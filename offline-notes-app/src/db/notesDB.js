// src/db/notesDB.js
import Dexie from "dexie";

const db = new Dexie("OfflineNotesDB");
db.version(1).stores({
  notes: "id, title, content, updatedAt, synced",
});

export async function getAllNotes() {
  return await db.notes.toArray();
}

export async function addOrUpdateNote(note) {
  await db.notes.put(note);
}

export async function deleteNote(id) {
  await db.notes.delete(id);
}

export async function clearAllNotes() {
  await db.notes.clear();
}

export default db;
