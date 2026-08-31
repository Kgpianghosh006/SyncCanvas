import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import boardContext from '../../store/board-context';

const LandingPage = () => {
  const { isUserLoggedIn } = useContext(boardContext);

  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-800 text-indigo-300 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          Real-time collaborative whiteboard
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-50 tracking-tight leading-none">
            Sync<span className="text-indigo-400">Canvas</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-md mx-auto leading-relaxed">
            Collaborate in real-time. Draw, sketch, and create without limits — together.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
          {isUserLoggedIn ? (
            <Link
              to="/board"
              className="h-10 px-6 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              Go to your Boards →
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="h-10 px-6 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md w-full sm:w-auto"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="h-10 px-6 inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg border border-zinc-700 transition-all duration-150 active:scale-95 shadow-sm w-full sm:w-auto"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {['Freehand drawing', 'Shapes & arrows', 'Text tool', 'Real-time sync', 'Canvas sharing'].map(feat => (
            <span key={feat} className="px-3 py-1 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full">
              {feat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;