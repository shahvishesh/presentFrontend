import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllJobs, type JobResponse } from "../../api/job.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  dataTableActionsStackSx,
  dataTableContainerSx,
  dataTableEmptyStateCellSx,
  dataTableHeadRowSx,
  dataTablePrimaryCellSx,
} from "../../components/table/tableStyles";
import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderTitleSx,
  pageRootSx,
} from "../../components/page/pageStyles";

export default function ReferralJobsList() {

  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobResponse[] | null>(null);

  useEffect(() => {
    getAllJobs()
      .then((data) => {
        setJobs(data);
      })
      .catch(() => toast.error("Failed to load jobs"));
  }, []);

  return (
    <Box sx={pageRootSx}>
      <Paper variant="outlined" sx={{ ...pageHeaderPaperSx, pb: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={0.25}>
          <Typography variant="h5" sx={pageHeaderTitleSx}>
            Open Jobs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse active jobs and view referral details.
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
        <TableContainer component={Box} sx={dataTableContainerSx}>
          <Table aria-label="referral jobs table">
            <TableHead>
              <TableRow sx={dataTableHeadRowSx}>
                <TableCell>Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Job Type</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {jobs?.map((job) => (
                <TableRow key={job.id} hover>
                  <TableCell sx={dataTablePrimaryCellSx}>{job.title}</TableCell>
                  <TableCell>{job.companyName}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    {job.minExperience} - {job.maxExperience} yrs
                  </TableCell>
                  <TableCell>{job.jobType}</TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/dashboard/job/referral/${job.id}`)}
                      >
                        View Referrals
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {jobs?.length === 0 && (
                <TableRow key="no-jobs">
                  <TableCell colSpan={6} align="center" sx={dataTableEmptyStateCellSx}>
                    No jobs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}