import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function ChartLayout(){
     return (
    <Box>
      <Outlet />
    </Box>
  );
}