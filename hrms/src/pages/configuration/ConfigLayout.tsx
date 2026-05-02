import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function ConfigLayout(){
     return (
    <Box>
      <Outlet />
    </Box>
  );
}