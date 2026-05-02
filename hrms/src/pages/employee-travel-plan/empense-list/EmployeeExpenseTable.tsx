import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Box,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import type { EmployeeExpenseResponse } from "../../../api/expense.api";
import { openFile } from "../../../api/file.api";
import { dataTableActionsStackSx, dataTableContainerSx, dataTableEmptyStateCellSx, dataTableHeadRowSx, dataTablePrimaryCellSx } from "../../../components/table/tableStyles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  expenses: EmployeeExpenseResponse[];
  onUpdate: (expense: EmployeeExpenseResponse) => void;
  handleDelete: (expenseId: number) => void;
}

export default function EmployeeExpenseTable({ 
  expenses,
handleDelete,
  onUpdate,
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
                                {/* Avoid runtime error when proof is not available */}
                                {(() => {
                                  const proofId = expense.proofs?.[0]?.id;
                                  return (
                                    <>
                                <TableCell sx={dataTablePrimaryCellSx}>{expense.description}</TableCell>
                                <TableCell>{expense.categoryName}</TableCell>
                                <TableCell sx={{ color: "text.secondary" }}>{expense.expenseStatus}</TableCell>
                                <TableCell>{expense.amount}</TableCell>
                                <TableCell>
                                    {expense.remark ? expense.remark : "-"}
                                </TableCell>
                                <TableCell align="center">
                                  <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                                  <Tooltip title={proofId ? "View Proof" : "No Proof Available"}>
                                    <span>
                                      <IconButton
                                        color="primary"
                                        size="small"
                                        disabled={!proofId}
                                        onClick={() => proofId && openFile(proofId)}
                                      >
                                        <VisibilityIcon fontSize="small" />
                                      </IconButton>
                                    </span>
                                  </Tooltip>

                                  {expense.expenseStatus === "SUBMITTED" && (
                                          <>
                                            <Tooltip title="Delete">
                                              <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(expense.id)}
                                              >
                                                <DeleteIcon fontSize="small" />
                                              </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Update">
                                              <IconButton
                                                color="secondary"
                                                size="small"
                                                onClick={() => onUpdate(expense)}
                                              >
                                                <EditIcon fontSize="small" />
                                              </IconButton>
                                            </Tooltip>
                                          </>
                                        )}
                                  </Stack>
                                </TableCell>
                                    </>
                                  );
                                })()}
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