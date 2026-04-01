import { useEffect, useState } from "react";
import { createGameConfiguration, getGameConfigurationById, getGameType, updateGameConfiguration, type CreateGameConfig, type GameTypeResponse, type UpdateGameConfig } from "../../api/slot.api";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { Box, Button, Card, CardContent, CircularProgress, Container, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import axios from "axios";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

type EditFormValues = {
    startTime: Dayjs | null;
    endTime: Dayjs | null;
    maxPlayers: number;
    slotDuration: number;
}

export default function UpdateConfiguration() {

    const[games, setGames] = useState<GameTypeResponse[]>([]);
    const navigate = useNavigate();
    const { configId } = useParams();
      const [loading, setLoading] = useState(true);


    const {
            reset,
            control,
            register,
            handleSubmit,
            formState: { errors },
    } = useForm<EditFormValues>();

    // useEffect(() => {
    //         getGameType()
    //                 .then((data) => setGames(data))
    //                 .catch(() => toast.error("Error loading games"));
    // }, []);

    useEffect(() => {
      if (!configId) return;
    
      const fetchData = async () => {
        try {
          const [configRes, gameRes] = await Promise.all([
            getGameConfigurationById(Number(configId)),
            getGameType(),
          ]);
    
          setGames(gameRes);
    
          reset({
            startTime: dayjs(configRes.startTime, "HH:mm:ss"),
            endTime: dayjs(configRes.endTime, "HH:mm:ss"),
            maxPlayers: configRes.maxPlayers,
            slotDuration: configRes.slotDuration
          });
        } catch {
          toast.error("Failed to load data");
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [configId, reset]);


    const onSubmit = async (data: EditFormValues) => {
        if(data.startTime && data.endTime){
            if(data.endTime.isBefore(data.startTime)){
                toast.error("End time must be after start time");
                return;
            }
        }
        try {
            const payload: UpdateGameConfig = {
                startTime: data.startTime?.format("HH:mm:ss"),
                endTime: data.endTime?.format("HH:mm:ss"),
                maxPlayers: data.maxPlayers,
                slotDuration: data.slotDuration
            };
          await updateGameConfiguration(Number(configId), payload);
    
          toast.success("Configuration updated");
          navigate(`/dashboard/game`, { replace: true });
        } catch {
          toast.error("Failed to update configuration");
        }
      };

    const slotDurations = [15, 30, 45, 60];
    
    if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

    return (
       <Container maxWidth="lg">
            <Button sx={{my:2}} variant="outlined" onClick={() =>navigate(-1)}>
                Back
            </Button>
            <Typography variant="h5" mb={3}>
                Update game configuration
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>


                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>

                            <Stack
                            direction="column"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                            >

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
                            >

                            <Controller
                                name="startTime"
                                control={control}
                                rules={{
                                    required: "Start time is required",
                                }}
                                render={({ field }) => (
                                    <TimePicker
                                    label="Select start time"
                                    value={field.value}
                                    onChange={(newValue) => field.onChange(newValue)}
                                    slotProps={{
                                        textField: {
                                        error: !!errors.startTime,
                                        helperText: errors.startTime?.message,
                                        },
                                    }}
                                    />
                                )}
                                />

                                <Controller
                                    name="endTime"
                                    control={control}
                                    rules={{
                                        required: "End time is required",
                                    }}
                                    render={({ field }) => (
                                        <TimePicker
                                        label="Select end date"
                                        value={field.value}
                                        onChange={(newValue) => field.onChange(newValue)}
                                        slotProps={{
                                            textField: {
                                            error: !!errors.endTime,
                                            helperText: errors.endTime?.message,
                                            },
                                        }}
                                        />
                                    )}
                                />
                            </Stack>

                            <Controller
                                name="maxPlayers"
                                control={control}
                                rules={{ required: "Please enter maximum number of players", min: 1, max: 4 }}
                                render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Max players"
                                    rows={3}
                                    fullWidth
                                    type="number"
                                    error={!!errors.maxPlayers}
                                    helperText={errors.maxPlayers?.message}
                                />
                                )}
                            />

                             {/* <Controller
                                name="slotDuration"
                                control={control}
                                rules={{ required: "Please enter duration", min: 15, max: 60 }}
                                render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Duration"
                                    rows={3}
                                    fullWidth
                                    type="number"
                                    error={!!errors.slotDuration}
                                    helperText={errors.slotDuration?.message}
                                />
                                )}
                            /> */}

                            <Controller
                                name="slotDuration"
                                control={control}
                                rules={{ required: "Please select duration" }}
                                render={({ field }) => (
                                    <TextField
                                    {...field}
                                    select
                                    label="Slot Duration"
                                    fullWidth
                                    error={!!errors.slotDuration}
                                    helperText={errors.slotDuration?.message}
                                    >
                                    <MenuItem value="">Select duration</MenuItem>
                                    {slotDurations.map((duration) => (
                                        <MenuItem key={duration} value={duration}>
                                        {duration} minutes
                                        </MenuItem>
                                    ))}
                                    </TextField>
                                )}
                                />
                            </Stack>

                                
                        </CardContent>
                    </Card>
                    <Button variant="contained" type="submit">
                        Save configuration
                    </Button>
                </form>
            </LocalizationProvider>
            

        </Container>
    )
}