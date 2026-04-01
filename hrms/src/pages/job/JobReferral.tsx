import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllJobs, getReferrralByJobId, type JobResponse, type ViewReferralResponse } from "../../api/job.api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { openCVFile } from "../../api/file.api";

export default function JobReferral(){

    const navigate = useNavigate();
    const { jobId } = useParams();

    const [referrals, setReferrals] = useState<ViewReferralResponse[]>();

    useEffect(() => {
        getReferrralByJobId(Number(jobId))
            .then((data) => {
                setReferrals(data);
            })
            .catch(() => toast.error("Failed to load referrals"))
    },[]);

    return(
        <Box>
      <Typography variant="h6" mb={2}>
        Referrals
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Referrer</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Reference name</TableCell>
              <TableCell>Reference email</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {referrals?.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>{referral.employeeName}</TableCell>
                <TableCell>{(referral.comment) ? referral.comment : '-'}</TableCell>
                <TableCell>{referral.friendName}</TableCell>
                <TableCell>
                    {(referral.friendEmail) ? referral.friendEmail : '-'}
                </TableCell>

                <TableCell align="center">
                  <Button onClick={() => openCVFile(referral.id)} variant="contained">
                        View Referral
                    </Button>
                </TableCell>
              </TableRow>
            ))}

            {referrals?.length === 0 && (
              <TableRow key="no-referralss">
                <TableCell colSpan={6} align="center">
                  No referrals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    )
}