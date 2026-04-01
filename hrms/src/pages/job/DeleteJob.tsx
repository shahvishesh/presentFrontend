import { useEffect, useState } from "react";
import { deleteJob, getAllJobs, type JobResponse } from "../../api/job.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Divider, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


export default function DeleteJob(){
    //load jobs created by this hr in card format and a delete icon beside it
    //only the owner hr can delete it

    const navigate = useNavigate();
    const [jobs, setJobs] = useState<JobResponse[]>([]);
    

    useEffect(() => {
        getAllJobs()
            .then((data) => {
                setJobs(data);
            })
            .catch(() => toast.error("Failed to load jobs"))
    },[]);

    const handleDelete = async (jobId: number) => {
        const confirmDelete = window.confirm("Are you sure you want to close this job?");
          if (!confirmDelete) return;
        
          try {
            await deleteJob(jobId);
        
            setJobs((prev) => prev.filter((job) => job.id !== jobId));
        
            toast.success("Post deleted");
          } catch {
            toast.error("Failed to delete post");
          }
    }

    return(
        <>
            <Box>
                <Typography variant="h6" mb={2}>
                    Open jobs
                </Typography>
            </Box>

            {jobs?.map((job) => (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems=""

                        >
                            <Stack>

                                <Typography variant="h5">{job.title}</Typography>
                                <Typography color="text.secondary" mb={2}>
                                    {job.companyName} • {job.location}
                                </Typography>
                            </Stack>

                            <Stack
                            direction="row"
                                    spacing={1}
                                    justifyContent="center"
                                    alignItems="center"
                            >

                                <Tooltip title="Update">
                                            <IconButton
                                            color="secondary"
                                            size="small"
                                            onClick={() => navigate(`/dashboard/job/update/${job.id}`)}
                                            >
                                            <EditIcon />
                                            </IconButton>
                                </Tooltip>
                                

                                <Tooltip title="Delete">

                                    <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                    handleDelete(job.id);
                                    }}
                                >
                                    <DeleteIcon />
                                 </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }} >
                            <Typography>
                                <strong>Experience:</strong>{" "}
                                {job.minExperience} - {job.maxExperience} years
                            </Typography>
                            </Grid>

                            <Grid size={{ xs: 6 }} >
                            <Typography>
                                <strong>Job Type:</strong> {job.jobType}
                            </Typography>
                            </Grid>

                            <Grid size={{ xs: 6 }} >
                            <Typography>
                                <strong>Workplace:</strong> {job.workPlaceType}
                            </Typography>
                            </Grid>                  
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle1">Description</Typography>
                        <Typography>{job.description}</Typography>

                    </CardContent>
                </Card>
            ))}

        </>
    );
}