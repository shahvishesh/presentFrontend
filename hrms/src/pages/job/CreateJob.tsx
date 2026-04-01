import { Button, Container, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { createJob, type CreateJobRequest } from "../../api/job.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { ErrorResponse } from "../../utils/commonInterface";
import axios from "axios";

export default function CreateJob(){
    const navigate = useNavigate();
    const {
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<CreateJobRequest>();

    const onSubmit = async (data: CreateJobRequest) => {
    try {
      await createJob(data);
      toast.success("Job posted successfully");
      navigate("/dashboard/job");
    } catch (error: unknown) {
        if(axios.isAxiosError<ErrorResponse>(error)){
                const message = error.response?.data.message || "Failed to post job";
                toast.error(message);
        }else{
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
            
                <TextField
                    fullWidth
                    label="Title"
                    margin="normal"
                    {...register("title", { required: "Job title is required" })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />

                <TextField
                    fullWidth
                    multiline
                    label="Description"
                    margin="normal"
                    {...register("description", {
                    required: "Job description is required",
                    })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                />

                <TextField
                    fullWidth
                    label="Company Name"
                    margin="normal"
                    {...register("companyName", {
                    required: "Company Name is required",
                    })}
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                />

                <TextField
                    fullWidth
                    label="Minimum Experience"
                    type="number"
                    margin="normal"
                    {...register("minExperience", {
                    required: "Please enter minimum experience",
                    valueAsNumber : true,
                    min: 0
                    })}
                    error={!!errors.minExperience}
                    helperText={errors.minExperience?.message}
                />

                <TextField
                    fullWidth
                    label="Maximum Experience"
                    type="number"
                    margin="normal"
                    {...register("maxExperience", {
                    required: "Please enter maximum experience",
                    valueAsNumber : true,
                    min: 0
                    })}
                    error={!!errors.maxExperience}
                    helperText={errors.maxExperience?.message}
                />

                <TextField
                    fullWidth
                    label="Job Type"
                    margin="normal"
                    {...register("jobType", { required: "Job type is required" })}
                    error={!!errors.jobType}
                    helperText={errors.jobType?.message}
                />

                <TextField
                    fullWidth
                    label="Workplace Type"
                    margin="normal"
                    {...register("workPlaceType", { required: "Work Place Type is required" })}
                    error={!!errors.workPlaceType}
                    helperText={errors.workPlaceType?.message}
                />

            <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 3 }}
            >
                Post Job
            </Button>

            </form>
    </Container>
    )
}