import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllJobs, type JobResponse } from "../../api/job.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ReferralJobsList(){

    const navigate = useNavigate();
    const [jobs, setJobs] = useState<JobResponse[] | null>(null);

    useEffect(() => {
        getAllJobs()
            .then((data) => {
                setJobs(data);
            })
            .catch(() => toast.error("Failed to load jobs"))
    },[]);

    return(
        <Box>
      <Typography variant="h6" mb={2}>
        Open jobs
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  {job.minExperience} - {job.maxExperience} yrs
                </TableCell>
                <TableCell>{job.jobType}</TableCell>

                <TableCell align="center">
                  <Button onClick={() => navigate(`/dashboard/job/referral/${job.id}`)} variant="contained">
                    View Referrals
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {jobs?.length === 0 && (
              <TableRow key="no-jobs">
                <TableCell colSpan={6} align="center">
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    )
}