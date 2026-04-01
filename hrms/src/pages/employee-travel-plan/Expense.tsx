import { useEffect, useState } from "react"
import { getTotalApprovedAmountByEmployee, getTotalClaimedAmountByEmployee, submitExpense, type SubmitExpense } from "../../api/expense.api"
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Card, CardContent, Divider, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import type { CategoryType } from "../expense/Test3";
import { getCategoryType } from "../../api/category.api";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import type { ErrorResponse } from "../../utils/commonInterface";
import EmployeeExpenseRecords from "./empense-list/EmployeeExpenseRecords";
import {
    pageContentPaperSx,
    pageDividerSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
    pageSectionPaperSx,
} from "../../components/page/pageStyles";
import { getTravelPlanByid, type TravelPlanResponse } from "../../api/travel.api";

export default function Expense(){

    const [claimedExpense, setClaimedExpense] = useState(0);
    const [approvedExpense, setApprovedExpense] = useState(0);

    const { travelPlanId } = useParams();
    const [travelPlan, setTravelPlan] = useState<TravelPlanResponse | null>(null);

    //
     const [categories, setCategories] = useState<CategoryType[]>([]);
    const [expenseFile, setExpenseFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleExpenseChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files && e.target.files[0]) {
        setExpenseFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        getCategoryType()
        .then((data) => {
            setCategories(data);
        })
        .catch(() => toast.error("Failed to load category"));
    }, []);

    useEffect(() => {
                getTotalClaimedAmountByEmployee(Number(travelPlanId))
                    .then((data) => setClaimedExpense(data))
            }, []);
    
    useEffect(() => {
                getTotalApprovedAmountByEmployee(Number(travelPlanId))
                    .then((data) => setApprovedExpense(data))
        }, []);

    useEffect(() => {
            const travelIdNum = Number(travelPlanId);
            if (!Number.isFinite(travelIdNum)) return;
        
            Promise.all([getTravelPlanByid(travelIdNum)])
              .then(([travelPlan]) => {
                setTravelPlan(travelPlan);
              })
              .catch(() => toast.error("Failed to load travel plan"));
          }, [travelPlanId]);

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SubmitExpense>(
        { defaultValues: { 
            description: "",
            amount: 0,
            categoryId: 0 
        } }
    );

    const onSubmit = async (data: SubmitExpense) => {
        if (!expenseFile) {
            toast.error("Expense proof is required");
            return;
        }
        try {
            setLoading(true);
            await submitExpense(Number(travelPlanId), data, expenseFile);
            toast.success("Expense submitted successfully");
            reset();
            setExpenseFile(null);
            //navigate("/dashboard/job");
        } catch (error: unknown) {
                if(axios.isAxiosError<ErrorResponse>(error)){
                        const message = error.response?.data.message || "Failed to submit expense";
                        toast.error(message);
                }else{
                    toast.error("Something went wrong");
                }
        }finally{
            setLoading(false)
        }
    };

    return(
        <Box sx={pageRootSx}>
                <Paper variant="outlined" sx={pageHeaderPaperSx}>
                    <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                        <Stack spacing={0.25}>
                            <Typography variant="h6" sx={pageHeaderTitleSx}>
                                Submit Expense
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Submit an expense with proof.
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

                <Paper variant="outlined" sx={pageContentPaperSx}>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: { xs: 2, sm: 2.5 } }}>
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                            <Grid size={{ xs: 12, sm: 5 }}>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{ required: "Description is required" }}
                                    render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Description"
                                        fullWidth
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="amount"
                                    control={control}
                                    rules={{ required: "Amount is required" }}
                                    render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Amount"
                                        fullWidth
                                        type="number"
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        error={!!errors.amount}
                                        helperText={errors.amount?.message}
                                    />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 3 }}>
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    rules={{
                                        required: "Category is required",
                                        validate: (value) => value !== 0 || "Category is required"
                                        }}
                                    render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Category"
                                        fullWidth
                                        error={!!errors.categoryId}
                                        helperText={errors.categoryId?.message}
                                    >
                                        <MenuItem value={0}>Select Category</MenuItem>
                                        {categories?.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.categoryName}
                                        </MenuItem>
                                        ))}
                                    </TextField>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={pageDividerSx} />

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            gap={2}
                            justifyContent="space-between"
                            alignItems={{ xs: "stretch", sm: "center" }}
                        >
                            <Box>
                                {!expenseFile ? (
                                    <Button component="label" variant="outlined">
                                        Upload Expense Proof
                                        <input type="file" hidden onChange={handleExpenseChange} />
                                    </Button>
                                ) : (
                                    <Box>
                                        <Typography variant="body2">
                                            Selected: <strong>{expenseFile.name}</strong>
                                        </Typography>

                                        <Box mt={1} display="flex" gap={1}>
                                            <Button component="label" size="small" variant="outlined">
                                                Change
                                                <input type="file" hidden onChange={handleExpenseChange} />
                                            </Button>

                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => setExpenseFile(null)}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </Box>

                            <Button
                                sx={{ alignSelf: { xs: "flex-end", sm: "auto" } }}
                                variant="contained"
                                type="submit"
                                disabled={loading}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </Box>
                </Paper>

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

                <EmployeeExpenseRecords/>
            </Box>
    )
}