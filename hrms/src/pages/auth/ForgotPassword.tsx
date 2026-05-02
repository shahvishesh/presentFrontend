import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { requestPasswordReset } from "../../api/auth.api";
import { getApiErrorMessage } from "../../utils/apiError";
import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
} from "../../components/page/pageStyles";

interface ForgotPasswordRequest {
  email: string;
}

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordRequest>({
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: ForgotPasswordRequest) => {
    try {
      await requestPasswordReset(data);
      toast.success("If an account exists, a reset link has been sent.");
      navigate("/login");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Request failed"));
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Box sx={{ ...pageRootSx, width: "100%", maxWidth: 560, boxSizing: "border-box" }}>
        <Paper variant="outlined" sx={pageHeaderPaperSx}>
          <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
            <Stack spacing={0.25}>
              <Typography variant="h5" sx={pageHeaderTitleSx}>
                Forgot Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your email and we will send password reset instructions.
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ ...pageContentPaperSx, mb: 0 }}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ p: { xs: 2, sm: 2.5 } }}
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                <Button variant="text" onClick={() => navigate("/login")} sx={{ px: 0 }}>
                  Back to login
                </Button>

                <Button variant="contained" type="submit" disabled={isSubmitting}>
                  Send reset link
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}