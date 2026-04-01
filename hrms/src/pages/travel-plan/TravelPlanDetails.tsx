import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTravelParticipants, getTravelPlanByid, type TravelPlanResponse } from "../../api/travel.api";
import { toast } from "react-toastify";
import type { EmployeeResponse } from "../../api/employee.api";
import {
    Box,
    Button,
    Divider,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
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
    pageHeaderTitleSx,
    pageRootSx,
    pageSectionPaperSx,
} from "../../components/page/pageStyles";

export default function TravelPlanDetails(){
     const navigate = useNavigate();
        const [travelPlan, setTravelPlan] = useState<TravelPlanResponse | null>(null);
        const[employees, setEmployees] = useState<EmployeeResponse[]>([]);
        const { travelPlanId } = useParams();
        const travelPlanIdNum = Number(travelPlanId);
    
        useEffect(() => {
             getTravelPlanByid(travelPlanIdNum)
                        .then((data) => {
                            setTravelPlan(data);
                        })
                        .catch(() => toast.error("Failed to load jobs"))
        },[]);

        useEffect(() => {
             getTravelParticipants(travelPlanIdNum)
                        .then((data) => {
                            setEmployees(data);
                        })
                        .catch(() => toast.error("Failed to load jobs"))
        },[]);

        return(
            <Box sx={pageRootSx}>
                <Paper variant="outlined" sx={pageSectionPaperSx}>
                    <Typography variant="h5" sx={pageHeaderTitleSx}>
                        {travelPlan?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {travelPlan?.startDate} - {travelPlan?.endDate}
                    </Typography>

                    <Divider sx={pageDividerSx} />

                    <Typography>{travelPlan?.description}</Typography>

                    <Divider sx={pageDividerSx} />

                    <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                            navigate(`/dashboard/travel/${travelPlanId}/assign-common-document`)
                        }
                    >
                        Upload common document
                    </Button>
                </Paper>

                <Paper variant="outlined" sx={{ ...pageHeaderPaperSx, pb: { xs: 2, sm: 2.5 } }}>
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Participants
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Assign documents for each participant.
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
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={dataTableActionsStackSx}
                                            >
                                                <Button
                                                    onClick={() =>
                                                        navigate(
                                                            `/dashboard/travel/${travelPlanIdNum}/${employee.id}/assign-document`
                                                        )
                                                    }
                                                    variant="contained"
                                                    size="small"
                                                >
                                                    Assign Documents
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