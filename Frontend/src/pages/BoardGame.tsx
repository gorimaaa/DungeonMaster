import React, { useRef, useState } from "react";

const BoardGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tokens, setTokens] = useState<{ x: number; y: number }[]>([
    { x: 100, y: 100 },
  ]);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const { offsetX, offsetY, deltaY } = e.nativeEvent;
    const zoomFactor = 1.1;
    const newScale = deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;

    const mouseX = (offsetX - offset.x) / scale;
    const mouseY = (offsetY - offset.y) / scale;

    const newOffsetX = offsetX - mouseX * newScale;
    const newOffsetY = offsetY - mouseY * newScale;

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTokenDrag = (index: number, e: React.MouseEvent) => {
    const newTokens = [...tokens];
    newTokens[index] = {
      x: (e.clientX - offset.x) / scale,
      y: (e.clientY - offset.y) / scale,
    };
    setTokens(newTokens);
  };

  return (
    <div
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          backgroundColor: "lightgray",
          cursor: dragging ? "grabbing" : "grab",
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "top left",
        }}
        onMouseDown={handleMouseDown}
      />
      {tokens.map((token, index) => (
        <div
          key={index}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => handleTokenDrag(index, e)}
          style={{
            position: "absolute",
            left: `${token.x * scale + offset.x}px`,
            top: `${token.y * scale + offset.y}px`,
            width: "20px",
            height: "20px",
            backgroundColor: "red",
            borderRadius: "50%",
            cursor: "pointer",
            transform: `scale(${scale})`,
          }}
        />
      ))}
    </div>
  );
};

export default BoardGame;
