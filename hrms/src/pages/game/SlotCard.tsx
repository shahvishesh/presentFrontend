import { Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

type SlotCardProps = {
    slotId: number,
    date: string;
    startTime: string;
    endTime: string;
    maxPlayers: number;
    gameName: string;
    buttonText?: string;
    closingTime?: string;
    onClick?: () => void;
}

export default function SlotCard(
    {
        slotId,
        date,
        startTime,
        endTime,
        maxPlayers,
        gameName,
        buttonText,
        closingTime,
        onClick
    }: SlotCardProps
){
    return(
        <>
        <Grid size={{ xs: 12, sm: 4 }}>

        <Card
            sx={{
                cursor: "pointer",
                textAlign: "center",
                boxShadow: 3,
            }}
            >
            <CardContent>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
              >

                <Typography fontWeight={600}>
                    {gameName}
                </Typography>
                <Typography fontWeight={600}>
                    Date: {date}
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

                {buttonText && (
                    <Button onClick={onClick} variant="contained">
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