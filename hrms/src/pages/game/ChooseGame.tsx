import { useState } from "react";
import { cancelRegistrationOrBooking, getActiveSlotRegistrations } from "../../api/slot.api";
import { toast } from "react-toastify";
import GameType from "./game-tabs/GameType";

export default function ChooseGame(){
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCancel = async (slotId: number) => {
          const confirmDelete = window.confirm("Are you sure you want to cancel this registraion?");
          if (!confirmDelete) return;
        
          try {
            await cancelRegistrationOrBooking(slotId);
        
            //setSlotRegistrations((prev) => prev.filter((slot) => slot.slotId !== slotId));
            setRefreshKey((prev) => prev + 1);
            toast.success("Registration cancelled");
          } catch {
            toast.error("Failed to cancel registration");
          }
        };
    

    return(
        <>
            <GameType
                fetchSlots={getActiveSlotRegistrations}
                buttonText="Cancel Registration"
                onAction={(slot) => handleCancel(slot.slotId)}
                refreshKey={refreshKey}
                headerSubtitle="View your active registrations and cancel them if needed."
            />
        </>
    );
}