import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPlans, type TravelPlanResponse } from "../../api/travel.api";
import { toast } from "react-toastify";

export default function ExpenseTravelPlanList(){
    const navigate = useNavigate();
        const [travelPlans, setTravelPlans] = useState<TravelPlanResponse[] | null>(null);
    
        useEffect(() => {
             getAllPlans()
                        .then((data) => {
                            setTravelPlans(data);
                        })
                        .catch(() => toast.error("Failed to load travel plans"))
        },[]);

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
                        <Button onClick={() => navigate(`/dashboard/expense/travel/${travel.travelPlanId}`)} variant="contained">
                            View Details
                        </Button>
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