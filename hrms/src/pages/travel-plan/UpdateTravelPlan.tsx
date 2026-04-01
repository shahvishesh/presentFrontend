import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployees, type EmployeeResponse } from "../../api/employee.api";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getTravelPlanDetailByid, updateTravelPlan, type UpdateTravelPlanRequest } from "../../api/travel.api";
import dayjs from "dayjs";
import { Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, FormGroup, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
    pageContentPaperSx,
    pageDividerSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

interface EditFormValues {
  title: string;
  description: string;
  sourceLocation: string;
  destinationLocation: string;
  isInternational: boolean;
  startDate: Dayjs | null;
    endDate: Dayjs | null;
  employees: number[];
}

export default function UpdateTravelPlan(){
    const navigate = useNavigate();
    const { travelPlanId } = useParams();
    const [employees, setEmployees] = useState<EmployeeResponse []|null>(null);
    //const [travelPlan, setTravelPlan] = useState<TravelPlanDetail>();
    const [loading, setLoading] = useState(true);

    const today = dayjs().startOf("day");


    const {
                reset,
                control,
                handleSubmit,
            getValues,
            trigger,
            watch,
                formState: { errors },
        } = useForm<EditFormValues>();

        const startDateValue = watch("startDate");
        const endDateValue = watch("endDate");


    // useEffect(() => {
    //      getEmployees()
    //         .then((res) => setEmployees(res))
    //         .catch(() => toast.error("Failed to load employees"));
    // }, []);

    useEffect(() => {
        if (!travelPlanId) return;

       const fetchData = async () => {
               try {
                 const [travelRes, employeeRes] = await Promise.all([
                   getTravelPlanDetailByid(Number(travelPlanId)),
                   getEmployees(),
                 ]);
           
                 setEmployees(employeeRes);
           
                 reset({
                   title: travelRes.title,
                   description: travelRes.description,
                   sourceLocation: travelRes.sourceLocation,
                   destinationLocation: travelRes.destinationLocation,
                   isInternational: travelRes.isInternational,
                   startDate: dayjs(travelRes.startDate),
                   endDate: dayjs(travelRes.endDate),
                   employees: travelRes.participants.map((p) => p.id),
                 });
               } catch {
                 toast.error("Failed to load data");
               } finally {
                 setLoading(false);
               }
             };
           
             fetchData();

    }, [travelPlanId, reset]);



  const onSubmit = async (data: EditFormValues) => {
          if (data.startDate && data.startDate.isBefore(today, "day")) {
              toast.error("Start date cannot be before today");
              return;
          }

          if(data.startDate && data.endDate){
              if(data.endDate.isBefore(data.startDate)){
                  toast.error("End date must be after start date");
                  return;
              }
          }
          try {
              const payload: UpdateTravelPlanRequest = {
                   title: data.title,
                   description: data.description,
                   sourceLocation: data.sourceLocation,
                   destinationLocation: data.destinationLocation,
                   isInternational: data.isInternational,
                   startDate: data.startDate?.format("YYYY-MM-DD"),
                    endDate: data.endDate?.format("YYYY-MM-DD"),
                    employeeIds: data.employees.map((id) => id),
              };

            await updateTravelPlan(Number(travelPlanId), payload);
      
            toast.success("Travel plan updated");
            navigate(`/dashboard/travel/list`, { replace: true });
          } catch {
            toast.error("Failed to update travel plan");
          }
    };

    if (loading) {
        return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress />
        </Box>
        );
    }

    return(
        <Box sx={pageRootSx}>
            <Button variant="outlined" onClick={() =>navigate(-1)} sx={{ mb: 2 }}>
                Back
            </Button>

            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Update Travel Plan
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Update details and assigned employees.
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

                                            if (value.isBefore(today, "day")) {
                                                return "Start date cannot be before today";
                                            }

                                            if (endDate && value.isAfter(endDate, "day")) {
                                                return "Start date must be before end date";
                                            }

                                            return true;
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
                                            minDate={startDateValue ?? undefined}
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
                                <Divider sx={pageDividerSx} />
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
                                <Divider sx={pageDividerSx} />
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
                                Update Travel Plan
                            </Button>
                        </Stack>
                    </Box>
                </LocalizationProvider>
            </Paper>
        </Box>
    );
}