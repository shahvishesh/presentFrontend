import { getSlots } from "../../api/slot.api";
import { useNavigate } from "react-router-dom";
import GameType from "./game-tabs/GameType";

export default function SelectGame(){
    const navigate = useNavigate();

    return(
        <>
             <GameType
                fetchSlots={getSlots}
                buttonText="Register"
                onAction={(slot) => navigate(`/dashboard/game/slot/${slot.slotId}`)}
                headerSubtitle="Browse available slots and register for your preferred game."
            />
        </>
    );
}