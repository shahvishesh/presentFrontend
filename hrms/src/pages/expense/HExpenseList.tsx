import { useEffect, useState } from "react"
import { getApprovedAmountByTravelPlanAndEmployeeByHr, getClaimedAmountByTravelPlanAndEmployeeByHr, getExployeeExpenses, getExployeeExpensesByEmployeeId, submitExpense, type EmployeeExpenseResponse, type SubmitExpense } from "../../api/expense.api"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Card, CardContent, Divider, Grid, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";


export default function HExpenseList(){

    const[expenses, setExpenses] = useState<EmployeeExpenseResponse[]>([]);
    const { travelPlanId, employeeId } = useParams();
    const navigate  = useNavigate();

    const [claimedExpense, setClaimedExpense] = useState(0);
    const [approvedExpense, setApprovedExpense] = useState(0);

    useEffect(() => {
         getExployeeExpensesByEmployeeId(Number(travelPlanId), Number(employeeId))
            .then((data) => setExpenses(data))
            .catch(() => toast.error("Failed to load expense"))
    }, []);

    useEffect(() => {
                getClaimedAmountByTravelPlanAndEmployeeByHr(Number(travelPlanId), Number(employeeId))
                    .then((data) => setClaimedExpense(data))
            }, []);
    
    useEffect(() => {
                getApprovedAmountByTravelPlanAndEmployeeByHr(Number(travelPlanId), Number(employeeId))
                    .then((data) => setApprovedExpense(data))
    }, []);

    return(
        <Box>
            <Stack
                    direction="row"
                    gap={2}
                >

                    <Card sx={{ mb: 3, flex: 1 }}>
                            <CardContent>
                                <Typography variant="h6">Total Claimed Expense</Typography>
                

                                <Divider sx={{ my: 2 }} />
                                <Typography>Rs.{claimedExpense}</Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3, flex: 1 }}>
                            <CardContent>
                                <Typography variant="h6">Total Approved Expense</Typography>
                

                                <Divider sx={{ my: 2 }} />
                                <Typography>Rs.{approvedExpense}</Typography>
                        </CardContent>
                    </Card>
                </Stack>

                <Card sx={{ mt: 4}}>
                    <Typography variant="h6" m={3}>
                        Expenses
                    </Typography>

                        <TableContainer component={Paper}>
                        <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {expenses?.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell>{expense.description}</TableCell>
                                <TableCell>{expense.categoryName}</TableCell>
                                <TableCell>{expense.expenseStatus}</TableCell>
                                <TableCell>{expense.amount}</TableCell>

                                <TableCell align="center">
                                <Button onClick={() => navigate(`/dashboard/expense/travel/${Number(travelPlanId)}/${Number(employeeId)}/${expense.id}/expenses/verify`)} variant="contained">
                                    Verify Expense
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}

                            {expenses?.length === 0 && (
                            <TableRow key="no-expenses">
                                <TableCell colSpan={6} align="center">
                                No Expenses found
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Box>
    )
}