import { useEffect, useState } from "react";
import { getGameType, type GameTypeResponse } from "../../api/slot.api";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ChooseGame(){

    const[games, setGames] = useState<GameTypeResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getGameType()
                .then((data) => setGames(data))
                .catch(() => toast.error("Error loading games"));
    }, []);

    return(
        <>
             <Button sx={{mb: 5, display:"block"}} variant="outlined" onClick={() =>navigate(-1)}>
                Back
            </Button>
            {games.map((game) => (
                <Button 
                    variant="contained"
                    sx={{mx:2}}
                    key={game.id}
                    onClick={() => navigate(`/dashboard/game/${game.id}/registrations`)}    
                >
                    {game.gameName}
                </Button>
            ))}
        </>
    );
}