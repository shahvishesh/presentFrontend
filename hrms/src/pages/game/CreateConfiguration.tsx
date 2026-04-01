import { useEffect, useState } from "react";
import { createGameConfiguration, getGameType, type CreateGameConfig, type GameTypeResponse } from "../../api/slot.api";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { Button, Card, CardContent, Container, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import axios from "axios";

interface FormValues{
    startTime: Dayjs | null;
    endTime: Dayjs | null;
    maxPlayers: number;
    slotDuration: number;
    gameId: number;
}

export default function CreateConfiguration() {

    const[games, setGames] = useState<GameTypeResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
            getGameType()
                    .then((data) => setGames(data))
                    .catch(() => toast.error("Error loading games"));
        }, []);

    const {
            reset,
            control,
            register,
            handleSubmit,
            formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            gameId: 0
        }
    });

    const onSubmit = async (data: FormValues) => {
        if(data.startTime && data.endTime){
            if(data.endTime.isBefore(data.startTime)){
                toast.error("End time must be after start time");
                return;
            }
        }
        try {
            const payload: CreateGameConfig = {
                startTime: data.startTime?.format("HH:mm:ss"),
                endTime: data.endTime?.format("HH:mm:ss"),
                maxPlayers: data.maxPlayers,
                slotDuration: data.slotDuration,
                gameId: data.gameId
            };
        
            await createGameConfiguration(payload);
        
            toast.success("Configuration added successfully");
            reset();
            navigate("/dashboard/game"); 
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "API Error");
            } else {
            toast.error("Something went wrong");
            }
        }
    };
    const slotDurations = [15, 30, 45, 60];

    return (
       <Container maxWidth="lg">
            <Button variant="outlined" onClick={() =>navigate(-1)}>
                Back
            </Button>
            <Typography variant="h5" mb={3}>
                Create game configuration
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

                            
                            <Typography variant="subtitle1" mt={2} mb={1}>
                                Select a Game
                            </Typography>
                                
                            <Controller
                                        name="gameId"
                                        control={control}
                                        rules={{ 
                                            required: "Game is required",
                                            validate: (value) => value !== 0 || "Game is required"
                                            }}
                                        render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Game"
                                            fullWidth
                                            error={!!errors.gameId}
                                            helperText={errors.gameId?.message}

                                        >
                                            <MenuItem value={0}>Select a game</MenuItem>
                                            {games?.map((game) => (
                                            <MenuItem key={game.id} value={game.id}>
                                                {game.gameName}
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