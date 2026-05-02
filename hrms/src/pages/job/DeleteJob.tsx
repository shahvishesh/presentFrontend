import { useEffect, useState } from "react";
import { deleteJob, getAllJobs, type JobResponse } from "../../api/job.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    pageContentPaperSx,
    pageDividerSx,
    pageHeaderPaperSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

export default function DeleteJob() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<JobResponse[]>([]);
    const [descriptionDialogJob, setDescriptionDialogJob] = useState<JobResponse | null>(null);

    useEffect(() => {
        getAllJobs()
            .then((data) => {
                setJobs(data);
            })
            .catch(() => toast.error("Failed to load jobs"));
    }, []);

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
    };

    return (
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={{ ...pageHeaderPaperSx, pb: { xs: 2, sm: 2.5 } }}>
                <Stack spacing={0.25}>
                    <Typography variant="h5" sx={pageHeaderTitleSx}>
                        Manage Jobs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Update or close open job postings.
                    </Typography>
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={pageContentPaperSx}>
                <List disablePadding>
                    {jobs.map((job) => (
                        <Box key={job.id}>
                            <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
                                <Stack spacing={1.5}>
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        justifyContent="space-between"
                                        alignItems={{ xs: "flex-start", sm: "center" }}
                                        spacing={1}
                                    >
                                        <Stack spacing={0.5}>
                                            <Typography variant="h6" fontWeight={600}>
                                                {job.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {job.companyName} • {job.location}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={1}>
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
                                                        void handleDelete(job.id);
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>
                                     <Divider sx={pageDividerSx} />
                                    <Grid container spacing={1.25}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Experience
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {job.minExperience} - {job.maxExperience} years
                                            </Typography>
                                        </Grid>

                                        <Grid size={{ xs: 6, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Job Type
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {job.jobType}
                                            </Typography>
                                        </Grid>

                                        <Grid size={{ xs: 6, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Workplace
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {job.workPlaceType}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                     <Divider sx={pageDividerSx} />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            lineHeight: 1.6,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {job.description}
                                    </Typography>
                                    {job.description?.trim() && (
                                        <Box>
                                            <Button
                                                size="small"
                                                sx={{ px: 0, minWidth: "auto" }}
                                                onClick={() => setDescriptionDialogJob(job)}
                                            >
                                                Read more
                                            </Button>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                            <Divider />
                        </Box>
                    ))}

                    {jobs.length === 0 && (
                        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                            <Typography align="center" color="text.secondary">
                                No jobs found
                            </Typography>
                        </Box>
                    )}
                </List>
            </Paper>

            <Dialog
                open={Boolean(descriptionDialogJob)}
                onClose={() => setDescriptionDialogJob(null)}
                fullWidth
                maxWidth="sm"
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                    },
                }}
            >
                <DialogTitle sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 1.75, sm: 2 } }}>
                    <Stack spacing={0.5}>
                        <Typography variant="h6" fontWeight={700}>
                            {descriptionDialogJob?.title ?? "Job Description"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {descriptionDialogJob
                                ? `${descriptionDialogJob.companyName} • ${descriptionDialogJob.location}`
                                : "Job details"}
                        </Typography>
                    </Stack>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 2, sm: 2.5 } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                        {descriptionDialogJob?.description || "No description available."}
                    </Typography>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: { xs: 2, sm: 2.5 }, py: 1.5 }}>
                    <Button variant="contained" onClick={() => setDescriptionDialogJob(null)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}