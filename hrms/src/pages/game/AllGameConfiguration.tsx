import { useEffect, useState } from "react"
import { deleteSlotConfiguration, getGameConfiguration, type GameConfigResponse } from "../../api/slot.api"
import { toast } from "react-toastify";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AllGameConfiguration(){
    const [configs, setConfigs] = useState<GameConfigResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getGameConfiguration()
        .then((data) => setConfigs(data))
        .catch(() => toast.error("Cannot load configuration"));
    },[]);

    const handleDelete = async (configId: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this configuration?");
                  if (!confirmDelete) return;
                
                  try {
                    await deleteSlotConfiguration(configId);
                
                    setConfigs((prev) => prev.filter((config) => config.id !== configId));
                
                    toast.success("Configuration deleted");
                  } catch {
                    toast.error("Failed to delete configuration");
                  }
    }

    return(
        <>
        <Box>
            <Button sx={{my:2}} variant="outlined" onClick={() =>navigate(-1)}>
                Back
            </Button>

            <TableContainer component={Paper}>
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Operating Time</TableCell>
                    <TableCell>Maximum players</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {configs?.map((config) => (
                    <TableRow key={config.id}>
                        <TableCell>{config.gameName}</TableCell>
                        <TableCell>{config.startTime} - {config.endTime}</TableCell>
                        <TableCell>{config.maxPlayers}</TableCell>
                        <TableCell>{config.slotDuration}</TableCell>
                        <TableCell align="center">
                        <Button onClick={() => navigate(`/dashboard/game/configure/update/${config.id}`)} variant="contained">
                            Update
                        </Button>
                        <Button onClick={() => handleDelete(config.id)} variant="contained">
                            Delete
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}

                    {configs?.length === 0 && (
                    <TableRow key="no-configs">
                        <TableCell colSpan={6} align="center">
                        No configurations found
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </TableContainer>
        </Box>
        </>
    )
}