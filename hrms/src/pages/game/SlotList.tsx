import { useEffect, useState } from "react";
import { getSlots, type SlotResponse } from "../../api/slot.api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import SlotCard from "./SlotCard";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

export default function SlotList(){
    const [slots, setSlots] = useState<SlotResponse[]>([]);
    const { gameId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getSlots(Number(gameId))
        .then((data) => setSlots(data))
        .catch(() => toast.error("Error loading slots"));
    }, []);

    return(
        <>
        <Box sx={{ mx: "auto", mt: 4 }}>
            <Button sx={{mb: 2}} variant="outlined" onClick={() =>navigate(-1)}>
                Back
            </Button>
            <Typography variant="h5" mb={3}>
                Register slot
            </Typography>
        

                <Grid container spacing={2}>

                {slots.map((slot, index) => (

                        <SlotCard
                            key={slot.slotId}
                            {...slot}
                            buttonText="Register"
                            closingTime={dayjs(slot.startTime, "HH:mm:ss")
                                .subtract(1, "hour")
                                .format("HH:mm:ss")}
                            onClick={() => navigate(`/dashboard/game/slot/${slot.slotId}`)}
                        />
                        
                    ))}

                {slots.length === 0 && 
                    <Typography>
                        No slots found
                    </Typography>}
                </Grid>
        </Box>

        </>
    )
}