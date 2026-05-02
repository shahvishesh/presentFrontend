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
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getGameTabs, type GameTabType, type SlotResponse } from "../../../api/slot.api";
import SlotGrid from "./SlotGrid";
import {
  pageCenteredStateSx,
  pageEmptyStateSubtitleSx,
  pageEmptyStateTitleSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
  pageStateSubtitleSx,
  pageScrollableAreaSx,
  pageScrollableContentPaperSx,
  pageTabsStripSx,
  pageTabsSx,
} from "../../../components/page/pageStyles";



interface Props {
  fetchSlots: (gameId: number) => Promise<SlotResponse[]>;
  buttonText?: string;
  onAction?: (slot: SlotResponse) => void;
  refreshKey?: number;
  headerSubtitle?: string;
}

export default function GameType({
  fetchSlots,
  buttonText,
  onAction,
  refreshKey,
  headerSubtitle = "Browse available slots by game type.",
}: Props) {
  const [tabs, setTabs] = useState<GameTabType[]>([]);
  const [slots, setSlots] = useState<SlotResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTabParam = searchParams.get("gameId");
const selectedTab = selectedTabParam ? Number(selectedTabParam) : null;

  // useEffect(() => {
  //   const fetchTabs = async () => {
  //     try {
  //       const data = await getGameTabs();
  //       setTabs(data);

  //       if (data.length > 0 && !searchParams.get("gameId")) {
  //         setSearchParams({ gameId: String(data[0].value) });
  //       }
  //     } catch {
  //       toast.error("Failed to load game tabs");
  //     }
  //   };

  //   fetchTabs();
  // }, [searchParams, setSearchParams]);

  // 2. Handle default tab separately

useEffect(() => {
  const fetchTabs = async () => {
    try {
      const data = await getGameTabs();
      setTabs(data);
    } catch {
      toast.error("Failed to load game tabs");
    }
  };

  fetchTabs();
}, []);

  useEffect(() => {
  if (tabs.length > 0 && !searchParams.get("gameId")) {
    setSearchParams({ gameId: String(tabs[0].value) });
  }
}, [tabs]);

  useEffect(() => {
    if (!selectedTab) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await fetchSlots(selectedTab);
        setSlots(data);
      } catch {
        toast.error("Failed to load slots");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab, fetchSlots, refreshKey]);

  const handleChange = (_: React.SyntheticEvent, value: number) => {
    setSearchParams({ gameId: String(value) });
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
        <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
          <Stack spacing={0.25}>
            <Typography variant="h5" sx={pageHeaderTitleSx}>
              Game Slots
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {headerSubtitle}
            </Typography>
          </Stack>
        </Stack>

        <Box sx={pageTabsStripSx}>
          <Tabs
            value={selectedTab || false}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={pageTabsSx}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
              />
            ))}
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
                Loading slots...
              </Typography>
            </Box>
          ) : slots.length === 0 ? (
            <Box sx={pageCenteredStateSx}>
              <Typography sx={pageEmptyStateTitleSx}>No slots available</Typography>
              <Typography variant="body2" color="text.secondary" sx={pageEmptyStateSubtitleSx}>
                Try switching tabs to check other game types.
              </Typography>
            </Box>
          ) : (
            <SlotGrid
              slots={slots}
              buttonText={buttonText}
              onAction={onAction}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
}