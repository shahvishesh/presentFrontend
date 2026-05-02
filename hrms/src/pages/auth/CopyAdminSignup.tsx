import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import { signup } from "../../api/auth.api";
import { getAvailableEmploye, type EmployeeDetailResponse } from "../../api/employee.api";
import { getApiErrorMessage } from "../../utils/apiError";

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
    formState: { errors },
  } = useForm<RegisterRequest>();

  const navigate = useNavigate();

  const [employees, setEmployees] = useState<EmployeeDetailResponse[]>([]);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeDetailResponse | null>(null);

  // 🔹 Fetch employees without user accounts
  useEffect(() => {
    getAvailableEmploye()
      .then(setEmployees)
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await signup(data);
      toast.success("Registration successful");
      navigate("/login");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Signup failed"));
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={6}>
        <Typography variant="h5" mb={3}>
          Create Account
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Username */}
          <TextField
            fullWidth
            label="Username"
            margin="normal"
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

          {/* Password */}
          <TextField
            fullWidth
            label="Temporary Password"
            type="password"
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={
              errors.password?.message ||
              "User must change password after first login"
            }
          />

          {/* Employee Select (Controller) */}
          <Controller
            name="employeeId"
            control={control}
            rules={{ required: "Employee is required" }}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                label="Select Employee"
                margin="normal"
                value={field.value || ""}
                onChange={(e) => {
                  const empId = Number(e.target.value);
                  field.onChange(empId);

                  const emp = employees.find((e) => e.id === empId);
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

          {/* Employee Details (Readonly) */}
          {selectedEmployee && (
            <>
              <Typography mt={2} variant="subtitle1">
                Employee Details
              </Typography>

              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                value={selectedEmployee.fullName}
                InputProps={{ readOnly: true }}
              />

              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={selectedEmployee.email}
                InputProps={{ readOnly: true }}
              />

              <TextField
                fullWidth
                label="Department"
                margin="normal"
                value={selectedEmployee.departmentName}
                InputProps={{ readOnly: true }}
              />

              <TextField
                fullWidth
                label="Designation"
                margin="normal"
                value={selectedEmployee.designation}
                InputProps={{ readOnly: true }}
              />
            </>
          )}

          {/* Roles */}
          <Typography mt={2}>Select Roles</Typography>

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

          {errors.roles && (
            <Typography color="error" variant="body2">
              {errors.roles.message}
            </Typography>
          )}

          {/* Submit */}
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>
            Register
          </Button>

          {/* Login Link */}
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate("/login")}
                sx={{ cursor: "pointer" }}
              >
                Login here
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>
  );
}