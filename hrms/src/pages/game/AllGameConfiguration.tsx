import { useEffect, useState } from "react"
import { deleteSlotConfiguration, getGameConfiguration, type GameConfigResponse } from "../../api/slot.api"
import { toast } from "react-toastify";
import { Box, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    dataTableActionsStackSx,
    dataTableContainerSx,
    dataTableEmptyStateCellSx,
    dataTableHeadRowSx,
    dataTablePrimaryCellSx,
} from "../../components/table/tableStyles";
import {
    pageContentPaperSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

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
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={pageHeaderStackSx}
                >
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Game Configuration
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage configurations for games.
                        </Typography>
                    </Stack>

                    {/* <Button variant="outlined" onClick={() => navigate(-1)}>
                        Back
                    </Button> */}
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={pageContentPaperSx}>
                <TableContainer component={Box} sx={dataTableContainerSx}>
                    <Table aria-label="game configurations table">
                    <TableHead>
                        <TableRow sx={dataTableHeadRowSx}>
                        <TableCell>Name</TableCell>
                        <TableCell>Operating Time</TableCell>
                        <TableCell>Maximum players</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {configs?.map((config) => (
                        <TableRow key={config.id} hover>
                            <TableCell sx={dataTablePrimaryCellSx}>{config.gameName}</TableCell>
                            <TableCell>{config.startTime} - {config.endTime}</TableCell>
                            <TableCell>{config.maxPlayers}</TableCell>
                            <TableCell>{config.slotDuration}</TableCell>
                            <TableCell align="center">
                                <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                                    <Tooltip title="Update">
                                        <IconButton
                                            color="secondary"
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/dashboard/game/configure/update/${config.id}?gameName=${encodeURIComponent(config.gameName)}`
                                                )
                                            }
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => handleDelete(config.id)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                        </TableRow>
                        ))}

                        {configs?.length === 0 && (
                        <TableRow key="no-configs">
                            <TableCell colSpan={5} align="center" sx={dataTableEmptyStateCellSx}>
                            No configurations found
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>

    )
}