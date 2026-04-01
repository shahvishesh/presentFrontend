import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeTravelPlans, type TravelPlanResponse } from "../../api/travel.api";
import { toast } from "react-toastify";

export default function EEmployeeTravelPlanList(){
    const navigate = useNavigate();
        const [travelPlans, setTravelPlans] = useState<TravelPlanResponse[] | null>(null);
    
        useEffect(() => {
             getEmployeeTravelPlans()
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
                        <TableCell>{travel.sourceLocation}</TableCell>
                        <TableCell>{travel.destinationLocation}</TableCell>

                        <TableCell align="center">
                        <Button onClick={() => navigate(`/dashboard/Etravel/expense/${travel.travelPlanId}`)} variant="contained">
                            Submit Expense
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