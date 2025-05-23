Offline Notes App
The Offline Notes App is a simple yet powerful markdown note-taking tool built with React, Dexie (IndexedDB), and a mock REST API using json-server. Designed as an offline-first application, it allows users to create, edit, and delete notes even without internet connectivity and syncs changes once the network is available.

Table of Contents
Features

Tech Stack

Architecture

Setup Instructions

Design Decisions & Tradeoffs

Assumptions & Limitations

Running & Testing the App

Future Improvements

Folder Structure

Author

Features
Create, edit, and delete notes

Notes persist offline using IndexedDB

Automatic synchronization with backend when online

Real-time online/offline detection

Visual indicators for sync status (Synced, Unsynced, Syncing, Error)

Debounced auto-saving for better performance

Markdown input editor (no preview yet)

Lightweight and fast: built with React + Vite

Tech Stack
Frontend: React, Vite, JavaScript (ES6+)

Database: IndexedDB via Dexie.js

Backend: json-server (mock REST API)

Sync Logic: Axios, UUID

Custom Hooks: useOnlineStatus for online/offline detection

Architecture
IndexedDB (Dexie):
Stores notes locally. Notes include id, title, content, updatedAt, and synced status.

Syncing Mechanism:
Notes marked as unsynced are synced when back online via POST, PUT, or DELETE requests. Uses a last-write-wins strategy based on timestamps.

Online Detection:
Uses navigator.onLine and browser event listeners for real-time detection.

Setup Instructions
Clone the Repository

Install Dependencies using npm install

Start json-server backend with npx json-server --watch db.json --port 3001

Run the React App using npm run dev

Access the app at the Vite dev server URL (usually http://localhost:5173)

Design Decisions & Tradeoffs
Used Dexie.js for IndexedDB access due to its performance and ease of use

Implemented debounced auto-save to minimize redundant writes

Chose a last-write-wins strategy for conflict resolution to keep it simple

No markdown preview for now to keep UI minimal

Used json-server to avoid the complexity of a full backend during prototyping

Assumptions & Limitations
Single-user usage with no authentication

Sync only works locally with json-server

No UI for merge conflict resolution

Data may reset if db.json is removed or overwritten

No support for markdown preview yet

Running & Testing the App
Create or edit notes while offline

Refresh the page to verify data persistence

Reconnect to the internet to trigger auto-sync

Open db.json to confirm that notes are saved to the backend

Future Improvements
Add markdown preview and formatting options

User authentication and multi-user support

More advanced conflict resolution strategies

Cloud backend integration (e.g., Firebase, Supabase)

Note categorization, search, and tagging

Dark mode toggle

Unit and integration tests

Folder Structure
offline-notes-app/
├── db.json
├── public/
├── src/
│ ├── components/
│ │ ├── NoteEditor.jsx
│ │ ├── NoteList.jsx
│ │ └── SyncStatusBadge.jsx
│ ├── hooks/
│ │ └── useOnlineStatus.js
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── package.json
└── README.md

Author
Prashant Gupta
GitHub: https://github.com/Prasha-nt
