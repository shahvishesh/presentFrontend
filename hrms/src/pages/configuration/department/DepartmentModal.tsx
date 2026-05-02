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
  createDepartment,
  updateDepartment,
  type DepartmentResponse,
} from "../../../api/department.api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (dept: DepartmentResponse) => void;
  initialData?: DepartmentResponse | null;
};

type FormValues = {
  departmentName: string;
};

export default function DepartmentModal({
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

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({ departmentName: initialData.departmentName });
      } else {
        reset({ departmentName: "" });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      let res;

      if (initialData) {
        res = await updateDepartment(initialData.id, {
          departmentName: data.departmentName.trim(),
        });
        toast.success("Department updated");
      } else {
        res = await createDepartment({
          departmentName: data.departmentName.trim(),
        });
        toast.success("Department created");
      }

      onSuccess(res);
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Operation failed";
      toast.error(message);
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
            {initialData ? "Edit Department" : "Add Department"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {initialData
              ? "Update the department details"
              : "Create a new department for your organization"}
          </Typography>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1.5 }}>
          <TextField
            label="Department Name"
            fullWidth
            size="small"
            {...register("departmentName", {
              required: "Department name is required",
            })}
            error={!!errors.departmentName}
            helperText={errors.departmentName?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {initialData ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}