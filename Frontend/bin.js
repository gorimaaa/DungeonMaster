const { nativeSelectClasses } = require("@mui/material")

type of events : React.DragEvent<HTMLDivElement>



without mounting the token to the center of the cell
// import { useState, useRef } from "react";
// import Archer_img from "./../assets/archer.jpg";


// export default function Plateau() {
//   const gridSize = 4;
//   const [tokenPos, setTokenPos] = useState({ x: 0, y: 0 });
//   const boardRef = useRef<HTMLDivElement | null>(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const handleDrop = (event : React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     const board = boardRef.current?.getBoundingClientRect();
//     if (!board) return;

//     const cellSize = board.width / gridSize;
    
//     // Calculate position relative to the board
//     const relativeX = event.clientX - board.left;
//     const relativeY = event.clientY - board.top;
    
//     // Convert to absolute pixels within the board
//     const x = Math.min(Math.max(0, relativeX - 20), board.width - 40); // 20px offset for token center
//     const y = Math.min(Math.max(0, relativeY - 20), board.height - 40);
    
//     setTokenPos({ x, y });
//     setIsDragging(false);
//   };

//   const handleDragStart = () => {
//     setIsDragging(true);
//   };

//   const handleDragEnd = () => {
//     setIsDragging(false);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <h1 className="text-2xl font-bold mb-4">Plateau de Jeu - Drag & Drop</h1>
      
//       <div className="relative">
//         {/* Game board */}
//         <div 
//           ref={boardRef}
//           className="grid grid-cols-4 border border-gray-800 bg-white w-64 h-64" 
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={handleDrop}
//         >
//           {Array.from({ length: gridSize * gridSize }).map((_, index) => (
//             <div
//               key={index}
//               className="border border-gray-400 hover:bg-gray-200 transition-colors"
//             />
//           ))}
//         </div>

//         {/* Floating token */}
//         <div
//           draggable
//           className={`absolute w-10 h-10 bg-red-500 rounded-full cursor-grab 
//             hover:bg-red-600 transition-colors
//             ${isDragging ? 'opacity-50' : 'opacity-100'}`}
//           style={{
//             left: `${tokenPos.x}px`,
//             top: `${tokenPos.y}px`,
//             transform: 'translate(0, 0)',
//             touchAction: 'none'
//           }}
//           onDragStart={handleDragStart}
//           onDragEnd={handleDragEnd}
//         >
//         <img src={Archer_img} alt="" />
//         </div>
//       </div>

//     </div>
//   );
// }

so nativeSelectClassesimport { useState, useRef } from "react";
import Archer_img from "./../assets/archer.jpg";

export default function Plateau() {
  const gridSize = 38;
  const cellSize = 64; // Fixed cell size in pixels
  const [tokenPos, setTokenPos] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const board = boardRef.current?.getBoundingClientRect();
    if (!board) return;
    
    // Calculate position relative to the board
    const relativeX = event.clientX - board.left;
    const relativeY = event.clientY - board.top;
    
    // Calculate grid cell coordinates
    const cellX = Math.floor(relativeX / cellSize);
    const cellY = Math.floor(relativeY / cellSize);
    
    // Calculate center position of the cell
    const centerX = (cellX * cellSize) + (cellSize / 2) - 20; // 20px is half the token width
    const centerY = (cellY * cellSize) + (cellSize / 2) - 20; // 20px is half the token height
    
    // Ensure the position stays within bounds
    const boardWidth = cellSize * gridSize;
    const boardHeight = cellSize * gridSize;
    const x = Math.min(Math.max(0, centerX), boardWidth - 40);
    const y = Math.min(Math.max(0, centerY), boardHeight - 40);
    
    setTokenPos({ x, y });
    setIsDragging(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const boardStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
    width: `${cellSize * gridSize}px`,
    height: `${cellSize * gridSize}px`
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Plateau de Jeu - Drag & Drop</h1>
      
      <div className="relative">
        {/* Game board */}
        <div 
          ref={boardRef}
          className="border border-gray-800 bg-white"
          style={boardStyle}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-400 hover:bg-gray-200 transition-colors"
              style={{ width: cellSize, height: cellSize }}
            />
          ))}
        </div>

        {/* Floating token */}
        <div
          draggable
          className={`absolute w-10 h-10 cursor-grab 
            hover:opacity-80 transition-colors
            ${isDragging ? 'opacity-1000' : 'opacity-100'}`}
          style={{
            left: `${tokenPos.x}px`,
            top: `${tokenPos.y}px`,
            transform: 'translate(0, 0)',
            touchAction: 'none'
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <img src={Archer_img} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

mecanisme zoom 
import React, { useState, useRef, MouseEvent, WheelEvent } from "react";

interface Offset {
  x: number;
  y: number;
}

interface DragData {
  isDragging: boolean;
  startX: number;
  startY: number;
  initX: number;
  initY: number;
}

const GRID_SIZE = 28;
const CELL_SIZE = 64;

export default function Plateau(): JSX.Element {
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const dragData = useRef<DragData>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    dragData.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initX: offset.x,
      initY: offset.y,
    };
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!dragData.current.isDragging) return;
    const dx = e.clientX - dragData.current.startX;
    const dy = e.clientY - dragData.current.startY;
    setOffset({ x: dragData.current.initX + dx, y: dragData.current.initY + dy });
  };

  const endDrag = () => {
    dragData.current.isDragging = false;
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setZoom((prevZoom) => {
      const newZoom = prevZoom + (e.deltaY < 0 ? 0.1 : -0.1);
      return Math.min(Math.max(newZoom, 0.5), 2);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
        >
          Zoom +
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
        >
          Zoom -
        </button>
      </div>
      <div
        className="relative w-[1000px] h-[600px] overflow-hidden border-2 border-gray-800 bg-blue-200"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onWheel={handleWheel}
      >
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-400"
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}




// best working code

import React, { useState, useRef, MouseEvent, WheelEvent, DragEvent, ChangeEvent } from "react";
import Archer_img from "./../assets/archer.jpg";

interface Offset {
  x: number;
  y: number;
}

interface DragData {
  isDragging: boolean;
  startX: number;
  startY: number;
  initX: number;
  initY: number;
}

interface Position {
  x: number;
  y: number;
}

interface Token {
  id: string;
  position: Position;
  image: string;
}

const GRID_SIZE = 24;
const CELL_SIZE = 70;

export default function Plateau(): JSX.Element {
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1.5);
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const dragData = useRef<DragData>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  const [isMapMoveEnabled, setIsMapMoveEnabled] = useState<boolean>(true);
  const [tokens, setTokens] = useState<Token[]>([
    { id: '1', position: { x: 0, y: 0 }, image: Archer_img },
    { id: '2', position: { x: 70, y: 0 }, image: Archer_img },
  ]);
  const [draggedTokenId, setDraggedTokenId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour gérer l'upload d'image
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger le file input
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Les autres fonctions restent les mêmes...
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!isMapMoveEnabled) return;
    dragData.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initX: offset.x,
      initY: offset.y,
    };
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isMapMoveEnabled || !dragData.current.isDragging) return;
    const dx = e.clientX - dragData.current.startX;
    const dy = e.clientY - dragData.current.startY;
    setOffset({ x: dragData.current.initX + dx, y: dragData.current.initY + dy });
  };

  const endDrag = () => {
    if (!isMapMoveEnabled) return;
    dragData.current.isDragging = false;
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setZoom((prevZoom) => {
      const newZoom = prevZoom + (e.deltaY < 0 ? 0.1 : -0.1);
      return Math.min(Math.max(newZoom, 0.4), 2);
    });
  };



  const handleTokenDragStart = (e: DragEvent<HTMLDivElement>, tokenId: string) => {
    e.stopPropagation();
    setDraggedTokenId(tokenId);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isMapMoveEnabled || !boardRef.current || !draggedTokenId) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - boardRect.left) / zoom;
    const relativeY = (e.clientY - boardRect.top) / zoom;
    const cellX = Math.floor(relativeX / CELL_SIZE);
    const cellY = Math.floor(relativeY / CELL_SIZE);
    const centerX = cellX * CELL_SIZE + CELL_SIZE / 2 - 20;
    const centerY = cellY * CELL_SIZE + CELL_SIZE / 2 - 20;

    setTokens(prevTokens => 
      prevTokens.map(token => 
        token.id === draggedTokenId 
          ? { ...token, position: { x: centerX, y: centerY } }
          : token
      )
    );
    setDraggedTokenId(null);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));

  const addNewToken = () => {
    const newToken: Token = {
      id: `token-${tokens.length + 1}`,
      position: { x: 0, y: 0 },
      image: Archer_img
    };
    setTokens([...tokens, newToken]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
     

     <div className="fixed left-4 top-1/4 flex flex-col gap-4 z-50 bg-white p-2 shadow-lg rounded">
  <button
    onClick={() => setIsMapMoveEnabled((prev) => !prev)}
    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
  >
    {isMapMoveEnabled ? "Désactiver déplacement" : "Activer déplacement"}
  </button>
  {/* <button onClick={handleZoomIn} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Zoom +
  </button> */}
  {/* <button onClick={handleZoomOut} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Zoom -
  </button> */}
  <button onClick={addNewToken} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
    Ajouter Token
  </button>
  <button onClick={handleUploadClick} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
    Changer Image de Fond
  </button>
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleImageUpload}
    accept="image/*"
    className="hidden"
  />
</div>

      <div
        className="relative w-[100vw] h-[calc(100vh-0rem)] overflow-hidden border-2 border-gray-800 bg-gray-100"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onWheel={handleWheel}
      >

        {/* // Le plateau de jeu */}
        <div
          ref={boardRef}
          className="border border-gray-100"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            position: "relative",
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* Grille semi-transparente */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div
          key={i}
          className="border border-gray-700 border-dotted hover:bg-gray-200 hover:bg-opacity-30 transition-colors"
          style={{ 
            width: CELL_SIZE, 
            height: CELL_SIZE,
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}
        />
        
          ))}

          {/* {!isMapMoveEnabled && tokens.map(token => ( */}
          {tokens.map(token => (
            <div
              key={token.id}
              draggable
              className={`absolute w-10 h-10 cursor-grab hover:opacity-80 transition-colors ${
                draggedTokenId === token.id ? "opacity-50" : "opacity-100"
              }`}
              style={{ 
                left: `${token.position.x}px`, 
                top: `${token.position.y}px`, 
                touchAction: "none" 
              }}
              onDragStart={(e) => handleTokenDragStart(e, token.id)}
            >
              <img src={token.image} alt="Token" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}