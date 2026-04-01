import { useEffect, useState } from "react";
import { getUsers, type EmployeeRoleResponse } from "../../api/role.api";
import { toast } from "react-toastify";
import {
    Box,
    Button,
    Chip,
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
import RoleUpdateModal from "./RoleUpdateModal";
import {
    dataTableActionsStackSx,
    dataTableContainerSx,
    dataTableEmptyStateCellSx,
    dataTableHeadRowSx,
    dataTablePrimaryCellSx,
} from "../../components/table/tableStyles";

export default function RoleUserList(){

    const[users, setUsers] = useState<EmployeeRoleResponse[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<EmployeeRoleResponse | null>(null);

    useEffect(() => {
        getUsers()
            .then((data) => setUsers(data))
            .catch(() => toast.error("Error loading user data"));
    }, []);

    return(
                <Box>
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
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Users
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                View users and manage role assignments.
                            </Typography>
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
                            <TableContainer component={Box} sx={dataTableContainerSx}>
                                <Table aria-label="users table">
                                    <TableHead>
                                        <TableRow sx={dataTableHeadRowSx}>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Designation</TableCell>
                                            <TableCell>Department</TableCell>
                                            <TableCell>Roles</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {users?.map((user) => (
                                            <TableRow key={user.id} hover>
                                                <TableCell sx={dataTablePrimaryCellSx}>
                                                    {user.firstName} {user.lastName}
                                                </TableCell>
                                                <TableCell>{user.designation}</TableCell>
                                                <TableCell>{user.department}</TableCell>
                                                <TableCell>
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        flexWrap="wrap"
                                                        useFlexGap
                                                    >
                                                        {user.roles?.map((role) => (
                                                            <Chip key={role} label={role} size="small" />
                                                        ))}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        sx={dataTableActionsStackSx}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setOpen(true);
                                                            }}
                                                        >
                                                            Update Roles
                                                        </Button>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {users?.length === 0 && (
                                            <TableRow key="no-users">
                                                <TableCell
                                                    colSpan={5}
                                                    align="center"
                                                    sx={dataTableEmptyStateCellSx}
                                                >
                                                    No users found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        <RoleUpdateModal
                            open={open}
                            onClose={() => {
                                setOpen(false);
                                setSelectedUser(null);
                            }}
                            userId={selectedUser?.id || 0}
                            onSuccess={() => {
                                getUsers().then(setUsers);
                            }}
                        />
                </Box>
    )
}