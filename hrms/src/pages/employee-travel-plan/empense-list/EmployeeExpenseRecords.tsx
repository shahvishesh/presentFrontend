import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Typography
} from "@mui/material";
import { toast } from "react-toastify";
import {deleteExpense, getExployeeExpensesByEmployeeIdAndStatusByEmployee, updateExpense, type EmployeeExpenseResponse } from "../../../api/expense.api";
import { useParams } from "react-router-dom";
import { useUser } from "../../../context/useUser";
import EmployeeExpenseTable from "./EmployeeExpenseTable";
import { pageCenteredStateSx, pageContentPaperSx, pageEmptyStateSubtitleSx, pageEmptyStateTitleSx, pageStateSubtitleSx, pageTabsStripSx, pageTabsSx } from "../../../components/page/pageStyles";
import UpdateExpenseModal from "../UpdateExpenseModal";
import { getCategoryType, type CategoryType } from "../../../api/category.api";

export default function EmployeeExpenseRecords() {
  const [tab, setTab] = useState(0);
  const [expenses, setExpenses] = useState<EmployeeExpenseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { travelPlanId } = useParams();
  const {user} = useUser();

  //UPDATE
  const [openUpdate, setOpenUpdate] = useState(false);
const [selectedExpense, setSelectedExpense] = useState<EmployeeExpenseResponse | null>(null);
const [categories, setCategories] = useState<CategoryType[]>([]);
const [updateAmount, setUpdateAmount] = useState("");
const [updateDescription, setUpdateDescription] = useState("");
const [updateCategoryId, setUpdateCategoryId] = useState<number | "">("");
const [updateFile, setUpdateFile] = useState<File | null>(null);

const handleOpenUpdate = (expense: EmployeeExpenseResponse) => {
  setSelectedExpense(expense);

  setUpdateAmount(String(expense.amount));
  setUpdateDescription(expense.description);
setUpdateCategoryId(expense.categoryId);  
setUpdateFile(null);

  setOpenUpdate(true);
};

const handleUpdateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files?.[0]) {
    setUpdateFile(e.target.files[0]);
  }
};

const handleUpdateSubmit = async () => {
  if (!selectedExpense) return;

  if (!updateAmount || Number(updateAmount) <= 0) {
    toast.error("Enter valid amount");
    return;
  }

  if (!updateDescription.trim()) {
    toast.error("Description required");
    return;
  }

  if (!updateCategoryId) {
    toast.error("Select category");
    return;
  }

  if (!user?.employeeId) {
    toast.error("User not found");
    return;
  }

  try {
    await updateExpense(
      selectedExpense.id,
      {
        amount: Number(updateAmount),
        description: updateDescription,
        categoryId: Number(updateCategoryId),
      },
      updateFile || undefined
    );

    toast.success("Expense updated");

    setOpenUpdate(false);
    setSelectedExpense(null);
    setUpdateFile(null);

    const refreshed = await getExployeeExpensesByEmployeeIdAndStatusByEmployee(
      Number(travelPlanId),
      user.employeeId,
      statusMap[tab]
    );

    setExpenses(refreshed);

  } catch {
    toast.error("Failed to update expense");
  }
};
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await getCategoryType();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  fetchCategories();
}, []);

  //  const [claimedExpense, setClaimedExpense] = useState(0);
  //   const [approvedExpense, setApprovedExpense] = useState(0);


  const statusMap = ["SUBMITTED", "APPROVED", "REJECTED"];

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // useEffect(() => {
  //                 getTotalClaimedAmountByEmployee(Number(travelPlanId))
  //                     .then((data) => setClaimedExpense(data))
  //             }, []);
      
  //     useEffect(() => {
  //                 getTotalApprovedAmountByEmployee(Number(travelPlanId))
  //                     .then((data) => setApprovedExpense(data))
  //     }, []);

  useEffect(() => {

    if (!user?.employeeId) return;

    const fetchExpenses = async () => {
      try {
        setLoading(true);

        const data = await getExployeeExpensesByEmployeeIdAndStatusByEmployee(Number(travelPlanId), user?.employeeId, statusMap[tab]);

        setExpenses(data);
      } catch {
        toast.error("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [tab, user?.employeeId]);

  //
     const handleDelete = async (expenseId: number) => {
                      const confirmDelete = window.confirm("Are you sure you want to delete this Expense?");
                      if (!confirmDelete) return;
                    
                      try {
                        await deleteExpense(expenseId);
                    
                        setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
                    
                        toast.success("Expense deleted");
                      } catch {
                        toast.error("Failed to delete expense");
                      }
    };
    
    //

  return (
    <Box>
      <Paper
              variant="outlined"
              sx={{
                p: 0,
                mb: 0,
                borderRadius: 2,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                overflow: "hidden",
              }}
            >
              <Box sx={{ ...pageTabsStripSx, mx: 0, borderTop: 0 }}>
                <Tabs
                  value={tab}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={pageTabsSx}
                >
                  <Tab label="Submitted" />
                  <Tab label="Approved" />
                  <Tab label="Rejected" />
                </Tabs>
              </Box>
            </Paper>
      
            <Paper variant="outlined" sx={pageContentPaperSx}>
              {loading ? (
                <Box sx={pageCenteredStateSx}>
                  <CircularProgress size={28} />
                  <Typography variant="body2" color="text.secondary" sx={pageStateSubtitleSx}>
                    Loading expenses…
                  </Typography>
                </Box>
              ) : expenses.length === 0 ? (
                <Box sx={pageCenteredStateSx}>
                  <Typography sx={pageEmptyStateTitleSx}>No expenses found</Typography>
                  <Typography variant="body2" color="text.secondary" sx={pageEmptyStateSubtitleSx}>
                    Try switching tabs to view other statuses.
                  </Typography>
                </Box>
              ) : (
                <EmployeeExpenseTable 
                  expenses={expenses}
                  handleDelete={handleDelete}
          onUpdate={handleOpenUpdate}
                />
              )}
            </Paper>
            <UpdateExpenseModal
  open={openUpdate}
  onClose={() => {
  setOpenUpdate(false);
  setSelectedExpense(null);
  setUpdateFile(null);
}}
  selectedExpense={selectedExpense}
  categories={categories}
  amount={updateAmount}
  description={updateDescription}
  categoryId={updateCategoryId}
  updateFile={updateFile}
  onAmountChange={setUpdateAmount}
  onDescriptionChange={setUpdateDescription}
  onCategoryChange={setUpdateCategoryId}
  onFileChange={handleUpdateFileChange}
  onSubmit={handleUpdateSubmit}
/>
    </Box>
  );
}