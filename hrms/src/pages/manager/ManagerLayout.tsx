import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function ManagerLayout(){
     return (
    <Box>
      <Outlet />
    </Box>
  );
}