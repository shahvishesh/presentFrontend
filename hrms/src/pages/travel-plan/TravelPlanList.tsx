import { Box, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTravelPlan, getAllPlans, type TravelPlanResponse } from "../../api/travel.api";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip } from "@mui/material";

export default function TravelPlanList(){
    const navigate = useNavigate();
        const [travelPlans, setTravelPlans] = useState<TravelPlanResponse[]>([]);
    
        useEffect(() => {
             getAllPlans()
                        .then((data) => {
                            setTravelPlans(data);
                        })
                        .catch(() => toast.error("Failed to load jobs"))
        },[]);

        const handleDelete = async (travelPlanId: number) => {
          const confirmDelete = window.confirm("Are you sure you want to delete this plan?");
          if (!confirmDelete) return;
        
          try {
            await deleteTravelPlan(travelPlanId);
        
            setTravelPlans((prev) => prev.filter((travelPlan) => travelPlan.travelPlanId !== travelPlanId));
        
            toast.success("Travel plan deleted");
          } catch {
            toast.error("Failed to delete plan");
          }
        };

    return (
         <Box>

            <TableContainer component={Paper}>
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {travelPlans?.map((travel) => (
                    <TableRow key={travel.travelPlanId}>
                        <TableCell>{travel.title}</TableCell>
                        <TableCell>{travel.startDate} - {travel.endDate}</TableCell>
                        <TableCell>{travel.status}</TableCell>
                        <TableCell>{travel.sourceLocation}</TableCell>
                        <TableCell>{travel.destinationLocation}</TableCell>

                        <TableCell align="center">
                           <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                                alignItems="center"
                                >
                                <Tooltip title="View Details">
                                    <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => navigate(`/dashboard/travel/${travel.travelPlanId}`)}
                                    >
                                    <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Update">
                                    <IconButton
                                    color="secondary"
                                    size="small"
                                    onClick={() => navigate(`/dashboard/travel/update/${travel.travelPlanId}`)}
                                    >
                                    <EditIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete">
                                    <IconButton
                                    color="error"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(travel.travelPlanId);
                                    }}
                                    >
                                    <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                                </Stack>
                        </TableCell>
                    </TableRow>
                    ))}

                    {travelPlans?.length === 0 && (
                    <TableRow key="no-jobs">
                        <TableCell colSpan={6} align="center">
                        No travel plans found
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </TableContainer>
      </Box>
    )
}