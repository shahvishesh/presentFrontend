import { Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { formatDateToDDMMYYYY } from "../../utils/dateFormat";

type SlotCardProps = {
    slotId: number,
    date: string;
    startTime: string;
    endTime: string;
    maxPlayers: number;
    gameName: string;
    buttonText?: string;
    closingTime?: string;
    bookedBy?: string;
    onClick?: () => void;
}

export default function SlotCard(
    {
        date,
        startTime,
        endTime,
        maxPlayers,
        gameName,
        buttonText,
        closingTime,
        bookedBy,
        onClick,
    }: SlotCardProps
){
    return(
        <>
        <Grid size={{ xs: 12, sm: 4 }}>

        <Card
            variant="outlined"
            sx={{
                cursor: "pointer",
                textAlign: "center",
                boxShadow: 1,
                borderColor: "divider",
                height: "100%",
            }}
            >
            <CardContent>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={1.5}
              >

                <Typography variant="h6" fontWeight={600}>
                    {gameName}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                    Date: {formatDateToDDMMYYYY(date)}
                </Typography>
                <Typography variant="body2">
                    Timing: {startTime} - {endTime}
                </Typography>
                <Typography variant="body2">
                Max players: {maxPlayers}
                </Typography>
                {closingTime && (
                    <Typography variant="body2">
                        Registrations close at: {closingTime}
                    </Typography>
                )}
                {bookedBy && (
                    <Typography variant="body2" style={{color:"gray"}}>
                        Booked by: {bookedBy}
                    </Typography>
                )}
                {buttonText && (
                    <Button onClick={onClick} variant="outlined" sx={{ mt: 1 }}>
                        {buttonText}
                    </Button>
                )

                }
              </Stack>
            </CardContent>
        </Card>
        </Grid>
        </>
    )
}