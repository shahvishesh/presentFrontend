import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBookings, type BookingStatus, type SlotResponse } from "../../api/slot.api";
import SlotGrid from "./game-tabs/SlotGrid";
import {
  pageCenteredStateSx,
  pageEmptyStateSubtitleSx,
  pageEmptyStateTitleSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
  pageScrollableAreaSx,
  pageScrollableContentPaperSx,
  pageStateSubtitleSx,
  pageTabsStripSx,
  pageTabsSx,
} from "../../components/page/pageStyles";



export default function BookingPage() {
  const [slots, setSlots] = useState<SlotResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

const statusParam = searchParams.get("status");

const validStatuses: BookingStatus[] = [
  "UPCOMING",
  "CANCELLED",
  "COMPLETED",
];

const status: BookingStatus = validStatuses.includes(
  statusParam as BookingStatus
)
  ? (statusParam as BookingStatus)
  : "UPCOMING";

useEffect(() => {
  if (!statusParam || !validStatuses.includes(statusParam as BookingStatus)) {
    setSearchParams({ status: "UPCOMING" });
  }
}, [statusParam]);

  // Fetch bookings
  useEffect(() => {
    if (!status) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getBookings(status);
        setSlots(data);
      } catch {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  const handleTabChange = (_: React.SyntheticEvent, value: BookingStatus) => {
    setSearchParams({ status: value });
  };

  const getTitle = () => {
    switch (status) {
      case "UPCOMING":
        return "Upcoming bookings";
      case "CANCELLED":
        return "Cancelled bookings";
      case "COMPLETED":
        return "Completed bookings";
      default:
        return "Bookings";
    }
  };

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
        <Stack spacing={1.5} alignItems="flex-start" sx={pageHeaderStackSx}>
          {/* <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button> */}
          <Stack spacing={0.25}>
            <Typography variant="h5" sx={pageHeaderTitleSx}>
              {getTitle()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your bookings by status.
            </Typography>
          </Stack>
        </Stack>

        <Box sx={pageTabsStripSx}>
          <Tabs
            value={status}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={pageTabsSx}
          >
            <Tab label="Upcoming" value="UPCOMING" />
            <Tab label="Cancelled" value="CANCELLED" />
            <Tab label="Completed" value="COMPLETED" />
          </Tabs>
        </Box>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          ...pageScrollableContentPaperSx,
          flex: 1,
          mb: 0,
        }}
      >
        <Box sx={{ ...pageScrollableAreaSx, p: { xs: 2, sm: 2.5 } }}>
          {loading ? (
            <Box sx={pageCenteredStateSx}>
              <CircularProgress size={28} />
              <Typography variant="body2" color="text.secondary" sx={pageStateSubtitleSx}>
                Loading bookings...
              </Typography>
            </Box>
          ) : slots.length === 0 ? (
            <Box sx={pageCenteredStateSx}>
              <Typography sx={pageEmptyStateTitleSx}>No bookings found</Typography>
              <Typography variant="body2" color="text.secondary" sx={pageEmptyStateSubtitleSx}>
                Try a different status tab to view other bookings.
              </Typography>
            </Box>
          ) : (
            <SlotGrid
              slots={slots}
              buttonText="View Details"
              showClosingTime={false}
              onAction={(slot) =>
                navigate(`/dashboard/game/slot/detail/${slot.slotId}?status=${status}`)
              }
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
}