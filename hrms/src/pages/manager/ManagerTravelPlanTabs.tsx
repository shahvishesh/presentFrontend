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
import ManagerTravelTable from "./ManagerTravelTable";
import { getTravelPlanByEmployeeIdAndStatus, type TravelPlanResponse } from "../../api/travel.api";
import {
  pageCenteredStateSx,
  pageContentPaperSx,
  pageEmptyStateSubtitleSx,
  pageEmptyStateTitleSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageStateSubtitleSx,
  pageTabsStripSx,
  pageTabsSx,
} from "../../components/page/pageStyles";

type ManagerTravelPlanTabProps = {
    employeeId: number;
}

export default function ManagerTravelPlanTabs({employeeId}: ManagerTravelPlanTabProps) {
  const [tab, setTab] = useState(0);
  const [travels, setTravels] = useState<TravelPlanResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const statusMap = ["ACTIVE", "DRAFT", "COMPLETED"];

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        setLoading(true);

        const data = await getTravelPlanByEmployeeIdAndStatus(employeeId, statusMap[tab]);

        setTravels(data);
      } catch {
        toast.error("Failed to load travel plans");
      } finally {
        setLoading(false);
      }
    };

    fetchTravels();
  }, [tab, employeeId]);

  return (
    <Box>
      <Paper variant="outlined" sx={pageHeaderPaperSx}>
        <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
          <Stack spacing={0.25}>
          <Typography variant="h5" sx={pageHeaderTitleSx}>Travel Plans</Typography>
          <Typography variant="body2" color="text.secondary">
                            Employee's travels.
                        </Typography>
          </Stack>
        </Stack>

        <Box sx={pageTabsStripSx}>
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

      <Paper variant="outlined" sx={pageContentPaperSx}>
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
          <ManagerTravelTable employeeId={employeeId} travels={travels} />
        )}
      </Paper>
    </Box>
  );
}