import React, { useContext } from "react";
import classes from "./index.module.css";
import cx from "classnames";
import {
  FaSlash,
  FaRegCircle,
  FaArrowRight,
  FaPaintBrush,
  FaEraser,
  FaUndoAlt,
  FaRedoAlt,
  FaFont,
  FaDownload,
} from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import { TOOL_ITEMS } from "../../constants";
import boardContext from "../../store/board-context";
import ThemeToggle from "../ThemeToggle";

const Toolbar = () => {
  const { activeToolItem, changeToolHandler, undo, redo } = useContext(boardContext);

  const handleDownloadClick = () => {
    const canvas = document.getElementById("canvas");
    const data = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "synccanvas.png";
    anchor.click();
  };

  const drawingTools = [
    { item: TOOL_ITEMS.BRUSH, icon: <FaPaintBrush />, title: "Brush (B)" },
    { item: TOOL_ITEMS.LINE, icon: <FaSlash />, title: "Line (L)" },
    { item: TOOL_ITEMS.RECTANGLE, icon: <LuRectangleHorizontal />, title: "Rectangle (R)" },
    { item: TOOL_ITEMS.CIRCLE, icon: <FaRegCircle />, title: "Circle (C)" },
    { item: TOOL_ITEMS.ARROW, icon: <FaArrowRight />, title: "Arrow (A)" },
    { item: TOOL_ITEMS.ERASER, icon: <FaEraser />, title: "Eraser (E)" },
    { item: TOOL_ITEMS.TEXT, icon: <FaFont />, title: "Text (T)" },
  ];

  return (
    <div
      className={classes.container}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drawing Tools */}
      {drawingTools.map(({ item, icon, title }) => (
        <div
          key={item}
          className={cx(classes.toolItem, { [classes.active]: activeToolItem === item })}
          onClick={() => changeToolHandler(item)}
          title={title}
        >
          {icon}
        </div>
      ))}

      {/* Divider */}
      <div className={classes.divider} />

      {/* Action Tools */}
      <div className={classes.toolItem} onClick={undo} title="Undo (Ctrl+Z)">
        <FaUndoAlt />
      </div>
      <div className={classes.toolItem} onClick={redo} title="Redo (Ctrl+Y)">
        <FaRedoAlt />
      </div>

      {/* Divider */}
      <div className={classes.divider} />

      <div className={classes.toolItem} onClick={handleDownloadClick} title="Download as PNG">
        <FaDownload />
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
};

export default Toolbar;
