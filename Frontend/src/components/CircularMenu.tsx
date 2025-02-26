import React, { useState, ReactElement, RefObject } from 'react';
import { Zoom, Box, IconButton } from '@mui/material';
import { Map, ZoomIn, ZoomOut, Add, Image } from '@mui/icons-material';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';

interface CircularMenuProps {
  isMapMoveEnabled: boolean;
  setIsMapMoveEnabled: (value: boolean) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  addNewToken: () => void;
  handleUploadClick: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

const CircularMenu: React.FC<CircularMenuProps> = ({ 
  isMapMoveEnabled,
  setIsMapMoveEnabled,
  handleZoomIn,
  handleZoomOut,
  addNewToken,
  handleUploadClick,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIcon, setActiveIcon] = useState<ReactElement>(
     <Map className="text-white" /> 
  );

  const handleMainClick = (): void => {
    setIsOpen(!isOpen);
  };

  const handleSubButtonClick = (callback: () => void, icon: ReactElement): void => {
    setActiveIcon(icon);
    callback();
  };

  const buttonStyle = {
    borderRadius: '50%',
    backgroundColor: '#1F2937', 
    '&:hover': {
      backgroundColor: '#374151', 
    },
    color: 'white',
  };

  return (
    <Box className="fixed left-4 top-1/4 flex flex-col items-center gap-4 z-50">
      {/* Main Button */}
      <IconButton
        onClick={handleMainClick}
        className="w-16 h-16 shadow-lg"
        sx={{
          ...buttonStyle,
          transition: 'transform 0.2s',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
        }}
      >
        {activeIcon}
      </IconButton>

      {/* Sub Buttons Container */}
      <Box className="flex flex-col gap-2">
        <Zoom in={isOpen} style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}>
          <IconButton
            onClick={() => handleSubButtonClick(
              () => setIsMapMoveEnabled(!isMapMoveEnabled),
              <Map className="text-white" /> 
            )}
            className="w-12 h-12"
            sx={buttonStyle}
          >
            {!isMapMoveEnabled ? <Map /> : <PanToolAltIcon />}
          </IconButton>
        </Zoom>

        <Zoom in={isOpen} style={{ transitionDelay: isOpen ? '150ms' : '0ms' }}>
          <IconButton
            onClick={() => handleSubButtonClick(handleZoomIn, <ZoomIn className="text-white" />)}
            className="w-12 h-12"
            sx={buttonStyle}
          >
            <ZoomIn />
          </IconButton>
        </Zoom>

        <Zoom in={isOpen} style={{ transitionDelay: isOpen ? '200ms' : '0ms' }}>
          <IconButton
            onClick={() => handleSubButtonClick(handleZoomOut, <ZoomOut className="text-white" />)}
            className="w-12 h-12"
            sx={buttonStyle}
          >
            <ZoomOut />
          </IconButton>
        </Zoom>

        <Zoom in={isOpen} style={{ transitionDelay: isOpen ? '250ms' : '0ms' }}>
          <IconButton
            onClick={() => handleSubButtonClick(addNewToken, <Add className="text-white" />)}
            className="w-12 h-12"
            sx={buttonStyle}
          >
            <Add />
          </IconButton>
        </Zoom>

        <Zoom in={isOpen} style={{ transitionDelay: isOpen ? '300ms' : '0ms' }}>
          <IconButton
            onClick={() => handleSubButtonClick(handleUploadClick, <Image className="text-white" />)}
            className="w-12 h-12"
            sx={buttonStyle}
          >
            <Image />
          </IconButton>
        </Zoom>
      </Box>
    </Box>
  );
};

export default CircularMenu;