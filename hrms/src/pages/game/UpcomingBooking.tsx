import { useEffect, useState } from "react"
import { getUpcomingBooking, type SlotResponse } from "../../api/slot.api"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import SlotCard from "./SlotCard";
import {
    pageCenteredStateSx,
    pageDividerSx,
    pageEmptyStateSubtitleSx,
    pageEmptyStateTitleSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
    pageSectionPaperSx,
} from "../../components/page/pageStyles";

export default function UpcomingBooking(){

    const[slots, setSlots] = useState<SlotResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getUpcomingBooking()
            .then((data) => setSlots(data))
            .catch(() => toast.error("Failed to load bookings"));
    }, [])

    return(
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageSectionPaperSx}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={pageHeaderStackSx}
                >
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Upcoming Bookings
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            View your confirmed bookings and open slot details.
                        </Typography>
                    </Stack>

                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Stack>

                <Divider sx={pageDividerSx} />

                {slots.length === 0 ? (
                    <Box sx={pageCenteredStateSx}>
                        <Typography variant="h6" sx={pageEmptyStateTitleSx}>
                            No upcoming bookings found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={pageEmptyStateSubtitleSx}>
                            Any new bookings you make will appear here.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2} sx={{ alignContent: "flex-start" }}>
                        {slots.map((slot) => (
                            <SlotCard
                                key={slot.slotId}
                                {...slot}
                                buttonText="View Details"
                                onClick={() => navigate(`/dashboard/game/slot/detail/${slot.slotId}`)}
                            />
                        ))}
                    </Grid>
                )}
            </Paper>
        </Box>
    )
}