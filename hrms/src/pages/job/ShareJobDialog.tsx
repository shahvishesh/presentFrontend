import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { shareJob, type ShareJob } from "../../api/job.api";
import type { ErrorResponse } from "../../utils/commonInterface";
import axios from "axios";
import { toast } from "react-toastify";
 
interface ShareJobDialogProps {
  open: boolean;
  onClose: () => void;
    jobId: number;

}
 
export default function ShareJobDialog({
  open,
  onClose,
  jobId,
}: ShareJobDialogProps) {
  const [loading, setLoading] = useState(false);
 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShareJob>();
 
  const onSubmit = async (data: ShareJob) => {
    try {
      setLoading(true);

      await shareJob(jobId, data);

      toast.success("Job shared successfully");

      reset();
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        const message = error.response?.data.message || "Failed to share job";
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };
 
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 0.5 }}>
        <Stack spacing={0.25}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Share Job
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
            Send this job opening to a candidate by email.
          </Typography> */}
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        <DialogContentText sx={{ mb: 1.5 }}>
          Enter recipient email address.
        </DialogContentText>

        <form onSubmit={handleSubmit(onSubmit)} id="referral-form">
          <TextField
            fullWidth
            label="Email"
            size="small"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          type="submit"
          form="referral-form"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
}