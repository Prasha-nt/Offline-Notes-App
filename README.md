# Offline Notes App

The Offline Notes App is a simple yet powerful markdown note-taking tool built with React, Dexie (IndexedDB), and a mock REST API using `json-server`. It is designed to work offline-first and sync changes when a network is available.

---

## 📋 Features

- ✅ Create, edit, and delete notes
- 📦 Notes persist offline using IndexedDB (via Dexie)
- 🔄 Auto-sync notes to backend when online
- 🌐 Real-time online/offline detection
- 🔔 Visual sync status (Synced, Unsynced, Syncing, Error)
- ⌛ Debounced auto-save for better performance
- ⚡ Fast development setup with Vite

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, JavaScript (ES6+)
- **Database:** IndexedDB (Dexie.js)
- **Backend:** json-server (Mock REST API)
- **Libraries:** Axios, UUID
- **Custom Hook:** `useOnlineStatus`

---

## 🧠 Architecture

- **Dexie (IndexedDB)** handles local persistence
- Sync logic uploads unsynced notes when online
- Conflict resolution uses **last-write-wins** (based on `updatedAt`)
- `navigator.onLine` + event listeners handle connectivity detection

---

## 🚀 Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Prasha-nt/offline-notes-app.git
   cd offline-notes-app
