import { useEffect, useState } from "react";
import {
    getGameInterest,
    getGameType,
    updateGameInterest,
    type GameTypeResponse,
    type UpdateGameInterest,
} from "../../api/slot.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { getEmployeeDetail, type EmployeeResponse } from "../../api/employee.api";
import { Controller, useForm } from "react-hook-form";
import {
    pageContentPaperSx,
    pageDividerSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

export default function GameInterest() {
    const [games, setGames] = useState<GameTypeResponse[]>([]);
    const [employee, setEmployee] = useState<EmployeeResponse>();

    const navigate = useNavigate();

    useEffect(() => {
        getGameType()
                .then((data) => setGames(data))
                .catch(() => toast.error("Error loading games"));
    }, []);

    useEffect(() => {
        getEmployeeDetail()
                .then((data) => setEmployee(data))
                .catch(() => toast.error("Error loading employee data"));
    }, []);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm<UpdateGameInterest>({
      defaultValues: {
        gameIds: [],
      },
    });

     useEffect(() => {
        getGameInterest()
                .then((data) => {
                    reset({
                        gameIds: data.map((t) => t.gameId)
                    });
                })
                .catch(() => toast.error("Error loading game interest data"));
    }, [reset]);


    const onSubmit = async (data: UpdateGameInterest) => {
        try {
          await updateGameInterest(data);
    
          toast.success("Interest updated successfully");
          navigate(`/dashboard/game`, { replace: true });
        } catch {
          toast.error("Failed to update post");
        }
      };

    return(
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Game Interest
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Choose the games you want to follow.
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

                {employee && (
                    <Paper variant="outlined" sx={{
                        p: { xs: 2, sm: 2.5 },
                        overflow: "hidden",
                        borderTop:0,
                        borderRadius:0,
                    }}>
                      <Typography variant="h5">
                        {employee.firstName} {employee.lastName}
                      </Typography>
                      <Divider sx={pageDividerSx} />
            
                      <Stack spacing={0.5}>
                        <Typography variant="body1">
                          Designation: {employee.designation}
                        </Typography>
                        <Typography variant="body1">
                          Department: {employee.department}
                        </Typography>
                      </Stack>
                    </Paper>
                  )}

            <Paper variant="outlined" sx={pageContentPaperSx}>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: { xs: 2, sm: 2.5 } }}>
                        <Stack spacing={2}>
                            <Controller
                                name="gameIds"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        {/** Grid-based selector is easier to scan and interact with than chips. */}
                                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                            Select games you are interested in
                                        </Typography>
                                         <Divider sx={pageDividerSx} />
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                                                gap: 1.25,
                                            }}
                                        >
                                            {games.map((game) => {
                                                const selected = field.value.includes(game.id);

                                                const toggleGame = () => {
                                                    if (selected) {
                                                        field.onChange(
                                                            field.value.filter((id) => id !== game.id)
                                                        );
                                                        return;
                                                    }

                                                    field.onChange([...field.value, game.id]);
                                                };

                                                return (
                                                    <FormControlLabel
                                                        key={game.id}
                                                        control={
                                                            <Checkbox
                                                                checked={selected}
                                                                onChange={toggleGame}
                                                            />
                                                        }
                                                        label={
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {game.gameName}
                                                            </Typography>
                                                        }
                                                        sx={{
                                                            m: 0,
                                                            px: 1,
                                                            py: 0.5,
                                                            border: "1px solid",
                                                            borderColor: selected ? "primary.main" : "divider",
                                                            borderRadius: 2,
                                                            bgcolor: selected ? "action.selected" : "background.paper",
                                                            transition: "all 0.2s ease",
                                                            '&:hover': {
                                                                borderColor: "primary.main",
                                                                bgcolor: "action.hover",
                                                            },
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Box>

                                        {errors.gameIds && (
                                            <Typography
                                                color="error"
                                                variant="caption"
                                                sx={{ mt: 1, display: "block" }}
                                            >
                                                {errors.gameIds.message}
                                            </Typography>
                                        )}
                                    </>
                                )}
                            />
                             <Divider sx={pageDividerSx} />
                            <Stack direction="row" justifyContent="flex-end">
                                <Button variant="contained" type="submit">
                                    Update Interest
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                
            </Paper>
        </Box>
    );
}