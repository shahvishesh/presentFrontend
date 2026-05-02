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
import type { CategoryType } from "../../expense/Test3";
import { createCategoryType, updateCategoryType } from "../../../api/category.api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (category: CategoryType) => void;
  initialData?: CategoryType | null; // for edit
};

type FormValues = {
  name: string;
};

export default function CategoryModal({
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

  // prefill when editing
  useEffect(() => {
    if (initialData) {
      reset({ name: initialData.categoryName });
    } else {
      reset({ name: "" });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      let res;

      if (initialData) {
        // EDIT
        res = await updateCategoryType(initialData.id, {
          name: data.name,
        });
        toast.success("Category updated");
      } else {
        // CREATE
        res = await createCategoryType({
          name: data.name,
        });
        toast.success("Category created");
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
            {initialData ? "Edit Category" : "Add Category"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {initialData
              ? "Update the category details"
              : "Create a new category for expense classification"}
          </Typography>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1.5 }}>
          <TextField
            label="Category Name"
            fullWidth
            size="small"
            {...register("name", {
              required: "Name is required",
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
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