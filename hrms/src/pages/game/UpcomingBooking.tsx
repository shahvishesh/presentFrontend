import { useEffect, useState } from "react"
import { cancelRegistrationOrBooking, getActiveSlotRegistrations, getUpcomingBooking, type SlotRegistrationResponse, type SlotResponse } from "../../api/slot.api"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Stack, Typography } from "@mui/material";
import SlotCard from "./SlotCard";

export default function UpcomingBooking(){

    const[slots, setSlots] = useState<SlotResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getUpcomingBooking()
            .then((data) => setSlots(data))
            .catch(() => toast.error("Failed to load bookings"));
    }, [])

    const handleCancel = async (slotId: number) => {
      const confirmDelete = window.confirm("Are you sure you want to cancel this booking?");
      if (!confirmDelete) return;
    
      try {
        await cancelRegistrationOrBooking(slotId);
    
        setSlots((prev) => prev.filter((slot) => slot.slotId !== slotId));
    
        toast.success("Booking cancelled");
      } catch {
        toast.error("Failed to cancel booking");
      }
    };

    return(
        <>
        <Box sx={{ mx: "auto", mt: 4 }}>
            <Button sx={{mb: 2}} variant="outlined" onClick={() =>navigate(-1)}>
                Back
            </Button>
            <Typography variant="h5" mb={3}>
                Upcoming bookings
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
                            buttonText="Cancel Booking"
                            {...slot}
                            onClick={() => handleCancel(slot.slotId)}
                        />
                        
                    ))}

                {slots.length === 0 && 
                    <Typography>
                        No upcoming bookings found
                    </Typography>}
             </Stack>
        </Box>

        </>
    )
}