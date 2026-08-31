import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import socket from "../../utils/socket";

import classes from "./index.module.css";

import {
  getSvgPathFromStroke,
} from "../../utils/element";
import getStroke from "perfect-freehand";
import axios from "axios";


function Board({ id }) {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  console.log(id)

  const {
    activeToolItem,
    elements,
    toolActionType,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo,
    redo,
    setCanvasId,
    setElements,
    setHistory
  } = useContext(boardContext);
  const { toolboxState } = useContext(toolboxContext);

  const token = localStorage.getItem("whiteboard_user_token");

  const [isAuthorized, setIsAuthorized] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    if (id) {
      // Ensure socket uses the latest token
      const currentToken = localStorage.getItem("whiteboard_user_token");
      if (currentToken) {
        socket.io.opts.extraHeaders = {
          Authorization: `Bearer ${currentToken}`
        };
        if (!socket.connected) {
          socket.connect();
        } else {
          socket.disconnect().connect();
        }
      }

      // Join the canvas room (no need for userId)
      socket.emit("joinCanvas", { canvasId: id });

      // Listen for updates from other users
      socket.on("receiveDrawingUpdate", (updatedElements) => {
        setElements(updatedElements);
      });

      // Load initial canvas data
      socket.on("loadCanvas", (initialElements) => {
        setElements(initialElements);
      });

      socket.on("unauthorized", (data) => {
        console.log(data.message);
        alert("Access Denied: You cannot edit this canvas.");
        setIsAuthorized(false);
      });

      return () => {
        socket.off("receiveDrawingUpdate");
        socket.off("loadCanvas");
        socket.off("unauthorized");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const fetchCanvasData = async () => {
      if (!id) return;
      try {
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/canvas/load/${id}`,
          config
        );
        setCanvasId(id); // Set the current canvas ID
        setElements(response.data.elements || []); // Set the fetched elements
        setHistory(response.data.elements || []); // Set the fetched elements
      } catch (error) {
        console.error("Error loading canvas:", error);
      }
    };

    fetchCanvasData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(element.roughEle);
          break;
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = element.stroke;
          const path = new Path2D(
            getSvgPathFromStroke(getStroke(element.points, { size: element.size }))
          );
          context.fill(path);
          context.restore();
          break;
        case TOOL_ITEMS.TEXT:
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          if (element.text) {
            const lines = element.text.split('\n');
            lines.forEach((line, i) => {
              // Use line-height of 1.2 * size
              context.fillText(line, element.x1, element.y1 + i * (element.size * 1.2));
            });
          }
          context.restore();
          break;
        default:
          throw new Error("Type not recognized");
      }
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements, windowSize]);


  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);

  // console.log("Elements ",elements);

  const handleMouseDown = (event) => {
    if (!isAuthorized) return;
    boardMouseDownHandler(event, toolboxState);
  };

  const handleMouseMove = (event) => {
    if (!isAuthorized) return;
    boardMouseMoveHandler(event);
    socket.emit("drawingUpdate", { canvasId: id, elements });
  };

  const handleMouseUp = () => {
    if (!isAuthorized) return;
    boardMouseUpHandler();
    socket.emit("drawingUpdate", { canvasId: id, elements });
  };

  return (
    <>
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur={(event) => textAreaBlurHandler(event.target.value)}
        />
      )}
      <canvas
        ref={canvasRef}
        id="canvas"
        width={windowSize.width}
        height={windowSize.height}
        className={
          activeToolItem === TOOL_ITEMS.ERASER
            ? classes.eraserCursor
            : activeToolItem === TOOL_ITEMS.TEXT
            ? "cursor-text"
            : "cursor-crosshair"
        }
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </>
  );
}

export default Board;
