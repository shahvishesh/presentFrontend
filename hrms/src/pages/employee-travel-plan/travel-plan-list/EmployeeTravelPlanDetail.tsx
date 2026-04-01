import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Chip,
  Avatar,
  CircularProgress,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  getTravelPlanDetailByid,
  type TravelPlanDetail,
} from "../../../api/travel.api";
import { getCommonTravelDocuments, type TravelDocumentResponse } from "../../../api/document.api";
import { openDocumentFileE } from "../../../api/file.api";
import {
  dataTableActionsStackSx,
  dataTableContainerSx,
  dataTableEmptyStateCellSx,
  dataTableHeadRowSx,
  dataTablePrimaryCellSx,
} from "../../../components/table/tableStyles";
import {
  pageContentPaperSx,
  pageDividerSx,
  pageHeaderPaperSx,
  pageHeaderTitleSx,
  pageRootSx,
  pageSectionPaperSx,
} from "../../../components/page/pageStyles";

export default function EmployeeTravelPlanDetail() {
  const { travelPlanId } = useParams();

  const [travel, setTravel] = useState<TravelPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const[documents, setDocuments] = useState<TravelDocumentResponse[]>([]);
  

  useEffect(() => {
    if (!travelPlanId) return;

    const fetchTravel = async () => {
      try {
        const data = await getTravelPlanDetailByid(Number(travelPlanId));
        setTravel(data);
      } catch {
        toast.error("Failed to load travel details");
      } finally {
        setLoading(false);
      }
    };

    fetchTravel();
  }, [travelPlanId]);

  useEffect(() => {
    if (!travelPlanId) return;

    getCommonTravelDocuments(Number(travelPlanId))
      .then((data) => setDocuments(data))
      .catch(() => toast.error("Failed to load documents"));
  }, [travelPlanId]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!travel) return null;

  return (
    <Box sx={pageRootSx}>
      {/* Back Button */}
      {/* <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button> */}

      <Paper variant="outlined" sx={pageSectionPaperSx}>
        <Typography variant="h5" sx={pageHeaderTitleSx}>
          {travel.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Created At: {new Date(travel.createdAt).toLocaleString()}
        </Typography>

        <Divider sx={pageDividerSx} />

        <Typography>{travel.description}</Typography>

        <Divider sx={pageDividerSx} />

        <Stack spacing={0.75}>
          <Typography>
            <strong>Source:</strong> {travel.sourceLocation}
          </Typography>

          <Typography>
            <strong>Destination:</strong> {travel.destinationLocation}
          </Typography>

          <Typography>
            <strong>Start Date:</strong> {new Date(travel.startDate).toLocaleDateString()}
          </Typography>

          <Typography>
            <strong>End Date:</strong> {new Date(travel.endDate).toLocaleDateString()}
          </Typography>

          <Typography component="div">
            <strong>Status:</strong> <Chip label={travel.status} size="small" />
          </Typography>

          <Typography>
            <strong>International Travel:</strong> {travel.isInternational ? "Yes" : "No"}
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ ...pageHeaderPaperSx, pb: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={0.25}>
          <Typography variant="h5" sx={pageHeaderTitleSx}>
            Participants
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View all participants.
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          {travel.participants.length === 0 ? (
            <Typography color="text.secondary">No participants added</Typography>
          ) : (
            <Stack divider={<Divider flexItem />} spacing={0}>
              {travel.participants.map((emp) => (
                <Box key={emp.id} sx={{ py: 1.5 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{emp.firstName.charAt(0)}</Avatar>
                    <Box>
                      <Typography fontWeight={600}>
                        {emp.firstName} {emp.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {emp.designation} • {emp.department}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ ...pageHeaderPaperSx, pb: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={0.25}>
          <Typography variant="h5" sx={pageHeaderTitleSx}>
            General Documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View uploaded documents.
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
        <TableContainer component={Box} sx={dataTableContainerSx}>
          <Table aria-label="general documents table">
            <TableHead>
              <TableRow sx={dataTableHeadRowSx}>
                <TableCell>Name</TableCell>
                <TableCell>Uploaded by</TableCell>
                <TableCell>Owner type</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {documents?.map((doc) => (
                <TableRow key={doc.travelDocumentId} hover>
                  <TableCell sx={dataTablePrimaryCellSx}>{doc.documentTypeName}</TableCell>
                  <TableCell>{doc.uploadedByName}</TableCell>
                  <TableCell>{doc.uploadedByRole}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                      <Button
                        onClick={() => openDocumentFileE(doc.travelDocumentId)}
                        variant="contained"
                        size="small"
                      >
                        View Document
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {documents?.length === 0 && (
                <TableRow key="no-documents">
                  <TableCell colSpan={4} align="center" sx={dataTableEmptyStateCellSx}>
                    No Documents found
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