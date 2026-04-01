import { useEffect, useState } from "react";
import { deleteEmployeeById, getEmployeeProfileList, type EmployeeDetailResponse } from "../../api/employee.api";
import { toast } from "react-toastify";
import { Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    dataTableActionsStackSx,
    dataTableContainerSx,
    dataTableHeadRowSx,
    dataTablePrimaryCellSx,
} from "../../components/table/tableStyles";
import {
    pageRootSx,
    pageScrollableContentPaperSx,
} from "../../components/page/pageStyles";

export default function EmployeeProfileList(){
    const [employees, setEmployees] = useState<EmployeeDetailResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getEmployeeProfileList()
            .then((data) => setEmployees(data))
            .catch(() => toast.error("Unable to load employees"))
    }, []);

     const handleDelete = async (employeeId: number) => {
              const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
              if (!confirmDelete) return;
            
              try {
                await deleteEmployeeById(employeeId);
            
                setEmployees((prev) => prev.filter((employee) => employee.id !== employeeId));
            
                toast.success("Employee deleted");
              } catch {
                toast.error("Failed to delete employee");
              }
    };

     return(
            <Box sx={pageRootSx}>
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
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", sm: "center" }}
                        spacing={2}
                    >
                        <Stack spacing={0.25}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Employees
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                View, update, and delete employee profiles.
                            </Typography>
                        </Stack>

                        <Button
                            variant="contained"
                            onClick={() => navigate("/dashboard/employee/add")}
                            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
                        >
                            Add Employee
                        </Button>
                    </Stack>
                </Paper>

                <Paper
                    variant="outlined"
                    sx={pageScrollableContentPaperSx}
                >
                    {employees?.length === 0 ? (
                        <Box sx={{ p: 6, textAlign: "center" }}>
                            <Typography sx={{ fontWeight: 600 }}>No employees found</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Click “Add Employee” to create a new profile.
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
                            <TableContainer sx={dataTableContainerSx}>
                                <Table aria-label="employees table">
                                    <TableHead>
                                        <TableRow sx={dataTableHeadRowSx}>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Designation</TableCell>
                                            <TableCell>Department</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Phone</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {employees?.map((employee) => (
                                            <TableRow key={employee.id} hover>
                                                <TableCell sx={dataTablePrimaryCellSx}>
                                                    {employee.fullName}
                                                </TableCell>
                                                <TableCell>{employee.designation}</TableCell>
                                                <TableCell>{employee.departmentName}</TableCell>
                                                <TableCell>{employee.email}</TableCell>
                                                <TableCell>{employee.phoneNumber}</TableCell>

                                                <TableCell align="center">
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        sx={dataTableActionsStackSx}
                                                    >
                                                        <Tooltip title="Update">
                                                            <IconButton
                                                                color="secondary"
                                                                size="small"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/dashboard/employee/${employee.id}`
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
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(employee.id);
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
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