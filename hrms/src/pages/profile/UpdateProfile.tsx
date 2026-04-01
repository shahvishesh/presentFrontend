import { Controller, useForm } from "react-hook-form";
import {  useNavigate, useParams } from "react-router-dom";
import type { UpdateEmployeeProfile } from "../../api/employee.api";
import { useEffect, useState } from "react";
import {  getEmployeeProfileById, getEmployees, updateEmployeeProfileById, type EmployeeResponse } from "../../api/employee.api";
import { getDepartments, type DepartmentResponse } from "../../api/department.api";
import { toast } from "react-toastify";
import { Box, Button, CircularProgress, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import axios from "axios";
import dayjs from "dayjs";
import {
    pageContentPaperSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

interface FormValues {
    firstName: string;
    lastName: string;
    designation: string;
    phoneNumber: string;
    email: string;
    salary: number;
  dateOfBirth: Dayjs | null;
  joiningDate: Dayjs | null;
  departmentId: number;
  managerId?: number;
}

export default function UpdateProfile(){

    const navigate = useNavigate();
    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [managers, setManagers] = useState<EmployeeResponse[]>([]);
   
    const { employeeId } = useParams();
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //      getDepartments()
    //     .then((data) => setDepartments(data))
    //     .catch(() => toast.error("Unable to load departments"))
    // }, []);

    // useEffect(() => {
    //     getEmployees()
    //     .then((data) => setManagers(data))
    //     .catch(() => toast.error("Unable to load employees"))
    // }, []);

    const {
        reset,
            control,
            handleSubmit,
            formState: { errors },
        } = useForm<FormValues>(
            { defaultValues: { 
            departmentId: 0,
            managerId: 0
        } }
        );

    useEffect(() => {
            if (!employeeId) return;
    
           const fetchData = async () => {
                   try {
                     const [employeeRes, managerRes, departmentRes] = await Promise.all([
                       getEmployeeProfileById(Number(employeeId)),
                       getEmployees(),
                       getDepartments(),
                     ]);
               
                     setManagers(managerRes);
                     setDepartments(departmentRes);
               
                     reset({
                       firstName: employeeRes.firstName,
                        lastName: employeeRes.lastName,
                        designation: employeeRes.designation,
                        phoneNumber: employeeRes.phoneNumber,
                        email: employeeRes.email,
                        salary: employeeRes.salary,
                        dateOfBirth: dayjs(employeeRes.dateOfBirth),
                        joiningDate: dayjs(employeeRes.joiningDate),
                        departmentId: employeeRes.departmentId,
                        managerId: employeeRes.managerId,
                     });
                   } catch {
                     toast.error("Failed to load data");
                   } finally {
                     setLoading(false);
                   }
                 };
               
                 fetchData();
    
        }, [employeeId, reset]);

    const onSubmit = async (data: FormValues) => {
        try {
            const payload: UpdateEmployeeProfile = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            joiningDate: data.joiningDate?.format("YYYY-MM-DD"),
            dateOfBirth: data.dateOfBirth?.format("YYYY-MM-DD"),
            salary: data.salary,
            designation: data.designation,
            departmentId: data.departmentId,
            managerId: data.managerId ? data.managerId : null
            };
        
            await updateEmployeeProfileById(Number(employeeId), payload);
        
            toast.success("Employee updated successfully");
            reset();
            navigate("/dashboard/employee", { replace: true }); 
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "API Error");
            } else {
            toast.error("Something went wrong");
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                    {/* <Button variant="outlined" onClick={() =>navigate(-1)}>
                        Back
                    </Button> */}

                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Update Employee
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Update employee details.
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={pageContentPaperSx}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{ p: { xs: 2, sm: 2.5 } }}
                    >
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="firstName"
                                    control={control}
                                    rules={{ required: "First name is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="First name"
                                            fullWidth
                                            size="small"
                                            error={!!errors.firstName}
                                            helperText={errors.firstName?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="lastName"
                                    control={control}
                                    rules={{ required: "Last name is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Last name"
                                            fullWidth
                                            size="small"
                                            error={!!errors.lastName}
                                            helperText={errors.lastName?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="designation"
                                    control={control}
                                    rules={{ required: "Designation is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Designation"
                                            fullWidth
                                            size="small"
                                            error={!!errors.designation}
                                            helperText={errors.designation?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    rules={{ required: "Phone number is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Phone number"
                                            fullWidth
                                            size="small"
                                            error={!!errors.phoneNumber}
                                            helperText={errors.phoneNumber?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ required: "Email is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Email"
                                            fullWidth
                                            size="small"
                                            type="email"
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="salary"
                                    control={control}
                                    rules={{ required: "Salary  is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Salary"
                                            fullWidth
                                            size="small"
                                            type="number"
                                            error={!!errors.salary}
                                            helperText={errors.salary?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="dateOfBirth"
                                    control={control}
                                    rules={{
                                        required: "Date of birth is required",
                                    }}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Select date of birth"
                                            value={field.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: "small",
                                                    onBlur: field.onBlur,
                                                    error: !!errors.dateOfBirth,
                                                    helperText: errors.dateOfBirth?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="joiningDate"
                                    control={control}
                                    rules={{
                                        required: "Joining date is required",
                                    }}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Select joining date"
                                            value={field.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: "small",
                                                    onBlur: field.onBlur,
                                                    error: !!errors.joiningDate,
                                                    helperText: errors.joiningDate?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="departmentId"
                                    control={control}
                                    rules={{
                                        required: "Department is required",
                                        validate: (value) => value !== 0 || "Department is required",
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Department"
                                            fullWidth
                                            size="small"
                                            error={!!errors.departmentId}
                                            helperText={errors.departmentId?.message}
                                        >
                                            <MenuItem value={0}>Select Department</MenuItem>
                                            {departments?.map((department) => (
                                                <MenuItem key={department.id} value={department.id}>
                                                    {department.departmentName}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="managerId"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Manager"
                                            fullWidth
                                            size="small"
                                            error={!!errors.managerId}
                                            helperText={errors.managerId?.message}
                                        >
                                            <MenuItem value={0}>Select Manager</MenuItem>
                                            {managers?.map((manager) => (
                                                <MenuItem key={manager.id} value={manager.id}>
                                                    {manager.firstName} {manager.lastName}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update Employee
                            </Button>
                        </Stack>
                    </Box>
                </LocalizationProvider>
            </Paper>
        </Box>
    )
}