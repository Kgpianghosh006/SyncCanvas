import React, { useContext, useState, useEffect } from "react";
import cx from "classnames";
import classes from "./index.module.css";
import {
  COLORS,
  FILL_TOOL_TYPES,
  SIZE_TOOL_TYPES,
  STROKE_TOOL_TYPES,
  TOOL_ITEMS,
} from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import boardContext from "../../store/board-context";

const Toolbox = () => {
  const { activeToolItem } = useContext(boardContext);
  const { toolboxState, changeStroke, changeFill, changeSize } = useContext(toolboxContext);

  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX > window.innerWidth - 60) newX = window.innerWidth - 60;
        if (newY > window.innerHeight - 60) newY = window.innerHeight - 60;
        setPosition({ x: newX, y: newY });
      }
    };
    const handleGlobalMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset]);

  const startDrag = (e) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.stopPropagation();
  };

  const strokeColor = toolboxState[activeToolItem]?.stroke;
  const fillColor = toolboxState[activeToolItem]?.fill;
  const size = toolboxState[activeToolItem]?.size;

  const hasStroke = STROKE_TOOL_TYPES.includes(activeToolItem);
  const hasFill = FILL_TOOL_TYPES.includes(activeToolItem);
  const hasSize = SIZE_TOOL_TYPES.includes(activeToolItem);

  if (!hasStroke && !hasFill && !hasSize) return null;

  return (
    <div
      className="absolute z-50 select-none"
      style={{ left: position.x, top: position.y }}
    >
      {isMinimized ? (
        <button
          className="bg-[#fdfbf7] backdrop-blur-md p-2.5 rounded-xl shadow-lg hover:bg-[#f3f0e9] transition-all duration-150 border border-slate-300 text-slate-700 flex items-center justify-center"
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
          title="Show Toolbox"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      ) : (
        <div
          className={classes.container}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <div
            className="flex justify-between items-center px-3 py-2 cursor-move border-b border-slate-200/60 dark:border-zinc-700/60 rounded-t-2xl hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition"
            onMouseDown={startDrag}
          >
            <div className="flex space-x-1 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
            </div>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); setIsMinimized(true); setIsDragging(false); }}
              className="w-6 h-6 flex items-center justify-center text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-md transition"
              title="Minimize"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" d="M18 12H6" />
              </svg>
            </button>
          </div>

          {/* Properties */}
          <div className="px-0.5 pb-1">
            {hasStroke && (
              <div className={classes.selectOptionContainer}>
                <div className={classes.toolBoxLabel}>Stroke</div>
                <div className={classes.colorsContainer}>
                  <input
                    className={classes.colorPicker}
                    type="color"
                    value={strokeColor}
                    onChange={(e) => changeStroke(activeToolItem, e.target.value)}
                  />
                  {Object.keys(COLORS).map((k) => (
                    <div
                      key={k}
                      className={cx(classes.colorBox, { [classes.activeColorBox]: strokeColor === COLORS[k] })}
                      style={{ backgroundColor: COLORS[k] }}
                      onClick={() => changeStroke(activeToolItem, COLORS[k])}
                    />
                  ))}
                </div>
              </div>
            )}
            {hasFill && (
              <div className={classes.selectOptionContainer}>
                <div className={classes.toolBoxLabel}>Fill</div>
                <div className={classes.colorsContainer}>
                  {fillColor === null ? (
                    <div
                      className={cx(classes.colorPicker, classes.noFillColorBox, classes.activeColorBox)}
                      onClick={() => changeFill(activeToolItem, COLORS.BLACK)}
                    />
                  ) : (
                    <input
                      className={classes.colorPicker}
                      type="color"
                      value={fillColor}
                      onChange={(e) => changeFill(activeToolItem, e.target.value)}
                    />
                  )}
                  <div
                    className={cx(classes.colorBox, classes.noFillColorBox, { [classes.activeColorBox]: fillColor === null })}
                    onClick={() => changeFill(activeToolItem, null)}
                  />
                  {Object.keys(COLORS).map((k) => (
                    <div
                      key={k}
                      className={cx(classes.colorBox, { [classes.activeColorBox]: fillColor === COLORS[k] })}
                      style={{ backgroundColor: COLORS[k] }}
                      onClick={() => changeFill(activeToolItem, COLORS[k])}
                    />
                  ))}
                </div>
              </div>
            )}
            {hasSize && (
              <div className={classes.selectOptionContainer}>
                <div className={classes.toolBoxLabel}>
                  {activeToolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}
                  <span className="ml-2 font-normal text-slate-400 dark:text-zinc-500 normal-case">{size}</span>
                </div>
                <input
                  type="range"
                  min={activeToolItem === TOOL_ITEMS.TEXT ? 12 : 1}
                  max={activeToolItem === TOOL_ITEMS.TEXT ? 64 : 10}
                  step={1}
                  value={size}
                  className="w-full"
                  onChange={(e) => changeSize(activeToolItem, Number(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbox;