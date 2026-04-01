import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  approveExpense,
  getEmployeeExpenseDetail,
  rejectExpense,
  type EmployeeExpenseResponse,
} from "../../api/expense.api";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
  TextField,
  Stack,
} from "@mui/material";
import { openFile } from "../../api/file.api";

import { formBodySx } from "../../components/form/formStyles";
import {
  pageContentPaperSx,
  pageDividerSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
} from "../../components/page/pageStyles";
 
export default function VerifyExpense() {
  const { travelPlanId, employeeId, expenseId } = useParams();
  const navigate = useNavigate();
 
  const [expense, setExpense] =
    useState<EmployeeExpenseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
 
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
 
  useEffect(() => {
    if (!expenseId) {
      setLoading(false);
      return;
    }
 
    getEmployeeExpenseDetail(Number(expenseId))
      .then((data) => setExpense(data))
      .catch(() => toast.error("Failed to load expense details"))
      .finally(() => setLoading(false));
  }, [expenseId]);

  useEffect(() => {
    if (expense) {
      setRemark(expense.remark || "");
    }
  }, [expense]);
 
  const handleApprove = async () => {
    if (!expenseId) return;

    try {
      setSubmitting(true);
 
      await approveExpense({
        expenseId: Number(expenseId),
        remark: remark.trim(),
      });
 
      toast.success("Expense approved successfully");
      navigate(`/dashboard/expense/travel/${Number(travelPlanId)}/${Number(employeeId)}/expenses`);
    } catch {
      toast.error("Failed to approve expense");
    } finally {
      setSubmitting(false);
    }
  };
 
  const handleReject = async () => {
    if (!expenseId) return;

    if (!remark.trim()) {
      setError("Remark is required when rejecting");
      return;
    }
 
    try {
      setSubmitting(true);
 
      await rejectExpense({
        expenseId: Number(expenseId),
        remark: remark.trim(),
      });
 
      toast.success("Expense rejected successfully");
      navigate(`/dashboard/expense/travel/${Number(travelPlanId)}/${Number(employeeId)}/expenses`);
    } catch {
      toast.error("Failed to reject expense");
    } finally {
      setSubmitting(false);
    }
  };
 
  if (loading) {
    return (
      <Box sx={pageRootSx}>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }
 
  if (!expense) {
    return (
      <Box sx={pageRootSx}>
        <Paper variant="outlined" sx={pageHeaderPaperSx}>
          <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" width="100%">
              <Stack spacing={0.25}>
                <Typography variant="h5" sx={pageHeaderTitleSx}>
                  Verify Expense
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Review details and approve or reject.
                </Typography>
              </Stack>

              <Button variant="outlined" onClick={() => navigate(-1)}>
                Back
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={pageContentPaperSx}>
          <Box sx={formBodySx}>
            <Typography>No expense found</Typography>
          </Box>
        </Paper>
      </Box>
    );
  }
 
  return (
    <Box sx={pageRootSx}>
      <Paper variant="outlined" sx={pageHeaderPaperSx}>
        <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" width="100%">
            <Stack spacing={0.25}>
              <Typography variant="h5" sx={pageHeaderTitleSx}>
                Verify Expense
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review details and approve or reject.
              </Typography>
            </Stack>

            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
        <Box sx={formBodySx}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Description:</strong> {expense.description}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Category:</strong> {expense.categoryName}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Amount:</strong> {expense.amount}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" alignItems="center" gap={1}>
                {expense.proofs?.length > 0 && (
                  <Button variant="contained" onClick={() => openFile(expense.proofs[0].id)}>
                    View Proof
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={pageDividerSx} />

          <TextField
            fullWidth
            label="Remark"
            multiline
            rows={3}
            size="small"
            value={remark}
            onChange={(e) => {
              setRemark(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error}
          />

          <Divider sx={pageDividerSx} />

          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="success" disabled={submitting} onClick={handleApprove}>
              Approve
            </Button>

            <Button variant="contained" color="error" disabled={submitting} onClick={handleReject}>
              Reject
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}