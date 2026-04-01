import React from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { Box, Button } from "@mui/material";
 
type FormValues = {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
};
 
export default function Test() {
  const { handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      startDate: null,
      endDate: null
    },
  });
 
  const onSubmit = (data: FormValues) => {
    console.log(`Form submitted: Start Date: ${data.startDate?.format("DD-MM-YYYY")}, End Date: ${data.endDate?.format("DD-MM-YYYY")}`);
  };
 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="startDate"
          control={control}
          rules={{
            required: "Start Date is required",
          }}
          render={({ field }) => (
            <DatePicker
              label="Select start date"
              value={field.value}
              onChange={(newValue) => field.onChange(newValue)}
            //   minDate={dayjs("2020-01-01")}
            //   maxDate={dayjs("2030-12-31")}
              slotProps={{
                textField: {
                  error: !!errors.startDate,
                  helperText: errors.startDate?.message,
                },
              }}
            />
          )}
        />

          <Controller
          name="endDate"
          control={control}
          rules={{
            required: "End Date is required",
          }}
          render={({ field }) => (
            <DatePicker
              label="Select end date"
              value={field.value}
              onChange={(newValue) => field.onChange(newValue)}
            //   minDate={dayjs("2020-01-01")}
            //   maxDate={dayjs("2030-12-31")}
              slotProps={{
                textField: {
                  error: !!errors.endDate,
                  helperText: errors.endDate?.message,
                },
              }}
            />
          )}
        />
          
 
        <Box mt={2}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    </LocalizationProvider>
  );
}


