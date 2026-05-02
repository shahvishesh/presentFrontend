import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  createGame,
  updateGame,
  type GameResponse,
} from "../../../api/game.api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (game: GameResponse) => void;
  initialData?: GameResponse | null;
};

type FormValues = {
  gameName: string;
};

export default function GameModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  // ✅ reset fix (important)
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({ gameName: initialData.gameName });
      } else {
        reset({ gameName: "" });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      let res;

      if (initialData) {
        res = await updateGame(initialData.id, {
          gameName: data.gameName.trim(),
        });
        toast.success("Game updated");
      } else {
        res = await createGame({
          gameName: data.gameName.trim(),
        });
        toast.success("Game created");
      }

      onSuccess(res);
      onClose();
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 0.5 }}>
        <Stack spacing={0.25}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {initialData ? "Edit Game" : "Add Game"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {initialData
              ? "Update the game details"
              : "Create a new game entry"}
          </Typography>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1.5 }}>
          <TextField
            label="Game Name"
            fullWidth
            size="small"
            {...register("gameName", {
              required: "Game name is required",
            })}
            error={!!errors.gameName}
            helperText={errors.gameName?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {initialData ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}