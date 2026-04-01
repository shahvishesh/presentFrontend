import { useEffect, useState } from "react"
import { cancelRegistrationOrBooking, getActiveSlotRegistrations, getCompletedBooking, type SlotRegistrationResponse, type SlotResponse } from "../../api/slot.api"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Stack, Typography } from "@mui/material";
import SlotCard from "./SlotCard";

export default function CompletedBooking(){

    const[slots, setSlots] = useState<SlotResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getCompletedBooking()
            .then((data) => setSlots(data))
            .catch(() => toast.error("Failed to bookings"));
    }, [])

    return(
        <>
        <Box sx={{ mx: "auto", mt: 4 }}>
            <Button sx={{mb: 2}} variant="outlined" onClick={() =>navigate(-1)}>
                Back
            </Button>
            <Typography variant="h5" mb={3}>
                Completed slots
            </Typography>
        

            <Stack
               direction="row"
               alignItems="center"
               gap={2}
               sx={{ flexWrap: 'wrap' }}
           >
                {slots.map((slot, index) => (

                        <SlotCard
                            key={slot.slotId}
                            {...slot}
                        />
                        
                    ))}

                {slots.length === 0 && 
                    <Typography>
                        No completed booking found
                    </Typography>}
             </Stack>
        </Box>

        </>
    )
}