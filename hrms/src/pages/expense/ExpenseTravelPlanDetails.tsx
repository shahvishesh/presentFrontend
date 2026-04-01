import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTravelParticipants, getTravelPlanByid, type TravelPlanResponse } from "../../api/travel.api";
import { toast } from "react-toastify";
import type { EmployeeResponse } from "../../api/employee.api";
import { Box, Button, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { getTotalApprovedAmountByTravelPlanByHr, getTotalClaimedAmountByTravelPlanByHr } from "../../api/expense.api";
import {
    dataTableActionsStackSx,
    dataTableContainerSx,
    dataTableEmptyStateCellSx,
    dataTableHeadRowSx,
    dataTablePrimaryCellSx,
} from "../../components/table/tableStyles";
import {
    pageContentPaperSx,
    pageDividerSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
    pageSectionPaperSx,
} from "../../components/page/pageStyles";

export default function ExpenseTravelPlanDetails(){
     const navigate = useNavigate();
        const [travelPlan, setTravelPlan] = useState<TravelPlanResponse | null>(null);
        const[employees, setEmployees] = useState<EmployeeResponse[]>([]);
        const { travelPlanId } = useParams();
        const travelPlanIdNum = Number(travelPlanId);

        const [claimedExpense, setClaimedExpense] = useState(0);
        const [approvedExpense, setApprovedExpense] = useState(0);
    
        useEffect(() => {
             getTravelPlanByid(travelPlanIdNum)
                        .then((data) => {
                            setTravelPlan(data);
                        })
                        .catch(() => toast.error("Failed to load plan"))
        },[]);

        useEffect(() => {
             getTravelParticipants(travelPlanIdNum)
                        .then((data) => {
                            setEmployees(data);
                        })
                        .catch(() => toast.error("Failed to load participants"))
        },[]);

        useEffect(() => {
            getTotalClaimedAmountByTravelPlanByHr(travelPlanIdNum)
                .then((data) => setClaimedExpense(data))
        })

         useEffect(() => {
            getTotalApprovedAmountByTravelPlanByHr(travelPlanIdNum)
                .then((data) => setApprovedExpense(data))
        })

        return(
            <Box sx={pageRootSx}>
               <Paper variant="outlined" sx={pageHeaderPaperSx}>
                                   <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                                       <Stack spacing={0.25}>
                                           <Typography variant="h5" sx={pageHeaderTitleSx}>
                                               Verify Expenses
                                           </Typography>
                                           <Typography variant="body2" color="text.secondary">
                                               Verify expenses for this travel plan.
                                           </Typography>
                                       </Stack>
                                   </Stack>
                               </Paper>
                               {travelPlan && (
                                                   <Paper variant="outlined" sx={{
                                                       p: { xs: 2, sm: 2.5 },
                                                       overflow: "hidden",
                                                       borderTop:0,
                                                       borderRadius:0,
                                                       borderBottomLeftRadius: 7,
                                                       borderBottomRightRadius: 7,
                                                       mb: 2
                                                   }}>
                                                     <Typography variant="h6">
                                                       {travelPlan.title}
                                                     </Typography>
                                                     <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                       {travelPlan.description}
                                                     </Typography>
                                                     <Divider sx={pageDividerSx} />
                                           
                                                     <Stack spacing={0.5}>
                                                       <Typography variant="body1">
                                                         Period: {travelPlan.startDate} to {travelPlan.endDate}
                                                       </Typography>
                                                       <Typography variant="body1">
                                                         From: {travelPlan.sourceLocation}
                                                       </Typography>
                                                       <Typography variant="body1">
                                                         To: {travelPlan.destinationLocation}
                                                       </Typography>
                                                     </Stack>
                                                   </Paper>
                                    )}

                <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{mb:2}}>
                    <Paper variant="outlined" sx={{ ...pageSectionPaperSx, mb: 0, flex: 1 }}>
                        <Typography variant="h6">Total Claimed Expense</Typography>
                        <Divider sx={pageDividerSx} />
                        <Typography>Rs.{claimedExpense}</Typography>
                    </Paper>

                    <Paper variant="outlined" sx={{ ...pageSectionPaperSx, mb: 0, flex: 1 }}>
                        <Typography variant="h6">Total Approved Expense</Typography>
                        <Divider sx={pageDividerSx} />
                        <Typography>Rs.{approvedExpense}</Typography>
                    </Paper>
                </Stack>


                <Paper variant="outlined" sx={{ ...pageHeaderPaperSx, pb: { xs: 2, sm: 2.5 } }}>
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Participants
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            View expenses for each participant.
                        </Typography>
                    </Stack>
                </Paper>

                <Paper variant="outlined" sx={pageContentPaperSx}>
                    <TableContainer component={Box} sx={dataTableContainerSx}>
                        <Table aria-label="participants table">
                            <TableHead>
                                <TableRow sx={dataTableHeadRowSx}>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Designation</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {employees?.map((employee) => (
                                    <TableRow key={employee.id} hover>
                                        <TableCell sx={dataTablePrimaryCellSx}>
                                            {employee.firstName} {employee.lastName}
                                        </TableCell>
                                        <TableCell>{employee.designation}</TableCell>
                                        <TableCell>{employee.department}</TableCell>

                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                                                <Button
                                                    onClick={() =>
                                                        navigate(
                                                            `/dashboard/expense/travel/${travelPlanIdNum}/${employee.id}/expenses`
                                                        )
                                                    }
                                                    variant="contained"
                                                    size="small"
                                                >
                                                    View Expenses
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {employees?.length === 0 && (
                                    <TableRow key="no-employees">
                                        <TableCell
                                            colSpan={4}
                                            align="center"
                                            sx={dataTableEmptyStateCellSx}
                                        >
                                            No employees found
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