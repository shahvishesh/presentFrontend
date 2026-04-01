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
import {getExployeeExpensesByEmployeeIdAndStatusByEmployee, type EmployeeExpenseResponse } from "../../../api/expense.api";
import { useParams } from "react-router-dom";
import { useUser } from "../../../context/UseUser";
import EmployeeExpenseTable from "./EmployeeExpenseTable";
import { pageCenteredStateSx, pageContentPaperSx, pageEmptyStateSubtitleSx, pageEmptyStateTitleSx, pageStateSubtitleSx, pageTabsStripSx, pageTabsSx } from "../../../components/page/pageStyles";

export default function EmployeeExpenseRecords() {
  const [tab, setTab] = useState(0);
  const [expenses, setExpenses] = useState<EmployeeExpenseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { travelPlanId } = useParams();
  const {user} = useUser();

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
                />
              )}
            </Paper>
    </Box>
  );
}