import { useEffect, useState } from "react";
import {
    getGameConfigurationById,
    updateGameConfiguration,
    type UpdateGameConfig,
} from "../../api/slot.api";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import dayjs from "dayjs";
import {
    pageContentPaperSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

dayjs.extend(customParseFormat);

type EditFormValues = {
    startTime: Dayjs | null;
    endTime: Dayjs | null;
    maxPlayers: number;
    slotDuration: number;
};

export default function UpdateConfiguration() {
    const navigate = useNavigate();
    const { configId } = useParams();
    const [searchParams] = useSearchParams();
    const gameName = searchParams.get("gameName") ?? "";
    const [loading, setLoading] = useState(true);

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<EditFormValues>();

    useEffect(() => {
        if (!configId) return;

        getGameConfigurationById(Number(configId))
            .then((configRes) => {
                reset({
                    startTime: dayjs(configRes.startTime, "HH:mm:ss"),
                    endTime: dayjs(configRes.endTime, "HH:mm:ss"),
                    maxPlayers: configRes.maxPlayers,
                    slotDuration: configRes.slotDuration,
                });
            })
            .catch(() => toast.error("Failed to load data"))
            .finally(() => setLoading(false));
    }, [configId, reset]);

    const onSubmit = async (data: EditFormValues) => {
        if (data.startTime && data.endTime && data.endTime.isBefore(data.startTime)) {
            toast.error("End time must be after start time");
            return;
        }

        try {
            const payload: UpdateGameConfig = {
                startTime: data.startTime?.format("HH:mm:ss"),
                endTime: data.endTime?.format("HH:mm:ss"),
                maxPlayers: data.maxPlayers,
                slotDuration: data.slotDuration,
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
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={pageHeaderStackSx}
                >
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Update Game Configuration
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Edit time slots, player limits, and duration{gameName ? ` for ${gameName}.` : "."}
                        </Typography>
                    </Stack>

                    {/* <Button variant="outlined" onClick={() => navigate(-1)}>
                        Back
                    </Button> */}
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
                            {gameName && (
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        label="Game"
                                        value={gameName}
                                        fullWidth
                                        size="small"
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            },
                                        }}
                                    />
                                </Grid>
                            )}

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="startTime"
                                    control={control}
                                    rules={{ required: "Start time is required" }}
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
                                    rules={{ required: "End time is required" }}
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