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
import { giveReferral, type GiveReferral } from "../../api/job.api";
import type { ErrorResponse } from "../../utils/commonInterface";
import axios from "axios";
import { toast } from "react-toastify";
 
interface ReferFriendDialogProps {
  open: boolean;
  onClose: () => void;
  jobId: number;
}
 
export default function ReferFriendDialog({
  open,
  onClose,
  jobId,
}: ReferFriendDialogProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GiveReferral>();
 
  const onSubmit = async (data: GiveReferral) => {
    if (!resumeFile) {
      toast.error("Resume file is required");
      return;
    }
 
    try {
      setLoading(true);
 
      await giveReferral(jobId, data, resumeFile);
 
      toast.success("Job referred successfully");
 
      reset();
      setResumeFile(null);
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        const message =
          error.response?.data.message || "Failed to refer job";
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
 
  const handleResumeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };
 
  const handleClose = () => {
    if (!loading) {
      reset();
      setResumeFile(null);
      onClose();
    }
  };
 
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Refer a Friend</DialogTitle>
 
      <DialogContent>
        <DialogContentText>
          Enter your friend's details below
        </DialogContentText>
 
        <form onSubmit={handleSubmit(onSubmit)} id="referral-form">
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            {...register("friendName", {
              required: "Name is required",
            })}
            error={!!errors.friendName}
            helperText={errors.friendName?.message}
          />
 
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            type="email"
            {...register("friendEmail", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.friendEmail}
            helperText={errors.friendEmail?.message}
          />
 
          <TextField
            fullWidth
            label="Comment"
            multiline
            rows={3}
            margin="normal"
            {...register("comment")}
          />
 
          {/* Upload Resume */}
          {!resumeFile ? (
            <Button component="label" variant="outlined" sx={{ mt: 2 }}>
              Upload Resume
              <input
                type="file"
                hidden
                onChange={handleResumeChange}
              />
            </Button>
          ) : (
            <Box mt={2}>
              <Typography variant="body2">
                Selected: <strong>{resumeFile.name}</strong>
              </Typography>
 
              <Box mt={1} display="flex" gap={1}>
                <Button
                  component="label"
                  size="small"
                  variant="outlined"
                >
                  Change
                  <input
                    type="file"
                    hidden
                    onChange={handleResumeChange}
                  />
                </Button>
 
                <Button
                  size="small"
                  color="error"
                  onClick={() => setResumeFile(null)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          )}
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
          Refer
        </Button>
      </DialogActions>
    </Dialog>
  );
}