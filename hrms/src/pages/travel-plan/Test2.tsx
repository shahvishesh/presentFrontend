import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Paper,
} from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm, Controller } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
 
import { createTravelPlan } from "../api/travel";
import { getEmployees, EmployeeResponse } from "../api/employee";
 
interface FormValues {
  title: string;
  description: string;
  sourceLocation: string;
  destinationLocation: string;
  isInternational: boolean;
  dateRange: [Dayjs | null, Dayjs | null];
  employees: number[];
}
 
const CreateTravel: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [submitting, setSubmitting] = useState(false);
 
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      sourceLocation: "",
      destinationLocation: "",
      isInternational: false,
      dateRange: [null, null],
      employees: [],
    },
  });
 
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const res = await getEmployees();
        setEmployees(res);
      } catch (error) {
        toast.error("Failed to load employees");
      } finally {
        setLoadingEmployees(false);
      }
    };
 
    fetchEmployees();
  }, []);
 
  const onSubmit = async (data: FormValues) => {
    if (!data.dateRange[0] || !data.dateRange[1]) {
      toast.error("Please select travel dates");
      return;
    }
 
    if (data.employees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }
 
    try {
      setSubmitting(true);
 
      await createTravelPlan({
        title: data.title,
        description: data.description,
        sourceLocation: data.sourceLocation,
        destinationLocation: data.destinationLocation,
        isInternational: data.isInternational,
        employees: data.employees.map((id) => ({
          employeeId: id,
        })),
      });
 
      toast.success("Travel plan created successfully");
      reset();
      navigate("/travel");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create travel plan"
      );
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 4, maxWidth: 700, margin: "auto", mt: 4 }}>
        <Typography variant="h5" mb={3}>
          Create Travel Plan
        </Typography>
 
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          gap={3}
        >
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
            name="sourceLocation"
            control={control}
            rules={{ required: "Source location is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Source Location"
                fullWidth
                error={!!errors.sourceLocation}
                helperText={errors.sourceLocation?.message}
              />
            )}
          />
 
          <Controller
            name="destinationLocation"
            control={control}
            rules={{ required: "Destination location is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Destination Location"
                fullWidth
                error={!!errors.destinationLocation}
                helperText={errors.destinationLocation?.message}
              />
            )}
          />
 
          <Controller
            name="dateRange"
            control={control}
            render={({ field }) => (
              <DateRangePicker
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                localeText={{ start: "Start Date", end: "End Date" }}
              />
            )}
          />
 
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
 
          <Controller
            name="employees"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Select Employees"
                fullWidth
                SelectProps={{
                  multiple: true,
                }}
                disabled={loadingEmployees}
              >
                {loadingEmployees ? (
                  <MenuItem>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} - {emp.designation}
                    </MenuItem>
                  ))
                )}
              </TextField>
            )}
          />
 
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Travel Plan"}
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};
 
export default CreateTravel;