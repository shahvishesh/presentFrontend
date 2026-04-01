import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryType, type CategoryType } from "../../api/category.api";
import { Controller, set, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { submitExpense, type SubmitExpense } from "../../api/expense.api";
import { Box, Button, Container, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import type { ErrorResponse } from "../../utils/commonInterface";

type FormValues = {
    description: string;
    categoryId: number;
    amount: number;
}

export default function AddExpense() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const { travelPlanId } = useParams();
    const travelPlanIdNum = Number(travelPlanId);

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

    const {
        reset,
        control,
        register,
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
            await submitExpense(2, data, expenseFile);
            toast.success("Expense submitted successfully");
            reset();
            setExpenseFile(null);
            navigate("/dashboard/job");
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
        <Container maxWidth="lg">
            <Typography variant="h5" mb={3}>
                Submit Expense
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 1 }}
                    >
                        <Grid size={{ xs: 5 }} >
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

                        <Grid size={{ xs: 6 }} >
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

                        <Grid size={{ xs: 6 }}>
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
                    {/* Upload Resume */}
                    {!expenseFile ? (
                        <Button component="label" variant="outlined" sx={{ mt: 2 }}>
                        Upload Expense Proof
                        <input
                            type="file"
                            hidden
                            onChange={handleExpenseChange}
                        />
                        </Button>
                    ) : (
                        <Box mt={2}>
                        <Typography variant="body2">
                            Selected: <strong>{expenseFile.name}</strong>
                        </Typography>
            
                        <Box mt={1} display="flex" gap={1}>
                            <Button
                            component="label"
                            size="small"
                            variant="outlined"
                            >
                            Change
                            <input
                                type="file"
                                hidden
                                onChange={handleExpenseChange}
                            />
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
                <div>
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </div>
        
            </form>
        </Container>
    );
}