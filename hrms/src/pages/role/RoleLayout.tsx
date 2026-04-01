import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function RoleLayout(){
     return (
    <Box>
      <Outlet />
    </Box>
  );
}