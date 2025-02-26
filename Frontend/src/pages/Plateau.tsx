import { useState, useRef, MouseEvent, WheelEvent, useEffect } from "react";
import Archer_img from "./../assets/archer.jpg";
import map_jpg from "./../assets/map.jpg";
import CircularMenu from "../components/CircularMenu";
import Toolbar  from "../components/Toolbar";

interface Token {
  id: string;
  position: { x: number; y: number };
  image: HTMLImageElement;
}

interface DragData {
  isDragging: boolean;
  startX: number;
  startY: number;
  initX: number;
  initY: number;
  tokenId?: string | null;
}

const GRID_SIZE = 24;
const CELL_SIZE = 70;

export default function Plateau(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isMapMoveEnabled, setIsMapMoveEnabled] = useState(true);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [isPressing, setIsPressing] = useState(false);
  const [isSnapToGridEnabled, setIsSnapToGridEnabled] = useState(true); 

  const dragData = useRef<DragData>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    tokenId: null
  });

  // Initialize images and tokens
  useEffect(() => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    };

    const initImages = async () => {
      const [archerImg, mapImg] = await Promise.all([
        loadImage(Archer_img),
        loadImage(map_jpg),
      ]);
      
      setBackgroundImage(mapImg);
      setTokens([
        { id: '1', position: { x: 0, y: 0 }, image: archerImg },
        { id: '2', position: { x: 70, y: 0 }, image: archerImg }
      ]);
    };

    initImages();
  }, []);

 const renderCanvas = () => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply viewport transformation
  ctx.save();
  ctx.translate(offset.x, offset.y);
  ctx.scale(zoom, zoom);

  // Calculate grid dimensions
  const gridWidth = GRID_SIZE * CELL_SIZE;
  const gridHeight = GRID_SIZE * CELL_SIZE;

  // Draw background - cover entire grid including rightmost/bottom cells
  if (backgroundImage) {
    ctx.drawImage(backgroundImage, 0, 0, gridWidth, gridHeight);
  }

  // Draw grid (only if enabled)
  if (isSnapToGridEnabled) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.68)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]); // Définit un style pointillé (5px trait, 5px espace)

    for (let i = 0; i <= GRID_SIZE; i++) {
      // Lignes verticales
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, gridHeight);
      
      // Lignes horizontales
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(gridWidth, i * CELL_SIZE);
    }

    ctx.stroke();
    ctx.setLineDash([]); // Réinitialiser pour éviter d'affecter d'autres dessins
  }

  // Draw cell hover effects
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  // Draw tokens
  tokens.forEach((token) => {
    ctx.save();
    ctx.beginPath();
    const centerX = token.position.x + CELL_SIZE / 2;
    const centerY = token.position.y + CELL_SIZE / 2;
    ctx.arc(centerX, centerY, CELL_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(token.image, token.position.x, token.position.y, CELL_SIZE, CELL_SIZE);

    if (token.id === selectedTokenId) {
      ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();
  });

  ctx.restore();
};


  useEffect(() => {
    renderCanvas();
  }, [offset, zoom, tokens, selectedTokenId, backgroundImage, isSnapToGridEnabled]);

  // Fonction pour convertir les coordonnées de l'écran en coordonnées du monde
const screenToWorldCoordinates = (screenX: number, screenY: number): { x: number, y: number } => {
  if (!canvasRef.current) return { x: 0, y: 0 };
  
  const rect = canvasRef.current.getBoundingClientRect();
  const scaleX = canvasRef.current.width / rect.width;
  const scaleY = canvasRef.current.height / rect.height;
  
  return {
    x: ((screenX - rect.left) * scaleX - offset.x) / zoom,
    y: ((screenY - rect.top) * scaleY - offset.y) / zoom
  };
};
  useEffect(() => {
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
  if (!dragData.current.isDragging) return;

  if (isMapMoveEnabled) {
    const dx = e.clientX - dragData.current.startX;
    const dy = e.clientY - dragData.current.startY;
    setOffset({ x: dragData.current.initX + dx, y: dragData.current.initY + dy });
  } else if (dragData.current.tokenId) {
    // Convertir les coordonnées écran -> monde
    const worldCoords = screenToWorldCoordinates(e.clientX, e.clientY);
    let cellX, cellY, boundedCellX, boundedCellY;

    if (isSnapToGridEnabled) {
      // Snap to grid
      cellX = Math.floor(worldCoords.x / CELL_SIZE);
      cellY = Math.floor(worldCoords.y / CELL_SIZE);

      // Contraindre aux limites de la grille
      boundedCellX = Math.max(0, Math.min((GRID_SIZE - 1), cellX));
      boundedCellY = Math.max(0, Math.min((GRID_SIZE - 1), cellY));
    } else {
      // Si snap désactivé, utiliser les coordonnées brutes avec limites
      boundedCellX = Math.max(0, Math.min((GRID_SIZE - 1), worldCoords.x / CELL_SIZE));
      boundedCellY = Math.max(0, Math.min((GRID_SIZE - 1), worldCoords.y / CELL_SIZE));
    }

    // Mettre à jour la position du token
    setTokens(prevTokens =>
      prevTokens.map(token =>
        token.id === dragData.current.tokenId
          ? {
              ...token,
              position: {
                x: boundedCellX * CELL_SIZE,
                y: boundedCellY * CELL_SIZE
              }
            }
          : token
      )
    );
  }
};


    const handleGlobalMouseUp = () => {
      dragData.current.isDragging = false;
      dragData.current.tokenId = null;
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isMapMoveEnabled, offset, zoom]);

const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  // Convertir les coordonnées de la souris en coordonnées du monde
  const worldCoords = screenToWorldCoordinates(e.clientX, e.clientY);
  const x = worldCoords.x;
  const y = worldCoords.y;

  if (isMapMoveEnabled) {
    dragData.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initX: offset.x,
      initY: offset.y,
    };
  } else {
    let clickedToken: Token | undefined;

    for (let i = tokens.length - 1; i >= 0; i--) {
      const token = tokens[i];
      const tokenCenterX = token.position.x + CELL_SIZE / 2;
      const tokenCenterY = token.position.y + CELL_SIZE / 2;

      // Calculer la distance dans les coordonnées du monde
      const distance = Math.sqrt(
        Math.pow(x - tokenCenterX, 2) + 
        Math.pow(y - tokenCenterY, 2)
      );

      // Le rayon de hit est constant dans les coordonnées du monde
      const hitRadius = CELL_SIZE / 2;

      if (distance < hitRadius) {
        clickedToken = token;
        break;
      }
    }

    if (clickedToken) {
      setSelectedTokenId(clickedToken.id);
      dragData.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        initX: offset.x,
        initY: offset.y,
        tokenId: clickedToken.id,
      };
    } else {
      setSelectedTokenId(null);
    }
  }
};


  
  const handleWheel = (e: WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const x = (mouseX - offset.x) / zoom;
    const y = (mouseY - offset.y) / zoom;
    
    const newZoom = Math.min(Math.max(zoom + (e.deltaY < 0 ? 0.1 : -0.1), 0.4), 2);
    
    setZoom(newZoom);
    setOffset({
      x: mouseX - x * newZoom,
      y: mouseY - y * newZoom
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setBackgroundImage(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewToken = async () => {
    const archerImg = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = Archer_img;
    });

    // Find first available empty cell
    const occupied = new Set(tokens.map(t => `${t.position.x},${t.position.y}`));
    let newX = 0, newY = 0;
    
    outerLoop:
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const key = `${x * CELL_SIZE},${y * CELL_SIZE}`;
        if (!occupied.has(key)) {
          newX = x * CELL_SIZE;
          newY = y * CELL_SIZE;
          break outerLoop;
        }
      }
    }

    setTokens(prev => [...prev, {
      id: `token-${prev.length + 1}`,
      position: { x: newX, y: newY },
      image: archerImg
    }]);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
     if (e.code === "Space" && !isPressing) {
      setIsPressing(true);
      setIsMapMoveEnabled(true);
    }
    
  };
  
  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Space" && isPressing) {
      setIsPressing(false);
      setIsMapMoveEnabled(false);

    }
  };


  return (
    <div 
        className="min-h-screen flex flex-col items-center justify-center"
        tabIndex={0}
        onKeyDown={(e)=>handleKeyDown(e)}
        onKeyUp={(e)=>handleKeyUp(e)}
        >
         <Toolbar 
            onZoomIn={() => setZoom(Math.min(zoom + 0.2, 2))}
            onZoomOut={() => setZoom(Math.max(zoom - 0.2, 0.5))}
            onToggleGrid={() => setIsSnapToGridEnabled((prev) => !prev)}
            isGridEnabled={isSnapToGridEnabled}  // Ajoutez cette prop
          />


      <CircularMenu 
        isMapMoveEnabled={isMapMoveEnabled}
        setIsMapMoveEnabled={setIsMapMoveEnabled}
        handleZoomIn={() => setZoom(Math.min(zoom + 0.2, 2))}
        handleZoomOut={() => setZoom(Math.max(zoom - 0.2, 0.5))}
        addNewToken={addNewToken}
        handleUploadClick={() => fileInputRef.current?.click()}
        fileInputRef={fileInputRef}

      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <div
        ref={containerRef}
        className="relative w-[100vw] h-[calc(100vh-0rem)] overflow-hidden border-2 border-gray-800 bg-[rgb(23,23,23)]"
      >
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight - 64}
          className={`w-full h-full ${
            isMapMoveEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
          }`}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
        />
      </div>
    </div>
  );
}