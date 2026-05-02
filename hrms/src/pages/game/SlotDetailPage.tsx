import { toast } from "react-toastify";
import {
  cancelRegistrationOrBooking,
  getSlotDetails,
  type BookingStatus,
  type SlotDetailDto,
} from "../../api/slot.api";
import { Box, Paper, Typography } from "@mui/material";
import SlotDetailCard from "./SlotDetailCard";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { pageContentPaperSx, pageRootSx } from "../../components/page/pageStyles";

export default function SlotDetailPage() {
  const { slotId } = useParams();
  const [slot, setSlot] = useState<SlotDetailDto | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const statusParam = searchParams.get("status");
  const validStatuses: BookingStatus[] = ["UPCOMING", "CANCELLED", "COMPLETED"];
  const bookingStatus: BookingStatus | undefined = validStatuses.includes(statusParam as BookingStatus)
    ? (statusParam as BookingStatus)
    : undefined;

  const canCancel =
    !bookingStatus ||
    bookingStatus === "UPCOMING";

  useEffect(() => {
    if (slotId) {
      getSlotDetails(Number(slotId))
        .then(setSlot)
        .catch(() => toast.error("Failed to load slot details"));
    }
  }, [slotId]);

  const handleCancel = async (id: number) => {
    try {
      await cancelRegistrationOrBooking(id);
      toast.success("Booking cancelled");
      navigate(-1);
    } catch {
      toast.error("Failed to cancel");
    }
  };

  if (!slot) {
    return (
      <Box sx={pageRootSx}>
        <Paper variant="outlined" sx={{ ...pageContentPaperSx, p: { xs: 2, sm: 2.5 } }}>
          <Typography color="text.secondary">Loading slot details...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <SlotDetailCard
      slot={slot}
      bookingStatus={bookingStatus}
      onCancel={canCancel ? handleCancel : undefined}
      onBack={() => navigate(-1)}
    />
  );
}