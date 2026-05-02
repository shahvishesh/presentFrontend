import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import { signup } from "../../api/auth.api";
import { getAvailableEmploye, type EmployeeDetailResponse } from "../../api/employee.api";
import { getApiErrorMessage } from "../../utils/apiError";
import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
} from "../../components/page/pageStyles";

type Role = "HR" | "EMPLOYEE" | "MANAGER";

interface RegisterRequest {
  username: string;
  password: string;
  employeeId: number;
  roles: Role[];
}

export default function AdminSignUp() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const navigate = useNavigate();

  const [employees, setEmployees] = useState<EmployeeDetailResponse[]>([]);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeDetailResponse | null>(null);

  useEffect(() => {
    getAvailableEmploye()
      .then(setEmployees)
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await signup(data);
      toast.success("Registration successful");
      reset();
      setSelectedEmployee(null);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Signup failed"));
    }
  };

  return (
    <Box sx={pageRootSx}>
      <Paper variant="outlined" sx={pageHeaderPaperSx}>
        <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
          <Stack spacing={0.25}>
            <Typography variant="h5" sx={pageHeaderTitleSx}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register an employee account and assign roles.
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Username"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters",
                  },
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="employeeId"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Select Employee"
                    value={field.value || ""}
                    onChange={(e) => {
                      const empId = Number(e.target.value);
                      field.onChange(empId);

                      const emp = employees.find((employee) => employee.id === empId);
                      setSelectedEmployee(emp || null);
                    }}
                    error={!!errors.employeeId}
                    helperText={errors.employeeId?.message}
                  >
                    {employees.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.fullName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {selectedEmployee && (
              <>
                <Grid size={{ xs: 12 }}>
                  <Divider />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1">Employee Details</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Full Name"
                    value={selectedEmployee.fullName}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    value={selectedEmployee.email}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Department"
                    value={selectedEmployee.departmentName}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Designation"
                    value={selectedEmployee.designation}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </>
            )}

            <Grid size={{ xs: 12 }}>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1">Select Roles</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="HR"
                      {...register("roles", {
                        required: "Select at least one role",
                      })}
                    />
                  }
                  label="HR"
                />
                <FormControlLabel
                  control={<Checkbox value="EMPLOYEE" {...register("roles")} />}
                  label="Employee"
                />
                <FormControlLabel
                  control={<Checkbox value="MANAGER" {...register("roles")} />}
                  label="Manager"
                />
              </FormGroup>
            </Grid>

            {errors.roles && (
              <Grid size={{ xs: 12 }}>
                <Typography color="error" variant="body2">
                  {errors.roles.message}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="text" onClick={() => navigate("/login")}>
              Back to Login
            </Button>
            <Button variant="contained" type="submit">
              Register
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}