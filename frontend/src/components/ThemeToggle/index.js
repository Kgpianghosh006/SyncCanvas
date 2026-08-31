import React from 'react';
import { useTheme } from '../../store/ThemeProvider';

const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggle(); }}
      onMouseDown={(e) => e.stopPropagation()}
      className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150 ${
        isDark 
          ? 'text-yellow-400 hover:bg-zinc-800' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        // Sun icon
        <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="5" />
          <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        // Moon icon (filled)
        <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
