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
import { getReferrralByJobId, type ViewReferralResponse } from "../../api/job.api";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { openCVFile } from "../../api/file.api";
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

export default function JobReferral() {
  const { jobId } = useParams();

  const [referrals, setReferrals] = useState<ViewReferralResponse[]>();

  useEffect(() => {
    getReferrralByJobId(Number(jobId))
      .then((data) => {
        setReferrals(data);
      })
      .catch(() => toast.error("Failed to load referrals"));
  }, [jobId]);

  return (
    <Box sx={pageRootSx}>
      <Paper variant="outlined" sx={{ ...pageHeaderPaperSx, pb: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={0.25}>
          <Typography variant="h5" sx={pageHeaderTitleSx}>
            Referrals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review employee referrals and open submitted CVs.
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
        <TableContainer component={Box} sx={dataTableContainerSx}>
          <Table aria-label="job referrals table">
            <TableHead>
              <TableRow sx={dataTableHeadRowSx}>
              <TableCell>Referrer</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Reference name</TableCell>
              <TableCell>Reference email</TableCell>
              <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {referrals?.map((referral) => (
                <TableRow key={referral.id} hover>
                  <TableCell sx={dataTablePrimaryCellSx}>{referral.employeeName}</TableCell>
                  <TableCell>{referral.comment ? referral.comment : "-"}</TableCell>
                <TableCell>{referral.friendName}</TableCell>
                <TableCell>
                  {referral.friendEmail ? referral.friendEmail : "-"}
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                    <Button size="small" onClick={() => openCVFile(referral.id)} variant="contained">
                        View Referral
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {referrals?.length === 0 && (
              <TableRow key="no-referralss">
                <TableCell colSpan={5} align="center" sx={dataTableEmptyStateCellSx}>
                  No referrals found
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