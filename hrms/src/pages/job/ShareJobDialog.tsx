import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { giveReferral, shareJob, type GiveReferral, type ShareJob } from "../../api/job.api";
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
  jobId
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
 
      console.log(data.email);
      await shareJob(jobId, data);
 
      toast.success("Job referred successfully");
 
      reset();
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        const message =
          error.response?.data.message || "Failed to share job";
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Share Job</DialogTitle>
 
      <DialogContent>
        <DialogContentText>
          Enter recipient's email
        </DialogContentText>
 
        <form onSubmit={handleSubmit(onSubmit)} id="referral-form">
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            type="email"
            {...register("email", {
              required: "email is required",
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

        </form>
      </DialogContent>
 
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
 
        <Button
          type="submit"
          form="referral-form"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
}