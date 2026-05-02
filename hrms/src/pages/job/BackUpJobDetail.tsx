import { Box, Button, CircularProgress, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { getJobWithJdById, type JobResponseWithJd } from "../../api/job.api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReferFriendDialog from "./ReferFriendDialog";
import ShareJobDialog from "./ShareJobDialog";
import { openJDFile } from "../../api/file.api";
import {
    pageCenteredStateSx,
    pageContentPaperSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";


export default function JobDetails() {
    const { jobId } = useParams();

    const [job, setJob] = useState<JobResponseWithJd | null>(null);
    const [loading, setLoading] = useState(true);
    const [openReferral, setOpenReferral] = useState(false);
    const [openShareJob, setopenShareJob] = useState(false);

    const jobIdNum = Number(jobId);

    useEffect(() => {
        getJobWithJdById(Number(jobIdNum))
            .then((data) => {
                setJob(data);
            })
            .catch(() => toast.error("Failed to load job details"))
            .finally(() => setLoading(false));
    }, [jobIdNum]);

    if (loading) {
        return (
            <Box sx={pageRootSx}>
                <Paper variant="outlined" sx={pageContentPaperSx}>
                    <Box sx={pageCenteredStateSx}>
                        <CircularProgress />
                    </Box>
                </Paper>
            </Box>
        );
    }

    if (!job) {
        return (
            <Box sx={pageRootSx}>
                <Paper variant="outlined" sx={pageContentPaperSx}>
                    <Box sx={pageCenteredStateSx}>
                        <Typography variant="h6">No job found</Typography>
                    </Box>
                </Paper>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                ...pageRootSx,
                height: "calc(100vh - 134px)",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
            }}
        >
            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                    {/* <Button variant="outlined" size="small" onClick={() => navigate("/dashboard/job/list")}>
                        Back
                    </Button> */}
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            {job.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {job.companyName} • {job.location}
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            <Paper
                variant="outlined"
                sx={{
                    ...pageContentPaperSx,
                    flex: 1,
                    mb: 0,
                    display: "flex",
                }}
            >
                <Box
                    sx={{
                        p: { xs: 2, sm: 2.5 },
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography>
                                <strong>Experience:</strong> {job.minExperience} - {job.maxExperience} years
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography>
                                <strong>Job Type:</strong> {job.jobType}
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography>
                                <strong>Workplace:</strong> {job.workPlaceType}
                            </Typography>
                        </Grid>

                        {job.jdId && (
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Button onClick={() => openJDFile(job.jdId)} variant="contained">
                                    View Job Description
                                </Button>
                            </Grid>
                        )}
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                        <Typography variant="subtitle1">Description</Typography>
                        <Box
                            sx={{
                                mt: 0.75,
                                p: 1.25,
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 1,
                                flex: 1,
                                minHeight: 120,
                                maxHeight: 260,
                                overflowX: "auto",
                                overflowY: "auto",
                            }}
                        >
                            <Typography sx={{ whiteSpace: "pre-wrap" }}>{job.description}</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="space-between" mb={2} gap={1.5} flexWrap="wrap">
                        <Button
                            variant="outlined"
                            onClick={(e) => {   
                                e.currentTarget.blur();
                                setopenShareJob(true);
                            }}
                        >
                            Share job
                        </Button>

                        <Button
                            variant="contained"
                            onClick={(e) => {
                                e.currentTarget.blur();
                                setOpenReferral(true);
                            }}
                        >
                            Give a Referral
                        </Button>
                    </Box>
                </Box>
            </Paper>

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
    );
}