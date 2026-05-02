import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import {
  createDocumentType,
  updateDocumentType,
  getDocumentFormats,
  type DocumentTypeResponse,
} from "../../../api/documentType.api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: DocumentTypeResponse) => void;
  initialData?: DocumentTypeResponse | null;
};

type FormValues = {
  code: string;
  name: string;
  allowedFormats: string[];
};

export default function DocumentTypeModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const [formats, setFormats] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
  defaultValues: {
    code: "",
    name: "",
    allowedFormats: [], // ✅ FIX 4
  },
});

  // ✅ fetch formats
  useEffect(() => {
    getDocumentFormats()
      .then(setFormats)
      .catch(() => toast.error("Failed to load formats"));
  }, []);

  // ✅ reset form on open
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
  code: initialData?.code || "",
  name: initialData?.name || "",
  allowedFormats: Array.isArray(initialData?.allowedFormats)
    ? initialData.allowedFormats
    : [], // ✅ FORCE ARRAY
});
      } else {
        reset({
          code: "",
          name: "",
          allowedFormats: [],
        });
      }
    }
  }, [open, initialData, reset]);

  // ✅ submit
  const onSubmit = async (data: FormValues) => {
    try {
      let res;

      if (initialData) {
        // UPDATE (code usually not editable)
        res = await updateDocumentType(initialData.id, {
          name: data.name.trim(),
          allowedFormats: data.allowedFormats,
        });
        toast.success("Updated successfully");
      } else {
        // CREATE
        res = await createDocumentType({
          code: data.code.trim(),
          name: data.name.trim(),
          allowedFormats: data.allowedFormats,
        });
        toast.success("Created successfully");
      }

      onSuccess(res);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
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
            {initialData ? "Edit Document Type" : "Add Document Type"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {initialData
              ? "Update the document type and allowed formats"
              : "Create a document type with supported formats"}
          </Typography>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1.5 }}>

          {/* CODE (only for create) */}
          {!initialData && (
            <TextField
              label="Code"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              {...register("code", {
                required: "Code is required",
              })}
              error={!!errors.code}
              helperText={errors.code?.message}
            />
          )}

          {/* NAME */}
          <TextField
            label="Name"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            {...register("name", {
              required: "Name is required",
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {/* FORMATS MULTI SELECT */}
          <FormControl fullWidth size="small">
            <InputLabel>Allowed Formats</InputLabel>

            <Controller
  name="allowedFormats"
  control={control}
  defaultValue={[]} // ✅ CRITICAL
  rules={{ required: "Select at least one format" }}
  render={({ field }) => (
    <Select
      multiple
      value={Array.isArray(field.value) ? field.value : []} // ✅ HARD FIX
      onChange={(e) => {
        const value = e.target.value;
        field.onChange(typeof value === "string" ? value.split(",") : value);
      }}
      label="Allowed Formats"
      renderValue={(selected) => {
        const values = Array.isArray(selected) ? selected : [];

        return (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {values.map((value: string) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        );
      }}
    >
      {formats.map((format) => (
        <MenuItem key={format} value={format}>
          {format}
        </MenuItem>
      ))}
    </Select>
  )}
/>

            {errors.allowedFormats && (
              <p style={{ color: "red", fontSize: 12 }}>
                {errors.allowedFormats.message}
              </p>
            )}
          </FormControl>
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