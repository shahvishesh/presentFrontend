import { Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById, type JobResponse } from "../../api/job.api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReferFriendDialog from "./ReferFriendDialog";
import ShareJobDialog from "./ShareJobDialog";


export default function JobDetails(){
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState<JobResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [openReferral, setOpenReferral] = useState(false);
    const [openShareJob, setopenShareJob] = useState(false);

    const jobIdNum = Number(jobId);

    useEffect(() => {
         getJobById(Number(jobIdNum))
            .then((data) => { setJob(data)})
            .catch(() => toast.error("Failed to load job details"))
            .finally(() => setLoading(false));
    }, [jobIdNum]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!job) {
        return <Typography>No job found</Typography>;
    }


    return (
        <Box>
            <Button
                onClick={() => navigate("/dashboard/job/list")}
                >
                Back
            </Button>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                <Typography variant="h5">{job.title}</Typography>
                <Typography color="text.secondary" mb={2}>
                    {job.companyName} • {job.location}
                </Typography>

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

                <Divider sx={{ my: 2}}/>
                <Box display="flex" justifyContent="space-between" mb={2}>
                            <Button 
                            variant="outlined"
                            onClick={(e) => {   
                                e.currentTarget.blur();
                                setopenShareJob(true)
                            }}>
                            Share job
                            </Button>

                            <Button
                            variant="contained"
                            onClick={(e) => {
                                e.currentTarget.blur();
                                setOpenReferral(true)
                            }}
                            >
                            Give a Referral
                            </Button>
                        </Box>
                 </CardContent>
            </Card>

            <ReferFriendDialog
                open={openReferral}
                onClose={() => setOpenReferral(false)}
                jobId={jobIdNum}
            />

            <ShareJobDialog
                open={openShareJob}
                onClose={() => setopenShareJob(false)}
                jobId={jobIdNum}
            />

        </Box>
    )
}