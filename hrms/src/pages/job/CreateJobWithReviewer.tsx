import { Button, Checkbox, Container, FormControlLabel, FormGroup, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { createJob, type CreateJobRequest } from "../../api/job.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { ErrorResponse } from "../../utils/commonInterface";
import axios from "axios";
import { useEffect, useState } from "react";
import { getEmployees, type EmployeeResponse } from "../../api/employee.api";

export interface FormValues{
    title: string;
    description: string;
    companyName: string;
    location: string;
    minExperience: number;
    maxExperience: number;
    jobType: string;
    workPlaceType: string;
    employees: number[];
}

export default function CreateJobWithReviewer(){
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<EmployeeResponse []|null>(null);
    
    useEffect(() => {
             getEmployees()
                .then((res) => setEmployees(res))
                .catch(() => toast.error("Failed to load employees"));
        }, []);

    const {
            control,
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<FormValues>();


        const onSubmit = async (data: FormValues) => {
        try {
            const payload: CreateJobRequest = {
            title: data.title,
            description: data.description,
            companyName: data.companyName,
            location: data.location,
            minExperience: Number(data.minExperience),
            maxExperience: Number(data.maxExperience),
            jobType: data.jobType,
            workPlaceType: data.workPlaceType,
            reviewerIds: data.employees,
        };
        
            await createJob(payload);
        
            toast.success("Job posted successfully");
            navigate("/dashboard/job/"); 
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "API Error");
            } else {
            toast.error("Something went wrong");
            }
        }
    };

    return(
        <Container maxWidth="lg">
            <Typography variant="h5" mb={3}>
                Post Job
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
            
                <Stack gap={2}>

                        <Controller
                                        name="title"
                                        control={control}
                                        rules={{ required: "Title is required" }}
                                        render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Title"
                                            fullWidth
                                            error={!!errors.title}
                                            helperText={errors.title?.message}
                                        />
                                        )}
                                    />
                            
                            
                                    <Controller
                                        name="description"
                                        control={control}
                                        rules={{ required: "Description is required" }}
                                        render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Description"
                                            multiline
                                            rows={3}
                                            fullWidth
                                            error={!!errors.description}
                                            helperText={errors.description?.message}
                                        />
                                        )}
                                    />

                        <Controller
                                        name="companyName"
                                        control={control}
                                        rules={{ required: "Company name is required" }}
                                        render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Company Name"
                                            fullWidth
                                            error={!!errors.companyName}
                                            helperText={errors.companyName?.message}
                                        />
                                        )}
                                    />

                        <Controller
                                        name="location"
                                        control={control}
                                        rules={{ required: "Location is required" }}
                                        render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Location"
                                            fullWidth
                                            error={!!errors.location}
                                            helperText={errors.location?.message}
                                        />
                                        )}
                                    />

                        <Controller
                                        name="minExperience"
                                        control={control}
                                        rules={{ required: "Please enter minimum experience" ,min: 0}}
                                        render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Minimum Experience"
                                            type="number"
                                            fullWidth
                                            error={!!errors.minExperience}
                                            helperText={errors.minExperience?.message}
                                        />
                                        )}
                                    />
                            
                            
                                    <Controller
                                        name="maxExperience"
                                        control={control}
                                        rules={{ required: "Please enter maximum experience" , min: 0}}
                                        render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Maximun Experience"
                                            type="number"
                                            fullWidth
                                            error={!!errors.maxExperience}
                                            helperText={errors.maxExperience?.message}
                                        />
                                        )}
                                    />

                        <Controller
                                        name="jobType"
                                        control={control}
                                        rules={{ required: "Job Type is required" }}
                                        render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Job Type"
                                            fullWidth
                                            error={!!errors.jobType}
                                            helperText={errors.jobType?.message}
                                        />
                                        )}
                                    />
                            
                            
                                    <Controller
                                        name="workPlaceType"
                                        control={control}
                                        rules={{ required: "Work place type is required" }}
                                        render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Work Place Type"
                                            fullWidth
                                            error={!!errors.workPlaceType}
                                            helperText={errors.workPlaceType?.message}
                                        />
                                        )}
                                    />

                        <Typography variant="subtitle1" mt={2} mb={1}>
                                                        Select CV Reviewers
                                                        </Typography>
                                                        
                                                        <Controller
                                                        name="employees"
                                                        control={control}
                                                        rules={{ required: "Please select at least one employee" }}
                                                        defaultValue={[]}
                                                        render={({ field }) => (
                                                            <FormGroup>
                                                            {employees?.map((emp) => (
                                                                <FormControlLabel
                                                                key={emp.id}
                                                                control={
                                                                    <Checkbox
                                                                    checked={field.value?.includes(emp.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                        field.onChange([...field.value, emp.id]);
                                                                        } else {
                                                                        field.onChange(
                                                                            field.value.filter((id: number) => id !== emp.id)
                                                                        );
                                                                        }
                                                                    }}
                                                                    />
                                                                }
                                                                label={`${emp.firstName} ${emp.lastName} (${emp.designation})`}
                                                                />
                                                            ))}
                                                            </FormGroup>
                                                        )}
                                                        />
                                                        
                                                        {errors.employees && (
                                                        <Typography color="error" variant="body2">
                                                            {errors.employees.message}
                                                        </Typography>
                                                        )}

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{ mt: 3 }}
                    >
                        Post Job
                    </Button>
                </Stack>

            </form>
    </Container>
    )
}