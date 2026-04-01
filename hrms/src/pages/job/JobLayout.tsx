import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function JobLayout(){
     return (
    <Box>
      <Typography variant="h5" mb={3}>
        Jobs
      </Typography>
      <Outlet />
    </Box>
  );
}