import {
  Box,
  Button,
  Chip,
  Divider,
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
import type { BookingStatus, SlotDetailDto } from "../../api/slot.api";
import {
  dataTableContainerSx,
  dataTableEmptyStateCellSx,
  dataTableHeadRowSx,
  dataTablePrimaryCellSx,
} from "../../components/table/tableStyles";
import {
  pageContentPaperSx,
  pageDividerSx,
  pageHeaderPaperSx,
  pageHeaderTitleSx,
  pageRootSx,
  pageSectionPaperSx,
} from "../../components/page/pageStyles";
import { useUser } from "../../context/useUser";

type SlotDetailCardProps = {
  slot: SlotDetailDto;
  bookingStatus?: BookingStatus;
  onCancel?: (slotId: number) => void;
  onBack?: () => void;
};

const formatBookingStatus = (status: BookingStatus) => {
  switch (status) {
    case "UPCOMING":
      return "Upcoming";
    case "CANCELLED":
      return "Cancelled";
    case "COMPLETED":
      return "Completed";
    default:
      return status;
  }
};

const getBookingStatusChipColor = (status: BookingStatus): "success" | "error" | "default" => {
  switch (status) {
    case "UPCOMING":
      return "success";
    case "CANCELLED":
      return "error";
    case "COMPLETED":
    default:
      return "default";
  }
};

const formatParticipantStatus = (status: string) => {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getParticipantStatusChipColor = (
  status: string
): "success" | "error" | "warning" | "default" => {
  const normalizedStatus = status.toUpperCase();

  if (["UPCOMING", "ACTIVE", "REGISTERED", "BOOKED", "CONFIRMED"].includes(normalizedStatus)) {
    return "success";
  }

  if (["CANCELLED", "REJECTED", "FAILED"].includes(normalizedStatus)) {
    return "error";
  }

  if (["PENDING", "WAITLISTED"].includes(normalizedStatus)) {
    return "warning";
  }

  return "default";
};

export default function SlotDetailCard({ slot, bookingStatus, onCancel, onBack }: SlotDetailCardProps) {
  const { user } = useUser();
  
  return (
    <Box sx={pageRootSx}>
      <Paper variant="outlined" sx={pageSectionPaperSx}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Stack spacing={0.25}>
            <Typography variant="h5" sx={pageHeaderTitleSx}>
              {slot.gameName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Slot details and participants
            </Typography>
          </Stack>

          {onBack && (
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
          )}
        </Stack>

        <Divider sx={pageDividerSx} />

        <Stack spacing={0.75}>
          <Typography fontWeight={500}>Date: {slot.date}</Typography>
          <Typography variant="body2" color="text.secondary">
            Timing: {slot.startTime} - {slot.endTime}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Max players: {slot.maxPlayers}
          </Typography>
          {bookingStatus && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Booking status:
              </Typography>
              <Chip
                size="small"
                label={formatBookingStatus(bookingStatus)}
                color={getBookingStatusChipColor(bookingStatus)}
                variant="filled"
              />
            </Stack>
          )}
        </Stack>

        {onCancel && (
          <Button
            sx={{ mt: 2 }}
            color="error"
            variant="contained"
            onClick={() => onCancel(slot.slotId)}
          >
            Cancel Booking
          </Button>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ ...pageHeaderPaperSx, mb: 0, pb: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={0.25}>

          <Typography variant="h5" sx={pageHeaderTitleSx}>
            Participants
          </Typography>
          <Typography variant="body2" color="text.secondary">
            People currently associated with this booking.
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
        <TableContainer component={Box} sx={dataTableContainerSx}>
          <Table aria-label="participants table">
            <TableHead>
              <TableRow sx={dataTableHeadRowSx}>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {slot.participants.map((participant) => (
                <TableRow key={participant.employeeId} hover>
                  <TableCell sx={dataTablePrimaryCellSx}>
                    {participant.employeeId === user?.employeeId ? "You" : participant.name}
                  </TableCell>
                  <TableCell>{participant.department}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={formatParticipantStatus(participant.status)}
                      color={getParticipantStatusChipColor(participant.status)}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}

              {slot.participants.length === 0 && (
                <TableRow key="no-participants">
                  <TableCell colSpan={3} align="center" sx={dataTableEmptyStateCellSx}>
                    No participants found
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