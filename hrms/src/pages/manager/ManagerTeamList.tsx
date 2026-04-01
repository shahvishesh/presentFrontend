import { useEffect, useState } from "react";
import { getEmployeesByManager, type EmployeeResponse } from "../../api/employee.api";
import { toast } from "react-toastify";
import {
    Box,
    Button,
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
import { useNavigate } from "react-router-dom";
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

export default function ManagerTeamList(){
    const[employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getEmployeesByManager()
        .then((data) => setEmployees(data))
        .catch(() => toast.error("Failed to load team members"));
    }, []);

    return(
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                    <Stack spacing={0.25}>

                    <Typography variant="h5" sx={pageHeaderTitleSx}>
                                Team
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                View team members assigned to you.
                            </Typography>
                    </Stack>
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={pageContentPaperSx}>
                <TableContainer component={Box} sx={dataTableContainerSx}>
                    <Table aria-label="team members table">
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
                                                variant="contained"
                                                size="small"
                                                onClick={() => navigate(`/dashboard/team/${employee.id}`)}
                                            >
                                                View details
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {employees?.length === 0 && (
                                <TableRow key="no-employees">
                                    <TableCell colSpan={4} align="center" sx={dataTableEmptyStateCellSx}>
                                        No team members found
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