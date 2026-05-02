import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  createTag,
  updateTag,
  type TagResponse,
} from "../../../api/tag.api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (tag: TagResponse) => void;
  initialData?: TagResponse | null;
};

type FormValues = {
  tagName: string;
};

export default function TagModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  // ✅ Prefill (edit mode)
  useEffect(() => {
    if (initialData) {
      reset({ tagName: initialData.tagName });
    } else {
      reset({ tagName: "" });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({ tagName: initialData.tagName });
      } else {
        reset({ tagName: "" });
      }
    }
  }, [initialData, open, reset]);

  // ✅ Submit
  const onSubmit = async (data: FormValues) => {
    try {
      let res;

      if (initialData) {
        // UPDATE
        res = await updateTag(initialData.id, {
          tagName: data.tagName,
        });
        toast.success("Tag updated");
      } else {
        // CREATE
        res = await createTag({
          tagName: data.tagName,
        });
        toast.success("Tag created");
      }

      onSuccess(res);
      onClose();
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            {initialData ? "Edit Tag" : "Add Tag"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {initialData
              ? "Update the tag details"
              : "Create a new tag for classification"}
          </Typography>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1.5 }}>
          <TextField
            label="Tag Name"
            fullWidth
            size="small"
            {...register("tagName", {
              required: "Tag name is required",
            })}
            error={!!errors.tagName}
            helperText={errors.tagName?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {initialData ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}