
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signup } from "../../api/auth.api";
import axios from "axios";
import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
} from "../../components/page/pageStyles";

type Role = "HR" | "EMPLOYEE" | "MANAGER" 

interface RegisterRequest {
    username: string;
    email:string;
    password: string;
    employeeId: number;
    roles: Role[];

}

interface ErrorResponse{
    message: string;
    code: number;
    timestamp: string;
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await signup(data);
      toast.success("Registration successful");
      navigate("/login");
    } catch (error: unknown) {
        if(axios.isAxiosError<ErrorResponse>(error)){
                const message = error.response?.data.message || "signup failed";
                toast.error(message);
        }else{
            toast.error("Something went wrong");
        }
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        mb: 2,
        ...pageRootSx,
      }}
    >
      <Paper variant="outlined" sx={pageHeaderPaperSx}>
        <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
          <Stack spacing={0.25}>
            <Typography variant="h5" sx={pageHeaderTitleSx}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter details to create a new user.
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ p: { xs: 2, sm: 2.5 } }}
        >
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            {...register("email", {
              required: "Email is required",
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Password"
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
            helperText={errors.password?.message}
          />

          <TextField
            fullWidth
            label="Employee ID"
            type="number"
            margin="normal"
            {...register("employeeId", {
              required: "Employee ID is required",
              valueAsNumber: true,
            })}
            error={!!errors.employeeId}
            helperText={errors.employeeId?.message}
          />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Select Roles
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={<Checkbox value="HR" {...register("roles")} />}
              label="HR"
            />
            <FormControlLabel
              control={<Checkbox value="Employee" {...register("roles")} />}
              label="Employee"
            />
            <FormControlLabel
              control={<Checkbox value="Manager" {...register("roles")} />}
              label="manager"
            />
          </FormGroup>

          {errors.roles && (
            <Typography color="error" variant="body2">
              {errors.roles.message}
            </Typography>
          )}

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Register
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
