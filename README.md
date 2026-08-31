# 🎨 SyncCanvas

**🚀 Live Demo:** https://sync-canvas-io.vercel.app/

> **A real-time, modern collaborative whiteboard for sketching, planning, and creating together.**

SyncCanvas is a sleek, full-stack whiteboard application that allows multiple users to draw and collaborate in real-time. Built with a focus on a modern SaaS aesthetic, it features smooth freehand drawing, geometric shapes, text tools, and an integrated sharing system to securely collaborate with teammates.

---

## ✨ Key Features

- **⚡ Real-Time Collaboration:** Instant drawing synchronization across multiple clients using WebSockets (Socket.io).
- **🖌️ Advanced Drawing Engine:** Powered by `roughjs` for geometric shapes (lines, rectangles, circles, arrows) and `perfect-freehand` for smooth, pressure-simulated brush strokes.
- **🌓 Modern Theme System:** A sleek, fully responsive UI built with Tailwind CSS, featuring persistent Dark and Light modes.
- **🔒 Secure Authentication:** Custom user account creation, login, and session management using JWT and Bcrypt password hashing.
- **📂 Workspace Management:** Create, save, and delete multiple independent canvases linked to your account.
- **🤝 Secure Sharing:** Share specific canvases directly with other registered users via their email addresses for private collaboration.
- **🖼️ Export to PNG:** Download your finished whiteboard sketches locally as an image with a single click.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js
- **Styling:** Tailwind CSS v3
- **Routing:** React Router v7
- **Drawing Libraries:** RoughJS, perfect-freehand
- **Real-time Client:** Socket.io-client
- **State Management:** React Context API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-time Server:** Socket.io
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt

---

## 🚀 Getting Started (Local Development)

Follow these steps to run the SyncCanvas application on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cluster)

### 1. Clone the repository
```bash
git clone [Insert Repository URL]
cd whiteboard-app
```

### 2. Setup the Backend
Navigate to the backend directory, install dependencies, and configure your environment.

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory and add the following variables:
```env
PORT=5000
MONGO_URI=[Insert your MongoDB Connection String]
JWT_SECRET=[Insert a secure random string]
```

Start the backend server:
```bash
npm start
```
*The server will start on port 5000.*

### 3. Setup the Frontend
Open a new terminal window, navigate to the frontend directory, and start the React app.

```bash
cd frontend
npm install
npm run dev
```
*The frontend will start and open automatically on port 3000.*

---

## 💡 Usage

1. **Sign Up/In:** Open `http://localhost:3000` and create a free account or log in.
2. **Create a Canvas:** Open the right-side panel (Sidebar) and click **New Canvas**.
3. **Draw & Design:** Use the floating toolbar at the top to select brushes, shapes, text, or the eraser. Use the left floating toolbox to change colors and stroke sizes.
4. **Collaborate:** Open the Sidebar, enter a colleague's email address under "Share canvas", and click **Share**. When they log in, the canvas will automatically appear in their workspace list.

---

## 📂 Project Structure

```text
whiteboard-app/
├── backend/                  # Express server & Socket.io hub
│   ├── config/               # Database connection setup
│   ├── controllers/          # API endpoint logic (Users, Canvases)
│   ├── middlewares/          # JWT protection and auth checks
│   ├── models/               # Mongoose DB Schemas
│   ├── routes/               # Express routing
│   └── server.js             # Main server entry point
│
└── frontend/                 # React frontend application
    ├── public/
    └── src/
        ├── components/       # UI Components (Board, Sidebar, Toolbar, Toolbox, Auth)
        ├── constants.js      # Global tool enums and color definitions
        ├── store/            # React Context providers (Board, Toolbox)
        ├── utils/            # Math logic, Socket setup, SVG path calculation
        ├── App.js            # App router and layout wrapper
        └── index.css         # Global Tailwind directives
```
