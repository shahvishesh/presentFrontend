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
  getAllTags,
  deleteTag,
  type TagResponse,
} from "../../../api/tag.api";
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

import TagModal from "./TagModal";

export default function TagTypeList() {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagResponse | null>(null);

  useEffect(() => {
    getAllTags()
      .then(setTags)
      .catch(() => toast.error("Failed to load tags"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Delete this tag?");
    if (!confirm) return;

    try {
      await deleteTag(id);

      setTags((prev) => prev.filter((t) => t.id !== id));

      toast.success("Tag deleted");
    } catch {
      toast.error("Failed to delete tag");
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
              Tags
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View, update, and delete tag entries.
            </Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={() => {
              setSelectedTag(null);
              setOpenModal(true);
            }}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            Add Tag
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageScrollableContentPaperSx}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : tags.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600 }}>No tags found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Click "Add Tag" to create one.
            </Typography>
          </Box>
        ) : (
          <Box sx={pageScrollableAreaSx}>
            <TableContainer sx={dataTableContainerSx}>
              <Table aria-label="tags table">
                <TableHead>
                  <TableRow sx={dataTableHeadRowSx}>
                    <TableCell>ID</TableCell>
                    <TableCell>Tag Name</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tags.map((tag, index) => (
                    <TableRow key={tag.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={dataTablePrimaryCellSx}>{tag.tagName}</TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                          <Tooltip title="Update">
                            <IconButton
                              color="secondary"
                              size="small"
                              onClick={() => {
                                setSelectedTag(tag);
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
                              onClick={() => handleDelete(tag.id)}
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
      <TagModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        initialData={selectedTag}
        onSuccess={(newTag) => {
          setTags((prev) => {
            const exists = prev.find((t) => t.id === newTag.id);

            if (exists) {
              // update
              return prev.map((t) =>
                t.id === newTag.id ? newTag : t
              );
            }

            // create
            return [newTag, ...prev];
          });
        }}
      />
    </Box>
  );
}