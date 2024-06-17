import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import MmsIcon from '@mui/icons-material/Mms';
import MicIcon from '@mui/icons-material/Mic';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
type Props = {
  setType:React.Dispatch<React.SetStateAction<string>>;
}
const actions = [
  { icon: <MmsIcon />, name: 'Send Media',type:"media" },
  { icon: <MicIcon />, name: 'Record Audio',type:"audio" },
  { icon: <CameraAltIcon />, name: 'Open Camera',type:"camera" },
  { icon: <PermContactCalendarIcon />, name: 'Share Contact',type:"contacts" },
];

export default function ControlledOpenSpeedDial({setType}:Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleUpdate = (type:string) => {
    setType(type)
    setOpen(false)
  }
  const handleClose = () => setOpen(false);
  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ position: 'absolute', bottom: 16, right: 16,zIndex:3 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={()=>handleUpdate(action.type)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}