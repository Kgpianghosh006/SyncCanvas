import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import boardContext from '../../store/board-context';

const Sidebar = () => {
  const [canvases, setCanvases] = useState([]);
  const token = localStorage.getItem('whiteboard_user_token');
  const { canvasId, setCanvasId, isUserLoggedIn, setUserLoginStatus } = useContext(boardContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (isUserLoggedIn) fetchCanvases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoggedIn]);

  const fetchCanvases = async () => {
    try {
      const response = await axios.get(`${process.env.RENDER_APP_BACKEND_URL || "http://localhost:5000"}/api/canvas/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCanvases(response.data);
      if (response.data.length === 0) {
        const newCanvas = await handleCreateCanvas();
        if (newCanvas) { setCanvasId(newCanvas._id); handleCanvasClick(newCanvas._id); }
      } else if (response.data.length > 0) {
        if (!id) { setCanvasId(response.data[0]._id); handleCanvasClick(response.data[0]._id); }
      }
    } catch (error) {
      console.error('Error fetching canvases:', error);
    }
  };

  const handleCreateCanvas = async () => {
    try {
      const response = await axios.post(`${process.env.RENDER_APP_BACKEND_URL || "http://localhost:5000"}/api/canvas/create`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCanvases();
      setCanvasId(response.data.canvasId);
      handleCanvasClick(response.data.canvasId);
    } catch (error) {
      console.error('Error creating canvas:', error);
      return null;
    }
  };

  const handleDeleteCanvas = async (canvasIdToDelete) => {
    try {
      await axios.delete(`${process.env.RENDER_APP_BACKEND_URL || "http://localhost:5000"}/api/canvas/delete/${canvasIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const response = await axios.get(`${process.env.RENDER_APP_BACKEND_URL || "http://localhost:5000"}/api/canvas/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCanvases(response.data);
      
      if (response.data.length === 0) {
        const newCanvas = await handleCreateCanvas();
        if (newCanvas) { setCanvasId(newCanvas._id); handleCanvasClick(newCanvas._id); }
      } else if (canvasIdToDelete === (id || canvasId)) {
        // If we deleted the currently active canvas, redirect to the first available one
        setCanvasId(response.data[0]._id); 
        handleCanvasClick(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error deleting canvas:', error);
      alert(error.response?.data?.error || "Error deleting canvas");
    }
  };

  const handleCanvasClick = (canvasIdToClick) => navigate(`/board/${canvasIdToClick}`);

  const handleLogout = () => {
    localStorage.removeItem('whiteboard_user_token');
    window.location.href = '/';
  };

  const handleShare = async () => {
    if (!email.trim()) { setError('Please enter an email.'); return; }
    setError(''); setSuccess('');
    const targetId = id || canvasId;
    if (!targetId) { setError('No canvas selected to share.'); return; }
    try {
      const response = await axios.put(
        `${process.env.RENDER_APP_BACKEND_URL || "http://localhost:5000"}/api/canvas/share/${targetId}`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(response.data.message);
      setEmail('');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to share canvas.');
      setTimeout(() => setError(''), 5000);
    }
  };

  // Closed toggle button
  if (!isOpen && isUserLoggedIn) {
    return (
      <button
        className="fixed top-5 right-5 w-9 h-9 flex items-center justify-center rounded-xl bg-[#fdfbf7] backdrop-blur-md shadow-lg z-50 border border-slate-300 text-slate-700 hover:bg-[#f3f0e9] transition-all duration-150"
        onClick={() => setIsOpen(true)}
        title="Open Sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }

  return (
    <div
      className="fixed right-0 top-0 h-screen w-72 bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 shadow-xl flex flex-col z-50"
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800">
        <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">History</span>
        <button
          onClick={() => setIsOpen(false)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-300 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Create button */}
      <div className="px-4 pt-4">
        <button
          onClick={handleCreateCanvas}
          disabled={!isUserLoggedIn}
          className="w-full h-9 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-all duration-150 active:scale-95 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Canvas
        </button>
      </div>

      {/* Canvas list */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2 px-1">
          Canvases
        </p>
        <ul className="space-y-1">
          {canvases.map(canvas => (
            <li key={canvas._id}>
              <div
                className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                  canvas._id === (id || canvasId)
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-800 border border-transparent'
                }`}
                onClick={() => handleCanvasClick(canvas._id)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 flex-shrink-0 ${canvas._id === (id || canvasId) ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className={`text-xs font-mono truncate ${canvas._id === (id || canvasId) ? 'text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-slate-600 dark:text-zinc-400'}`}>
                    {canvas._id.slice(-12)}…
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteCanvas(canvas._id); }}
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-xs text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2 py-1 rounded-md transition-all duration-150 font-medium"
                >
                  del
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Share section */}
      <div className="px-4 pb-4 border-t border-slate-100 dark:border-zinc-800 pt-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
          Share canvas
        </p>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="colleague@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-9 px-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
          />
          <button
            onClick={handleShare}
            disabled={!isUserLoggedIn}
            className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-all duration-150 active:scale-95"
          >
            Share
          </button>
          {error && (
            <p className="text-xs px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400">
              {success}
            </p>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 pb-5">
        {isUserLoggedIn ? (
          <button
            onClick={handleLogout}
            className="w-full h-9 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-lg border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-150 active:scale-95"
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-150 active:scale-95"
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;