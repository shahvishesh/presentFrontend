import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryType } from "../../api/category.api";
import { Controller, set, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { submitExpense, type SubmitExpense } from "../../api/expense.api";
import { Box, Button, Container, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import type { ErrorResponse } from "../../utils/commonInterface";

type FormValues = {
    categoryId: number | "";
}

export type CategoryType = {
    id: number;
    categoryName: string;
}


export default function Test3() {
    const [categories, setCategories] = useState<CategoryType[]>([]);


    useEffect(() => {
        getCategoryType()
        .then((data) => {
            setCategories(data);
            console.log(data);
        })
        .catch(() => toast.error("Failed to load category"));
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>(
        { defaultValues: { categoryId: "" }}
    );

    const onSubmit = async (data: FormValues) => {
        console.log(data);
    };

    

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                                name="categoryId"
                                control={control}
                                rules={{ required: "Category is required" }}
                                render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Category"
                                    fullWidth
                                    error={!!errors.categoryId}
                                    helperText={errors.categoryId?.message}

                                >
                                    <MenuItem value="">Select Category</MenuItem>
                                    {categories?.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </MenuItem>
                                    ))}
                                </TextField>
                                )}
                            />

                            <Button type="submit">Submit</Button>
        </form>
    );
}