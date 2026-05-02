import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import type { CategoryType } from "../expense/Test3";
import type { EmployeeExpenseResponse } from "../../api/expense.api";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedExpense: EmployeeExpenseResponse | null;
  categories: CategoryType[];
  amount: string;
  description: string;
  updateFile: File | null;
  categoryId: number | "";
  onCategoryChange: (value: number | "") => void;
  onAmountChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export default function UpdateExpenseModal({
  open,
  onClose,
  selectedExpense,
  categories,
  amount,
  description,
  categoryId,
  updateFile,
  onAmountChange,
  onDescriptionChange,
  onCategoryChange,
  onFileChange,
  onSubmit,
}: Props) {
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
            Update Expense
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Edit details and update the receipt if needed
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        <Stack gap={1.5} mt={0.5}>
          {/* Amount */}
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            fullWidth
            size="small"
          />

          {/* Description */}
          <TextField
            label="Description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
          />

          {/* Category */}
          <TextField
            select
            label="Category"
            value={categoryId}
            onChange={(e) => {
              const value = e.target.value;
              onCategoryChange(value === "" ? "" : Number(value));
            }}
            fullWidth
            size="small"
          >
            <MenuItem value="">Select category</MenuItem>
            {categories?.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.categoryName}
              </MenuItem>
            ))}
          </TextField>

          {/* Existing file */}
          {!updateFile && selectedExpense?.proofs?.[0]?.fileName && (
            <Typography variant="body2">
              Current: <strong>{selectedExpense.proofs[0].fileName}</strong>
            </Typography>
          )}

          {/* Upload */}
          {!updateFile ? (
            <Button component="label" variant="outlined" sx={{ mt: 0.5 }}>
              Upload New Receipt
              <input
                type="file"
                hidden
                accept=".pdf,.jpg,.png"
                onChange={onFileChange}
              />
            </Button>
          ) : (
            <Box mt={0.5}>
              <Typography variant="body2">
                Selected: <strong>{updateFile.name}</strong>
              </Typography>

              <Box mt={1} display="flex" gap={1}>
                <Button component="label" size="small" variant="outlined">
                  Change
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.png"
                    onChange={onFileChange}
                  />
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary">
                This will replace the existing receipt
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}