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
import type { EmployeeExpenseResponse } from "../../../api/expense.api";
import { openFile } from "../../../api/file.api";
import { dataTableActionsStackSx, dataTableContainerSx, dataTableEmptyStateCellSx, dataTableHeadRowSx, dataTablePrimaryCellSx } from "../../../components/table/tableStyles";

interface Props {
  expenses: EmployeeExpenseResponse[];
}

export default function EmployeeExpenseTable({ 
  expenses

}: Props) {
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
                            <TableCell>Remark</TableCell>
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
                                <TableCell>
                                    {expense.remark ? expense.remark : "-"}
                                </TableCell>
                                <TableCell align="center">
                                  <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                                    
                                  <Button onClick={() => openFile(expense.proofs[0].id)} variant="contained" size="small">
                                      View Proof
                                  </Button>
                                  </Stack>
                                </TableCell>
                            </TableRow>
                            ))}

                             {expenses?.length === 0 && (
                                          <TableRow key="no-expenses">
                                            <TableCell
                                              colSpan={6}
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