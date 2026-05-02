import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobDetailById, updateJobWithJd, type UpdateJobRequest } from "../../api/job.api";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getAvailableUserEmployees, getEmployees, type EmployeeResponse } from "../../api/employee.api";
import { openJDFile } from "../../api/file.api";
import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
} from "../../components/page/pageStyles";

export interface EditFormValues {
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

  export default function TestUpdateJob() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const jobIdNum = Number(jobId);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<EmployeeResponse[] | null>(null);
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    const [existingDocument, setExistingDocument] = useState<{
        id: number;
        name: string;
    } | null>(null);

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
      },
    });

    const handleDocumentChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (e.target.files && e.target.files[0]) {
        setDocumentFile(e.target.files[0]);
      }
    };

    useEffect(() => {
      if (!jobIdNum) return;

      const fetchData = async () => {
        try {
          const [jobRes, employeeRes] = await Promise.all([
            getJobDetailById(jobIdNum),
            getAvailableUserEmployees(),
          ]);
          setEmployees(employeeRes);
          if (jobRes.jdId && jobRes.fileName) {
            setExistingDocument({
              id: jobRes.jdId,
              name: jobRes.fileName,
            });
          }

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

            await updateJobWithJd(
          jobIdNum,
          payload,
          documentFile || undefined,
            );

            toast.success("Job updated");
        navigate("/dashboard/job/list", { replace: true });
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

    return (
      <Box sx={pageRootSx}>
        <Paper variant="outlined" sx={pageHeaderPaperSx}>
          <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
            <Stack spacing={0.25}>
              <Typography variant="h5" sx={pageHeaderTitleSx}>
                Update Job
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Edit role details, update CV reviewers, and replace the JD file.
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
                  name="jobCvReviewerIds"
                  control={control}
                  rules={{ required: "Please select at least one reviewer" }}
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

              {errors.jobCvReviewerIds && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="error" variant="body2">
                    {errors.jobCvReviewerIds.message}
                  </Typography>
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                {documentFile ? (
                  <Box mt={2}>
                    <Typography variant="body2">
                      Selected: <strong>{documentFile.name}</strong>
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      This will replace the existing document
                    </Typography>

                    <Box mt={1} display="flex" gap={1}>
                      <Button component="label" size="small" variant="outlined">
                        Change
                        <input
                          type="file"
                          hidden
                          onChange={handleDocumentChange}
                        />
                      </Button>
                    </Box>
                  </Box>
                ) : existingDocument ? (
                  <Box mt={2}>
                    <Typography variant="body2">
                      Current: <strong>{existingDocument.name}</strong>
                    </Typography>

                    <Box mt={1} display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openJDFile(existingDocument.id)}
                      >
                        View
                      </Button>

                      <Button component="label" size="small" variant="outlined">
                        Replace
                        <input
                          type="file"
                          hidden
                          onChange={handleDocumentChange}
                        />
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button component="label" variant="outlined" sx={{ mt: 2 }}>
                    Upload Job Description
                    <input
                      type="file"
                      hidden
                      onChange={handleDocumentChange}
                    />
                  </Button>
                )}
              </Grid>
            </Grid>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button variant="contained" type="submit">
                Update Job
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    );
}