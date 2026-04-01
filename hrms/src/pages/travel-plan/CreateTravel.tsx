import { useState, useEffect } from "react";
import { getEmployees } from "../../api/employee.api";
import { Controller, useForm } from "react-hook-form";
import { type EmployeeResponse } from "../../api/employee.api";
import { createTravelPlan, type TravelPlanRequest } from "../../api/travel.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
    pageContentPaperSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

interface FormValues {
  title: string;
  description: string;
  sourceLocation: string;
  destinationLocation: string;
  isInternational: boolean;
  startDate: Dayjs | null;
    endDate: Dayjs | null;
  employees: number[];
}

export default function CreateTravel(){
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<EmployeeResponse []|null>(null);
    const today = dayjs().startOf("day");

    const {
        control,
        handleSubmit,
        getValues,
        trigger,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
            defaultValues: {
                title: "",
                description: "",
                sourceLocation: "",
                destinationLocation: "",
                isInternational: false,
                startDate: null,
                endDate: null,
                employees: [],
            }
            });

    const startDateValue = watch("startDate");
    const endDateValue = watch("endDate");


    useEffect(() => {
         getEmployees()
            .then((res) => setEmployees(res))
            .catch(() => toast.error("Failed to load employees"));
    }, []);

    const onSubmit = async (data: FormValues) => {
        try {
            const payload: TravelPlanRequest = {
            title: data.title,
            description: data.description,
            sourceLocation: data.sourceLocation,
            destinationLocation: data.destinationLocation,
            isInternational: data.isInternational ? data.isInternational : false,
            startDate: data.startDate?.format("YYYY-MM-DD"),
            endDate: data.endDate?.format("YYYY-MM-DD"),
            employees: data.employees.map((id) => ({
                employeeId: id,
            })),
            };
        
            await createTravelPlan(payload);
        
            toast.success("Travel plan created successfully");
            navigate("/dashboard/travel/"); 
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "API Error");
            } else {
            toast.error("Something went wrong");
            }
        }
    };

    return (
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>

                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Create Travel Plan
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Add details and assign employees.
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={pageContentPaperSx}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                    name="sourceLocation"
                                    control={control}
                                    rules={{ required: "Source location is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Source Location"
                                            fullWidth
                                            size="small"
                                            error={!!errors.sourceLocation}
                                            helperText={errors.sourceLocation?.message}
                                        />
                                    )}
                                />
                            </Grid>
                    

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="destinationLocation"
                                    control={control}
                                    rules={{ required: "Destination location is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Destination Location"
                                            fullWidth
                                            size="small"
                                            error={!!errors.destinationLocation}
                                            helperText={errors.destinationLocation?.message}
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    rules={{
                                        required: "Start Date is required",
                                        validate: (value) => {
                                            const endDate = getValues("endDate");

                                            if (!value) return true;

                                            if (endDate && value.isAfter(endDate, "day")) {
                                                return "Start date must be before end date";
                                            }

                                            return value.isBefore(today, "day")
                                                ? "Start date cannot be in the past"
                                                : true;
                                        },
                                    }}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Select start date"
                                            value={field.value}
                                            minDate={today}
                                            maxDate={endDateValue ?? undefined}
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                                void trigger(["startDate", "endDate"]);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: "small",
                                                    onBlur: field.onBlur,
                                                    error: !!errors.startDate,
                                                    helperText: errors.startDate?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    rules={{
                                        required: "End Date is required",
                                        validate: (value) => {
                                            const startDate = getValues("startDate");

                                            if (!value || !startDate) return true;

                                            return value.isBefore(startDate, "day")
                                                ? "End date must be after start date"
                                                : true;
                                        },
                                    }}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Select end date"
                                            value={field.value}
                                            minDate={startDateValue ?? today}
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                                void trigger(["startDate", "endDate"]);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: "small",
                                                    onBlur: field.onBlur,
                                                    error: !!errors.endDate,
                                                    helperText: errors.endDate?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="isInternational"
                                        control={control}
                                        render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                            <Checkbox
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                            }
                                            label="International Travel"
                                        />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Select Employees
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

                        </Grid>

                        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Create Travel Plan
                            </Button>
                        </Stack>
                    </Box>
                </LocalizationProvider>
            </Paper>
        </Box>
    );
}