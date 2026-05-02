import { useEffect, useState } from "react"
import { getMyStatus, getSlotDetail, registerSlot, type RegisterSlot, type SlotResponse, type UserSlotStatus } from "../../api/slot.api"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {getInterestedEmployees, type EmployeeResponse } from "../../api/employee.api";
import { Alert, Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, FormGroup, Paper, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import {
    pageContentPaperSx,
    pageDividerSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
    pageSectionPaperSx,
} from "../../components/page/pageStyles";


interface FormValues {
        employees: number[];
}

export default function BookSlot(){

    const [userStatus, setUserStatus] = useState<UserSlotStatus | null>(null);    
    const [slot, setSlot] = useState<SlotResponse | null>(null);
    const [ employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const { slotId } = useParams();

    // useEffect(() => {
    //     getSlotDetail(Number(slotId))
    //         .then((data) => setSlot(data))
    //         .catch(() => toast.error("Error loading slot detail"));
    // }, []);

    const {
            control,
            handleSubmit,
            formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        try {
            const payload: RegisterSlot = {
            employeeIds: data.employees.map((id) => (id)),
            };
        
            await registerSlot(Number(slotId), payload);
        
            toast.success("Slot registered successfully");
            navigate(`/dashboard/game/choose`, {replace: true}); 
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "API Error");
            } else {
            toast.error("Something went wrong");
            }
        }
    };

    useEffect(() => {
      if (!slotId) return;
    
      const fetchData = async () => {
        try {
          const [slotRes, employeeRes, myStatus] = await Promise.all([
            getSlotDetail(Number(slotId)),
            getInterestedEmployees(Number(slotId)),
            getMyStatus(Number(slotId)),
          ]);
    
          setSlot(slotRes);
          setEmployees(employeeRes);
          setUserStatus(myStatus);
        } catch {
          toast.error("Failed to load slot details");
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [slotId]);

    if (loading) {
        return (
        <Box sx={pageRootSx}>
            <Paper
                variant="outlined"
                sx={{
                    ...pageContentPaperSx,
                    p: { xs: 4, sm: 6 },
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Paper>
        </Box>
        );
    }


    if (!slot) {
        return (
            <Box sx={pageRootSx}>
                <Paper variant="outlined" sx={{ ...pageContentPaperSx, p: { xs: 2, sm: 2.5 } }}>
                    <Typography color="text.secondary">Slot details not found.</Typography>
                </Paper>
            </Box>
        );
    }

    const registrationBlocked =
        userStatus?.isOnTravel === true ||
        userStatus?.isLimitReached === true ||
        userStatus?.isRegistered === true;

    return(
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageSectionPaperSx}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={pageHeaderStackSx}
                >
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Register Interest In Slot
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Confirm your participation and optionally include teammates.
                        </Typography>
                    </Stack>

                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Stack>    
                 <Divider sx={pageDividerSx} />
                 <Stack spacing={0.75}>
                    <Typography fontWeight={600}>Game: {slot.gameName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Timings: {slot.startTime} - {slot.endTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Max players: {slot.maxPlayers}
                    </Typography>
                </Stack>
            </Paper>

            {/* <Paper variant="outlined" sx={pageSectionPaperSx}>
                <Stack spacing={0.75}>
                    <Typography fontWeight={600}>Game: {slot.gameName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Timings: {slot.startTime} - {slot.endTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Max players: {slot.maxPlayers}
                    </Typography>
                </Stack>
            </Paper> */}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2}>
                    {userStatus?.isOnTravel && (
                        <Alert severity="error">You are on a travel plan and cannot register for this slot.</Alert>
                    )}
                    {userStatus?.isLimitReached && (
                        <Alert severity="error">You have reached the daily booking limit.</Alert>
                    )}
                    {userStatus?.isRegistered && (
                        <Alert severity="error">You have already registered for this slot.</Alert>
                    )}

                    <Paper variant="outlined" sx={pageSectionPaperSx}>
                        <Typography variant="subtitle1" mb={1}>
                            Select Employees (Optional)
                        </Typography>

                        <Controller
                            name="employees"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <Box
                                    sx={{
                                        border: 1,
                                        borderColor: "divider",
                                        borderRadius: 1,
                                        p: 1,
                                        maxHeight: 260,
                                        overflowY: "auto",
                                    }}
                                >
                                    <FormGroup>
                                        {employees?.map((emp) => {
                                            const isUnavailable =
                                                emp.isOnTravel || emp.isLimitReached || emp.isAlreadyRegistered;

                                            return (
                                                <Stack
                                                    key={emp.id}
                                                    direction="column"
                                                    sx={{
                                                        border: "1px solid",
                                                        borderColor: isUnavailable ? "error.light" : "transparent",
                                                        borderRadius: 1,
                                                        px: 1,
                                                        py: 0.5,
                                                        mb: 0.5,
                                                        backgroundColor: isUnavailable ? "rgba(211, 47, 47, 0.08)" : "transparent",
                                                        opacity: isUnavailable ? 0.7 : 1,
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={field.value?.includes(emp.id)}
                                                                disabled={isUnavailable}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        field.onChange([...field.value, emp.id]);
                                                                    } else {
                                                                        field.onChange(
                                                                            field.value.filter((id: number) => id !== emp.id)
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        }
                                                        label={`${emp.firstName} ${emp.lastName} (${emp.designation})`}
                                                    />

                                                    {isUnavailable && (
                                                        <Typography variant="caption" color="error">
                                                            {emp.isOnTravel
                                                                ? "On travel"
                                                                : emp.isLimitReached
                                                                    ? "Daily booking limit reached"
                                                                    : "Already registered for this slot"}
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            );
                                        })}
                                    </FormGroup>
                                </Box>
                            )}
                        />

                        {errors.employees && (
                            <Typography color="error" variant="body2">
                                {errors.employees.message}
                            </Typography>
                        )}
                    </Paper>

                    <Box>
                        <Button variant="contained" type="submit" disabled={registrationBlocked}>
                            Register slot
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    )
}