import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function EmployeeTravelLayout(){
     return (
    <Box>

      <Outlet />
    </Box>
  );
}