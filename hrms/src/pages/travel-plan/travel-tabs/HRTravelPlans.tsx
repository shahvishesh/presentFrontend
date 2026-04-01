import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Typography,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  deleteTravelPlan,
  getAllTravelPlanByStatus,
  type TravelPlanResponse,
} from "../../../api/travel.api";
import HRTravelTable from "./HRTravelTable";
import { useSearchParams } from "react-router-dom";
import {
  pageCenteredStateSx,
  pageContentPaperSx,
  pageEmptyStateSubtitleSx,
  pageEmptyStateTitleSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
  pageStateSubtitleSx,
  pageTabsStripSx,
  pageTabsSx,
} from "../../../components/page/pageStyles";

export default function HRTravelPlans() {
  const [travels, setTravels] = useState<TravelPlanResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = Number(searchParams.get("tab") || 0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setSearchParams({ tab: String(newValue) });
  };

  const statusMap = ["ACTIVE", "DRAFT", "COMPLETED"];

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "0" });
    }
  }, []);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        setLoading(true);

        const data = await getAllTravelPlanByStatus(statusMap[tab]);

        setTravels(data);
      } catch {
        toast.error("Failed to load travel plans");
      } finally {
        setLoading(false);
      }
    };

    fetchTravels();
  }, [tab]);

  const handleDelete = async (id: number) => {
    try {
      await deleteTravelPlan(id);

      setTravels((prev) => prev.filter((plan) => plan.travelPlanId !== id));

      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <Box sx={pageRootSx}>
      <Paper
        variant="outlined"
        sx={pageHeaderPaperSx}
      >
        <Stack
          spacing={1}
          alignItems="flex-start"
          sx={pageHeaderStackSx}
        >
          {/* <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            size="small"
            sx={{ alignSelf: "flex-start" }}
          >
            Back
          </Button> */}

          <Stack spacing={0.25}>
            <Typography variant="h5" sx={pageHeaderTitleSx}>
              Manage Travel Plans
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View, update, and delete travel plans by status.
            </Typography>
          </Stack>
        </Stack>

        <Box
          sx={pageTabsStripSx}
        >
          <Tabs
            value={tab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={pageTabsSx}
          >
            <Tab label="Active" />
            <Tab label="Upcoming" />
            <Tab label="Completed" />
          </Tabs>
        </Box>
      </Paper>

      <Paper
        variant="outlined"
        sx={pageContentPaperSx}
      >
        {loading ? (
          <Box sx={pageCenteredStateSx}>
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary" sx={pageStateSubtitleSx}>
              Loading travel plans…
            </Typography>
          </Box>
        ) : travels.length === 0 ? (
          <Box sx={pageCenteredStateSx}>
            <Typography sx={pageEmptyStateTitleSx}>No travel plans found</Typography>
            <Typography variant="body2" color="text.secondary" sx={pageEmptyStateSubtitleSx}>
              Try switching tabs to view other statuses.
            </Typography>
          </Box>
        ) : (
          <HRTravelTable onDelete={handleDelete} travelPlans={travels} />
        )}
      </Paper>
    </Box>
  );
}