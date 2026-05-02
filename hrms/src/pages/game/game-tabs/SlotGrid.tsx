import { Grid } from "@mui/material";
import SlotCard from "../SlotCard";
import type { SlotResponse } from "../../../api/slot.api";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

interface Props {
  slots: SlotResponse[];
  buttonText?: string;
  onAction?: (slot: SlotResponse) => void;
  showClosingTime?: boolean
}

export default function SlotGrid({
  slots,
  buttonText,
  onAction,
  showClosingTime = true,
}: Props) {
  return (
    <Grid container spacing={2} sx={{ alignContent: "flex-start" }}>
      {slots.map((slot) => (
        <SlotCard
          key={slot.slotId}
          {...slot}
          buttonText={buttonText}
          closingTime={
            showClosingTime
              ? dayjs(slot.startTime, "HH:mm:ss")
                  .subtract(1, "hour")
                  .format("HH:mm:ss")
              : undefined
          }
          onClick={() => onAction?.(slot)}
        />
      ))}
    </Grid>
  );
}