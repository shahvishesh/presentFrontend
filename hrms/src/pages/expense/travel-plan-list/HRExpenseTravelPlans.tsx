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
import { getAllTravelPlanByStatus, type TravelPlanResponse } from "../../../api/travel.api";
import { useSearchParams } from "react-router-dom";
import HRExpenseTravelTable from "./HRExpenseTravelTable";
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


interface Props {
  onClick: (travel: TravelPlanResponse) => void;
  actionLabel?: string;
  pageTitle: string;
}

export default function HRExpenseTravelPlans({ onClick, actionLabel, pageTitle }: Props) {
  //const [tab, setTab] = useState(0);
  const [travels, setTravels] = useState<TravelPlanResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const statusMap = ["ACTIVE", "COMPLETED"];
  const tab = Number(searchParams.get("tab") || 0);
  const safeTab = Number.isFinite(tab) && tab >= 0 && tab < statusMap.length ? tab : 0;

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setSearchParams({ tab: String(newValue) });
  };

  // const handleChange = (_: React.SyntheticEvent, newValue: number) => {
  //   setTab(newValue);
  // };

  useEffect(() => {
    if (!searchParams.get("tab") || safeTab !== tab) {
      setSearchParams({ tab: "0" });
    }
  }, []);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        setLoading(true);

        const data = await getAllTravelPlanByStatus(statusMap[safeTab]);

        setTravels(data);
      } catch {
        toast.error("Failed to load travel plans");
      } finally {
        setLoading(false);
      }
    };

    fetchTravels();
  }, [safeTab]);

  return (
    <Box sx={pageRootSx}>
      <Paper variant="outlined" sx={pageHeaderPaperSx}>
        <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
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
              {pageTitle}
            </Typography>
          </Stack>
        </Stack>

        <Box sx={pageTabsStripSx}>
          <Tabs
            value={safeTab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={pageTabsSx}
          >
            <Tab label="Active" />
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
          <HRExpenseTravelTable
            onClick={onClick}
            actionLabel={actionLabel}
            travels={travels}
          />
        )}
      </Paper>
    </Box>
  );
}