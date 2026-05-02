import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

import {
  getAllGames,
  deleteGame,
  type GameResponse,
} from "./../../../api/game.api";
import {
  dataTableActionsStackSx,
  dataTableContainerSx,
  dataTableHeadRowSx,
  dataTablePrimaryCellSx,
} from "../../../components/table/tableStyles";
import {
  pageRootSx,
  pageScrollableAreaSx,
  pageScrollableContentPaperSx,
} from "../../../components/page/pageStyles";

import GameModal from "./GameModal";

export default function GameList() {
  const [games, setGames] = useState<GameResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameResponse | null>(null);

  // ✅ Fetch
  useEffect(() => {
    getAllGames()
      .then(setGames)
      .catch(() => toast.error("Failed to load games"))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this game?")) return;

    try {
      await deleteGame(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
      toast.success("Game deleted");
    } catch {
      toast.error("Failed to delete game");
    }
  };

  return (
    <Box sx={pageRootSx}>
      <Paper
        variant="outlined"
        sx={{
          pt: { xs: 2, sm: 2.5 },
          px: { xs: 2, sm: 2.5 },
          pb: { xs: 2, sm: 2.5 },
          mb: 0,
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          overflow: "hidden",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
        >
          <Stack spacing={0.25}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Games
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View, update, and delete game entries.
            </Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={() => {
              setSelectedGame(null);
              setOpenModal(true);
            }}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            Add Game
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageScrollableContentPaperSx}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : games.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600 }}>No games found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Click "Add Game" to create one.
            </Typography>
          </Box>
        ) : (
          <Box sx={pageScrollableAreaSx}>
            <TableContainer sx={dataTableContainerSx}>
              <Table aria-label="games table">
                <TableHead>
                  <TableRow sx={dataTableHeadRowSx}>
                    <TableCell>#</TableCell>
                    <TableCell>Game Name</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {games.map((game, index) => (
                    <TableRow key={game.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={dataTablePrimaryCellSx}>{game.gameName}</TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                          <Tooltip title="Update">
                            <IconButton
                              color="secondary"
                              size="small"
                              onClick={() => {
                                setSelectedGame(game);
                                setOpenModal(true);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDelete(game.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>

      {/* ✅ Modal */}
      <GameModal
        key={selectedGame?.id ?? "new"} // 🔥 avoids stale values
        open={openModal}
        onClose={() => setOpenModal(false)}
        initialData={selectedGame}
        onSuccess={(newGame) => {
          setGames((prev) => {
            const exists = prev.find((g) => g.id === newGame.id);

            if (exists) {
              return prev.map((g) =>
                g.id === newGame.id ? newGame : g
              );
            }

            return [newGame, ...prev];
          });
        }}
      />
    </Box>
  );
}