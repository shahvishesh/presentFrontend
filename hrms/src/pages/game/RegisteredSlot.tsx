import { useEffect, useState } from "react"
import { cancelRegistrationOrBooking, getActiveSlotRegistrations, type SlotRegistrationResponse } from "../../api/slot.api"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import SlotCard from "./SlotCard";

export default function RegisteredSlot(){

    const[slotRegistrations, setSlotRegistrations] = useState<SlotRegistrationResponse[]>([]);
    const {gameId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getActiveSlotRegistrations(Number(gameId))
            .then((data) => setSlotRegistrations(data))
            .catch(() => toast.error("Failed to load registrations"));
    }, [])

    const handleCancel = async (slotId: number) => {
      const confirmDelete = window.confirm("Are you sure you want to cancel this registraion?");
      if (!confirmDelete) return;
    
      try {
        await cancelRegistrationOrBooking(slotId);
    
        setSlotRegistrations((prev) => prev.filter((slot) => slot.slotId !== slotId));
    
        toast.success("Registration cancelled");
      } catch {
        toast.error("Failed to cancel registration");
      }
    };

    return(
        <>
        <Box sx={{ mx: "auto", mt: 4 }}>
            <Button sx={{mb: 2}} variant="outlined" onClick={() =>navigate(-1)}>
                Back
            </Button>
            <Typography variant="h5" mb={3}>
                Registered slots of today
            </Typography>
        

                <Grid container spacing={2}>

                {slotRegistrations.map((slot, index) => (

                        <SlotCard
                            key={slot.slotId}
                            buttonText="Cancel Registration"
                            {...slot}
                            onClick={() => handleCancel(slot.slotId)}
                        />
                        
                    ))}

                {slotRegistrations.length === 0 && 
                    <Typography>
                        No active registrations found
                    </Typography>}
                </Grid>

        </Box>

        </>
    )
}