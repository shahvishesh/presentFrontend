import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import { getApprovedAmountByTravelPlanAndEmployeeByHr, getClaimedAmountByTravelPlanAndEmployeeByHr, getExployeeExpensesByEmployeeIdAndStatus, type EmployeeExpenseResponse } from "../../../api/expense.api";
import { getEmployeeProfileById, type EmployeeProfileDetail } from "../../../api/employee.api";
import { getDepartments } from "../../../api/department.api";
import ExpenseTable from "./ExpenseTable";
import { useParams } from "react-router-dom";
import {
  pageCenteredStateSx,
  pageContentPaperSx,
  pageDividerSx,
  pageEmptyStateSubtitleSx,
  pageEmptyStateTitleSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
  pageSectionPaperSx,
  pageStateSubtitleSx,
  pageTabsStripSx,
  pageTabsSx,
} from "../../../components/page/pageStyles";
import { getTravelPlanByid, type TravelPlanResponse } from "../../../api/travel.api";

export default function ExpenseRecords() {
  const [tab, setTab] = useState(0);
  const [expenses, setExpenses] = useState<EmployeeExpenseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { travelPlanId, employeeId } = useParams();
  const [travelPlan, setTravelPlan] = useState<TravelPlanResponse | null>(null);

  const [employee, setEmployee] = useState<EmployeeProfileDetail | null>(null);
  const [departmentName, setDepartmentName] = useState<string>("");

   const [claimedExpense, setClaimedExpense] = useState(0);
    const [approvedExpense, setApprovedExpense] = useState(0);
const travelPlanIdNum = Number(travelPlanId);
        const employeeIdNum = Number(employeeId);

  const statusMap = ["SUBMITTED", "APPROVED", "REJECTED"];

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    const employeeIdNum = Number(employeeId);
    if (!Number.isFinite(employeeIdNum)) return;

    Promise.all([getEmployeeProfileById(employeeIdNum), getDepartments()])
      .then(([profile, departments]) => {
        setEmployee(profile);
        const department = departments.find((d) => d.id === profile.departmentId);
        setDepartmentName(
          department?.departmentName ?? (profile.departmentId ? `Department #${profile.departmentId}` : "")
        );
      })
      .catch(() => toast.error("Failed to load employee"));
  }, [employeeId]);

  useEffect(() => {
    if (!Number.isFinite(travelPlanIdNum) || !Number.isFinite(employeeIdNum)) return;

    getClaimedAmountByTravelPlanAndEmployeeByHr(travelPlanIdNum, employeeIdNum)
      .then((data) => setClaimedExpense(data))
      .catch(() => toast.error("Failed to load claimed expense"));
  }, [travelPlanId, employeeId]);

  useEffect(() => {
    if (!Number.isFinite(travelPlanIdNum) || !Number.isFinite(employeeIdNum)) return;

    getApprovedAmountByTravelPlanAndEmployeeByHr(travelPlanIdNum, employeeIdNum)
      .then((data) => setApprovedExpense(data))
      .catch(() => toast.error("Failed to load approved expense"));
  }, [travelPlanId, employeeId]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);

        if (!Number.isFinite(travelPlanIdNum) || !Number.isFinite(employeeIdNum)) {
          setExpenses([]);
          return;
        }

        const data = await getExployeeExpensesByEmployeeIdAndStatus(
          travelPlanIdNum,
          employeeIdNum,
          statusMap[tab]
        );

        setExpenses(data);
      } catch {
        toast.error("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [tab, travelPlanId, employeeId]);

  useEffect(() => {
               getTravelPlanByid(travelPlanIdNum)
                          .then((data) => {
                              setTravelPlan(data);
                          })
                          .catch(() => toast.error("Failed to load jobs"))
          },[]);

  return (
    <Box sx={pageRootSx}>
                   <Paper variant="outlined" sx={pageHeaderPaperSx}>
                                       <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                                           <Stack spacing={0.25}>
                                               <Typography variant="h5" sx={pageHeaderTitleSx}>
                                                   Verify Expenses
                                               </Typography>
                                               <Typography variant="body2" color="text.secondary">
                                                   Verify expenses for the employee.
                                               </Typography>
                                           </Stack>
                                       </Stack>
                                   </Paper>
                                   {travelPlan && (
                                                       <Paper variant="outlined" sx={{
                                                           p: { xs: 2, sm: 2.5 },
                                                           overflow: "hidden",
                                                           borderTop:0,
                                                           borderRadius:0,
                                                           borderBottomLeftRadius: 7,
                                                           borderBottomRightRadius: 7,
                                                           mb: 2
                                                       }}>
                                                         <Typography variant="h6">
                                                           {travelPlan.title}
                                                         </Typography>
                                                         <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                           {travelPlan.description}
                                                         </Typography>
                                                         <Divider sx={pageDividerSx} />
                                               
                                                         <Stack spacing={0.5}>
                                                           <Typography variant="body1">
                                                             Period: {travelPlan.startDate} to {travelPlan.endDate}
                                                           </Typography>
                                                           <Typography variant="body1">
                                                             From: {travelPlan.sourceLocation}
                                                           </Typography>
                                                           <Typography variant="body1">
                                                             To: {travelPlan.destinationLocation}
                                                           </Typography>
                                                         </Stack>
                                                       </Paper>
                                        )}
      {employee && (
        <Paper variant="outlined" sx={pageSectionPaperSx}>
          <Typography variant="h6">
            {employee.firstName} {employee.lastName}
          </Typography>
          <Divider sx={pageDividerSx} />

          <Stack spacing={0.5}>
            <Typography variant="body1">
              Email: {employee.email}
            </Typography>
            <Typography variant="body1">
              Designation: {employee.designation}
            </Typography>
            <Typography variant="body1">
              Department: {departmentName}
            </Typography>
          </Stack>
        </Paper>
      )}
      <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 2 }}>
        <Paper variant="outlined" sx={{ ...pageSectionPaperSx, mb: 0, flex: 1 }}>
          <Typography variant="h6">Total Claimed Expense</Typography>
          <Divider sx={pageDividerSx} />
          <Typography>Rs.{claimedExpense}</Typography>
        </Paper>

        <Paper variant="outlined" sx={{ ...pageSectionPaperSx, mb: 0, flex: 1 }}>
          <Typography variant="h6">Total Approved Expense</Typography>
          <Divider sx={pageDividerSx} />
          <Typography>Rs.{approvedExpense}</Typography>
        </Paper>
      </Stack>

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
          <ExpenseTable
            travelPlanId={Number(travelPlanId)}
            employeeId={Number(employeeId)}
            expenses={expenses}
          />
        )}
      </Paper>
    </Box>
  );
}