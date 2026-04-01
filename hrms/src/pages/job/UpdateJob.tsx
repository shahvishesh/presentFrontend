import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById, getJobDetailById, updateJob, type UpdateJobRequest } from "../../api/job.api";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, FormGroup, Stack, TextField, Typography } from "@mui/material";
import { getEmployees, type EmployeeResponse } from "../../api/employee.api";

export interface EditFormValues{
    title: string;
    description: string;
    location: string;
    companyName: string;
    minExperience: number;
    maxExperience: number;
    jobType: string;
    workPlaceType: string;
    jobCvReviewerIds: number[];
}

export default function UpdateJob(){
    const { jobId } = useParams();
    const navigate = useNavigate();
    const jobIdNum = Number(jobId);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<EmployeeResponse []|null>(null);
    

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<EditFormValues>({
  defaultValues: {
    title: "",
    description: "",
    location: "",
    companyName: "",
    minExperience: 0,
    maxExperience: 0,
    jobType: "",
    workPlaceType: "",
    jobCvReviewerIds: [],
  }
});

    useEffect(() => {
      if (!jobIdNum) return;
    
      const fetchData = async () => {
        try {
          const [jobRes, employeeRes] = await Promise.all([
            getJobDetailById(jobIdNum),
            getEmployees(),
          ]);
          setEmployees(employeeRes);

          reset({
            title: jobRes.title,
            description: jobRes.description,
            location: jobRes.location,
            companyName: jobRes.companyName,
            minExperience: jobRes.minExperience,
            maxExperience: jobRes.maxExperience,
            jobType: jobRes.jobType,
            workPlaceType: jobRes.workPlaceType,
            jobCvReviewerIds: jobRes.reviewerIds.map((id) => id),
          });
        } catch {
          toast.error("Failed to load data");
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [jobIdNum, reset]);

    const onSubmit = async (data: EditFormValues) => {
          try {
              const payload: UpdateJobRequest = {
                   title: data.title,
                   description: data.description,
                   location: data.location,
                   companyName: data.companyName,
                    minExperience: Number(data.minExperience),
                    maxExperience: Number(data.maxExperience),
                    jobType: data.jobType,
                    workPlaceType: data.workPlaceType,
                    jobCvReviewerIds: data.jobCvReviewerIds.map((id) => id),
              };

            await updateJob(jobIdNum, payload);
      
            toast.success("Job updated");
            navigate(`/dashboard/job/list`, { replace: true });
          } catch {
            toast.error("Failed to update job detail");
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
        <Container maxWidth="lg">
            <Button variant="outlined" onClick={() =>navigate(-1)} sx={{my:2}}>
                Back
            </Button>
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
                                                        name="jobCvReviewerIds"
                                                        control={control}
                                                        rules={{ required: "Please select at least one reviewer" }}
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
                                                        
                                                        {errors.jobCvReviewerIds && (
                                                        <Typography color="error" variant="body2">
                                                            {errors.jobCvReviewerIds.message}
                                                        </Typography>
                                                        )}

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{ mt: 3 }}
                    >
                        Update Job
                    </Button>
                </Stack>

            </form>
    </Container>
    )
}