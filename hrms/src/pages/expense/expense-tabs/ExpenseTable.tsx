import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { EmployeeExpenseResponse } from "../../../api/expense.api";
import {
  dataTableActionsStackSx,
  dataTableContainerSx,
  dataTableEmptyStateCellSx,
  dataTableHeadRowSx,
  dataTablePrimaryCellSx,
} from "../../../components/table/tableStyles";

interface Props {
  expenses: EmployeeExpenseResponse[];
  travelPlanId: number;
  employeeId: number;
}

export default function ExpenseTable({ 
  expenses,
  travelPlanId,
  employeeId, 

}: Props) {
  const navigate = useNavigate();

  const getAction = (expense: EmployeeExpenseResponse) => {
    if (expense.expenseStatus === "SUBMITTED") {
      return {
        label: "Verify Expense",
        path: `/dashboard/expense/travel/${travelPlanId}/${employeeId}/${expense.id}/expenses/verify`,
      };
    }

    return {
      label: "Update Decision",
      path: `/dashboard/expense/travel/${travelPlanId}/${employeeId}/${expense.id}/expenses/update`,
    };
  };

  return (
    <Box>
      <TableContainer component={Box} sx={dataTableContainerSx}>
        <Table aria-label="expenses table">
          <TableHead>
            <TableRow sx={dataTableHeadRowSx}>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {expenses?.map((expense) => (
              <TableRow key={expense.id} hover>
                <TableCell sx={dataTablePrimaryCellSx}>{expense.description}</TableCell>
                <TableCell>{expense.categoryName}</TableCell>
                <TableCell sx={{ color: "text.secondary" }}>{expense.expenseStatus}</TableCell>
                <TableCell>{expense.amount}</TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                    <Button
                      onClick={() => navigate(getAction(expense).path)}
                      variant="contained"
                      size="small"
                    >
                      {getAction(expense).label}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {expenses?.length === 0 && (
              <TableRow key="no-expenses">
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={dataTableEmptyStateCellSx}
                >
                  No expenses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}