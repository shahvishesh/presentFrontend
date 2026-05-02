import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function JobLayout(){
     return (
    <Box>
      <Outlet />
    </Box>
  );
}