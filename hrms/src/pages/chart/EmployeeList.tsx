import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getEmployees, type EmployeeResponse } from "../../api/employee.api";
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
import {
    dataTableActionsStackSx,
    dataTableContainerSx,
    dataTableHeadRowSx,
    dataTablePrimaryCellSx,
} from "../../components/table/tableStyles";

export default function EmployeeList(){
     const navigate = useNavigate(); 
        const[employees, setEmployees] = useState<EmployeeResponse[]>([]);

        useEffect(() => {
             getEmployees()
                        .then((data) => {
                            setEmployees(data);
                        })
                        .catch(() => toast.error("Failed to load employees"))
        },[]);

        return(
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
                <Paper
                    variant="outlined"
                    sx={{
                        pt: { xs: 2, sm: 2.5 },
                        px: { xs: 2, sm: 2.5 },
                        pb: { xs: 2, sm: 2.5 },
                        mb: 0,
                        borderRadius: 2,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        overflow: "hidden",
                    }}
                >
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Employees
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            View employees and open their reporting chain.
                        </Typography>
                    </Stack>
                </Paper>

                <Paper
                    variant="outlined"
                    sx={{
                        borderTop: 0,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        borderBottomLeftRadius: 2,
                        borderBottomRightRadius: 2,
                        overflow: "hidden",
                        mb: 2,
                    }}
                >
                    {employees?.length === 0 ? (
                        <Box sx={{ p: 6, textAlign: "center" }}>
                            <Typography sx={{ fontWeight: 600 }}>No employees found</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Try again later.
                            </Typography>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                overflowY: "auto",
                                overscrollBehavior: "contain",
                                maxHeight: { xs: 360, sm: 700 },
                            }}
                        >
                            <TableContainer component={Box} sx={dataTableContainerSx}>
                                <Table aria-label="employees table">
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
                                                                navigate(`/dashboard/chart/${employee.id}`)
                                                            }
                                                            variant="contained"
                                                            size="small"
                                                        >
                                                            View Chain
                                                        </Button>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </Paper>
            </Box>
        )
}