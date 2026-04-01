import { useEffect, useState } from "react";
import { getGameInterest, getGameType, updateGameInterest, type GameInterestResponse, type GameTypeResponse, type UpdateGameInterest } from "../../api/slot.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { getEmployeeDetail, type EmployeeResponse } from "../../api/employee.api";
import { Controller, useForm } from "react-hook-form";

export default function GameInterest(){
    const[games, setGames] = useState<GameTypeResponse[]>([]);
    const[gameInterest, setGameInterest] = useState<GameInterestResponse[]>([]);
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
                    setGameInterest(data)
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
        <>
            <Box>
                <Card sx={{my: 2}}>
                    <CardContent>
                         <Typography>
                         Name:   {employee?.firstName} {employee?.lastName}
                        </Typography>
                        
                         <Typography>
                         Designation:   {employee?.designation}
                        </Typography>

                         <Typography>
                        Department:    {employee?.department}
                        </Typography>
                        </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={3}>

                            <Controller
                                    name="gameIds"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                        <Typography variant="subtitle1" mb={1}>
                                            Select game tags
                                        </Typography>

                                        <Box
                                            sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 1,
                                            }}
                                        >
                                            {games.map((game) => {
                                            const selected = field.value.includes(game.id);

                                            return (
                                                <Chip
                                                key={game.id}
                                                label={game.gameName}
                                                clickable
                                                color={selected ? "primary" : "default"}
                                                variant={selected ? "filled" : "outlined"}
                                                onClick={() => {
                                                    if (selected) {
                                                    field.onChange(
                                                        field.value.filter(
                                                        (id) => id !== game.id
                                                        )
                                                    );
                                                    } else {
                                                    field.onChange([
                                                        ...field.value,
                                                        game.id,
                                                    ]);
                                                    }
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

                            <Button variant="contained" type="submit">
                                Update Post
                            </Button>
                        </Stack>
                    </form>

                    </CardContent>
                </Card>
            </Box>
        </>
    );
}