import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { resetPassword, validateResetToken } from "../../api/auth.api";
import { getApiErrorMessage } from "../../utils/apiError";
import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
} from "../../components/page/pageStyles";

interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const [isValidatingToken, setIsValidatingToken] = useState<boolean>(!!token);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordRequest>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setIsValidatingToken(false);
      return;
    }

    const checkToken = async () => {
      setIsValidatingToken(true);
      try {
        const valid = await validateResetToken(token);
        setIsTokenValid(valid);
      } catch {
        setIsTokenValid(false);
      } finally {
        setIsValidatingToken(false);
      }
    };

    checkToken();
  }, [token]);

  if (isValidatingToken) {
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
                  Reset Password
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verifying your reset link.
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ ...pageContentPaperSx, mb: 0 }}>
            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Typography variant="body2" color="text.secondary">
                Please wait while we validate your token.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }

  if (!token || !isTokenValid) {
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
                  Reset Password
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This reset link is missing, invalid, expired, or already used.
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ ...pageContentPaperSx, mb: 0 }}>
            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Request a new password reset email and use the most recent link from your inbox.
                </Typography>

                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                  <Button variant="text" onClick={() => navigate("/forgot-password")} sx={{ px: 0 }}>
                    Request new link
                  </Button>

                  <Button variant="contained" onClick={() => navigate("/login")}>
                    Back to login
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }

  const onSubmit = async (data: ResetPasswordRequest) => {
    if (!token || !isTokenValid) {
      toast.error("Reset token is missing or invalid.");
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword: data.password,
      });
      toast.success("Password reset successful. Please log in again.");
      navigate("/login");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Reset failed"));
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
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new password using the token from your reset link.
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
                label="New Password"
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

              <TextField
                fullWidth
                size="small"
                label="Confirm New Password"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />

              {!token && (
                <Typography variant="body2" color="error">
                  Reset token is missing. Use the link from your email or request a new one.
                </Typography>
              )}

              <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                <Button variant="text" onClick={() => navigate("/login")} sx={{ px: 0 }}>
                  Back to login
                </Button>

                <Button variant="contained" type="submit" disabled={isSubmitting || !token || !isTokenValid}>
                  Reset password
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}