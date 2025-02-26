import { IconButton, Tooltip } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import GridOnIcon from "@mui/icons-material/GridOn";
import SettingsIcon from "@mui/icons-material/Settings";

type ToolbarProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  isGridEnabled: boolean; 
};

const Toolbar: React.FC<ToolbarProps> = ({ onZoomIn, onZoomOut, onToggleGrid, isGridEnabled   }) => {
  return (
    <div className="fixed top-4 right-4 z-50 top-1/4 bg-gray-800 bg-opacity-100 shadow-lg rounded-xl p-2 flex flex-col space-y-2">
      <Tooltip title="Zoom avant">
        <IconButton onClick={onZoomIn} sx={{ color: "white", "&:hover": { color: "#D1D5DB" } }}>
          <ZoomInIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Zoom arrière">
        <IconButton onClick={onZoomOut} sx={{ color: "white", "&:hover": { color: "#D1D5DB" } }}>
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>


      <Tooltip title="Activer/Désactiver la grille">

        <IconButton 
          onClick={onToggleGrid} 
          sx={{ 
            color: isGridEnabled ? "primary.main" : "white",
            "&:hover": { color: isGridEnabled ? "primary.light" : "#D1D5DB" }
          }}
        >
          <GridOnIcon />
        </IconButton>
      </Tooltip>


      <Tooltip title="Paramètres">
        <IconButton sx={{ color: "white", "&:hover": { color: "#D1D5DB" } }}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      
    </div>
  );
};

export default Toolbar;
