import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import boardContext from '../../store/board-context';

const LandingPage = () => {
  const { isUserLoggedIn } = useContext(boardContext);

  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 sm:px-6 selection:bg-indigo-500/30">
      
      {/* Very subtle, minimal grid background - human, not overwhelming */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      {/* Top subtle glow for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
        
        {/* Simple, understated badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Real-time collaborative whiteboard
        </div>

        {/* Clean, legible typography */}
        <h1 className="text-5xl sm:text-6xl font-bold text-zinc-50 tracking-tight mb-6">
          Sync<span className="text-indigo-500">Canvas</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl mx-auto">
          A simple, blazing fast canvas for collaborative work. Draw, sketch, and wireframe your ideas together in real-time.
        </p>

        {/* Tactile, human-standard buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          {isUserLoggedIn ? (
            <Link
              to="/board"
              className="w-full sm:w-auto px-7 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors border border-transparent shadow-sm"
            >
              Go to your workspace
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors border border-transparent shadow-sm"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium rounded-lg transition-colors border border-zinc-700 shadow-sm"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {['Freehand drawing', 'Shapes & arrows', 'Text tool', 'Real-time sync', 'Canvas sharing'].map(feat => (
            <span 
              key={feat} 
              className="px-4 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-full cursor-default hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700 transition-all duration-200 shadow-sm"
            >
              {feat}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
