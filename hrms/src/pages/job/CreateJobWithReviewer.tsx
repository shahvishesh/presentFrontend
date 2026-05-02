import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { createJobWithJd, type CreateJobRequest } from "../../api/job.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { getAvailableUserEmployees, getEmployees, type EmployeeResponse } from "../../api/employee.api";
import {
    pageContentPaperSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

export interface FormValues {
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

export default function CreateJobWithReviewer() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<EmployeeResponse[] | null>(null);
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    useEffect(() => {
        getAvailableUserEmployees()
            .then((res) => setEmployees(res))
            .catch(() => toast.error("Failed to load employees"));
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        if (!documentFile) {
                toast.error("Please upload JD");
                return;
            }

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

            await createJobWithJd(payload, documentFile);

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

    const handleDocumentChange = (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            if (e.target.files && e.target.files[0]) {
            setDocumentFile(e.target.files[0]);
            }
        };

    return (
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Post Job
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Add role details and assign CV reviewers.
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={pageContentPaperSx}>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ p: { xs: 2, sm: 2.5 } }}
                >
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: "Title is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Title"
                                        fullWidth
                                        size="small"
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
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
                                        size="small"
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="companyName"
                                control={control}
                                rules={{ required: "Company name is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Company Name"
                                        fullWidth
                                        size="small"
                                        error={!!errors.companyName}
                                        helperText={errors.companyName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="location"
                                control={control}
                                rules={{ required: "Location is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Location"
                                        fullWidth
                                        size="small"
                                        error={!!errors.location}
                                        helperText={errors.location?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="minExperience"
                                control={control}
                                rules={{ required: "Please enter minimum experience", min: 0 }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Minimum Experience"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        error={!!errors.minExperience}
                                        helperText={errors.minExperience?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="maxExperience"
                                control={control}
                                rules={{ required: "Please enter maximum experience", min: 0 }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Maximum Experience"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        error={!!errors.maxExperience}
                                        helperText={errors.maxExperience?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="jobType"
                                control={control}
                                rules={{ required: "Job Type is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Job Type"
                                        fullWidth
                                        size="small"
                                        error={!!errors.jobType}
                                        helperText={errors.jobType?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="workPlaceType"
                                control={control}
                                rules={{ required: "Work place type is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Work Place Type"
                                        fullWidth
                                        size="small"
                                        error={!!errors.workPlaceType}
                                        helperText={errors.workPlaceType?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Divider />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Select CV Reviewers
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="employees"
                                control={control}
                                rules={{ required: "Please select at least one employee" }}
                                defaultValue={[]}
                                render={({ field }) => (
                                    <Box
                                        sx={{
                                            border: 1,
                                            borderColor: "divider",
                                            borderRadius: 1,
                                            p: 1,
                                            maxHeight: 260,
                                            overflowY: "auto",
                                        }}
                                    >
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
                                    </Box>
                                )}
                            />
                        </Grid>

                        {errors.employees && (
                            <Grid size={{ xs: 12 }}>
                                <Typography color="error" variant="body2">
                                    {errors.employees.message}
                                </Typography>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }}>
                            {!documentFile ? (
                                <Button component="label" variant="outlined" sx={{ mt: 2 }}>
                                    Upload Job Description
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleDocumentChange}
                                    />
                                </Button>
                            ) : (
                                <Box mt={2}>
                                    <Typography variant="body2">
                                        Selected: <strong>{documentFile.name}</strong>
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
                                                onChange={handleDocumentChange}
                                            />
                                        </Button>

                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => setDocumentFile(null)}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Post Job
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}