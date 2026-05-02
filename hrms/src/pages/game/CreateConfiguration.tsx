import { useEffect, useState } from "react";
import { createGameConfiguration, getGameType, type CreateGameConfig, type GameTypeResponse } from "../../api/slot.api";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import axios from "axios";
import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
} from "../../components/page/pageStyles";

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
      <Box sx={pageRootSx}>
        <Paper variant="outlined" sx={pageHeaderPaperSx}>
          <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
            <Stack spacing={0.25}>
              <Typography variant="h5" sx={pageHeaderTitleSx}>
                Create Game Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set up time slots, player limits, and duration.
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={pageContentPaperSx}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ p: { xs: 2, sm: 2.5 } }}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                            fullWidth: true,
                            size: "small",
                            error: !!errors.startTime,
                            helperText: errors.startTime?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="endTime"
                    control={control}
                    rules={{
                      required: "End time is required",
                    }}
                    render={({ field }) => (
                      <TimePicker
                        label="Select end time"
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!errors.endTime,
                            helperText: errors.endTime?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="maxPlayers"
                    control={control}
                    rules={{
                      required: "Please enter maximum number of players",
                      min: { value: 1, message: "Min players is 1" },
                      max: { value: 4, message: "Max players is 4" },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Max Players"
                        fullWidth
                        type="number"
                        size="small"
                        error={!!errors.maxPlayers}
                        helperText={errors.maxPlayers?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
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
                        size="small"
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
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="gameId"
                    control={control}
                    rules={{
                      required: "Game is required",
                      validate: (value) => value !== 0 || "Game is required",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Select Game"
                        fullWidth
                        size="small"
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
                </Grid>
              </Grid>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button variant="contained" type="submit">
                  Save Configuration
                </Button>
              </Stack>
            </Box>
          </LocalizationProvider>
        </Paper>
      </Box>
    );
}