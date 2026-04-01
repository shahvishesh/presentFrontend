import { useEffect, useState } from "react"
import { getSlotDetail, registerSlot, type RegisterSlot, type SlotResponse } from "../../api/slot.api"
import { replace, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getEmployees, getInterestedEmployees, type EmployeeResponse } from "../../api/employee.api";
import { Box, Button, Card, CardContent, Checkbox, CircularProgress, Container, FormControlLabel, FormGroup, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";


interface FormValues {
        employees: number[];
}

export default function BookSlot(){

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
          const [slotRes, employeeRes] = await Promise.all([
            getSlotDetail(Number(slotId)),
            getInterestedEmployees(Number(slotId)),
          ]);
    
          setSlot(slotRes);
          setEmployees(employeeRes);
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
        <Box sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress />
        </Box>
        );
    }


    if (!slot) return null;

    return(
        <Container maxWidth="lg">
            <Button sx={{mb:2}} variant="outlined" onClick={() => navigate(-1)}>
                Back
            </Button>
            <Typography variant="h5" mb={3}>
                Register interest in slot
            </Typography>

            <Card sx={{mb:2}}>
                <CardContent>
                    <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    gap={1}
              >

                    <Typography fontWeight={600}>
                    Game: {slot.gameName}
                    </Typography>
                    <Typography variant="body2" >
                    Timings: {slot.startTime} - {slot.endTime}
                    </Typography>
                    <Typography variant="body2" >
                    Max players: {slot.maxPlayers}
                    </Typography>
              </Stack>
                    </CardContent>
            </Card>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                                <Typography variant="subtitle1" mt={2} mb={1}>
                                Select Employees(Optional)
                                </Typography>
                                
                                <Controller
                                name="employees"
                                control={control}
                                defaultValue={[]}
                                render={({ field }) => (
                                    <FormGroup>
                                    {employees?.map((emp) => (
                                        <FormControlLabel
                                        key={emp.id}
                                        control={
                                            <Checkbox
                                            checked={field.value?.includes(emp.id)}
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
                                    ))}
                                    </FormGroup>
                                )}
                                />
                                
                                {errors.employees && (
                                <Typography color="error" variant="body2">
                                    {errors.employees.message}
                                </Typography>
                                )}

                                
                        </CardContent>
                    </Card>
                    <Button variant="contained" type="submit">
                        Register slot
                    </Button>
                </form>
        </Container>
    )
}