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
  getTypesOfDocuments,
  deleteDocumentType,
  type DocumentTypeResponse,
} from "../../../api/documentType.api";
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

import DocumentTypeModal from "./DocumentTypeModal";

export default function DocumentTypeList() {
  const [types, setTypes] = useState<DocumentTypeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<DocumentTypeResponse | null>(null);

  // ✅ fetch
  useEffect(() => {
    getTypesOfDocuments()
      .then(setTypes)
      .catch(() => toast.error("Failed to load document types"))
      .finally(() => setLoading(false));
  }, []);

  // ✅ delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this document type?")) return;

    try {
      await deleteDocumentType(id);
      setTypes((prev) => prev.filter((t) => t.id !== id));
      toast.success("Deleted successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
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
              Document Types
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View, update, and delete document type definitions.
            </Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={() => {
              setSelected(null);
              setOpenModal(true);
            }}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            Add Document Type
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageScrollableContentPaperSx}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : types.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600 }}>No document types found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Click "Add Document Type" to create one.
            </Typography>
          </Box>
        ) : (
          <Box sx={pageScrollableAreaSx}>
            <TableContainer sx={dataTableContainerSx}>
              <Table aria-label="document types table">
                <TableHead>
                  <TableRow sx={dataTableHeadRowSx}>
                    <TableCell>#</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Formats</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {types.map((t, index) => (
                    <TableRow key={t.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={dataTablePrimaryCellSx}>{t.code}</TableCell>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{t.allowedFormats.join(", ")}</TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                          <Tooltip title="Update">
                            <IconButton
                              color="secondary"
                              size="small"
                              onClick={() => {
                                setSelected(t);
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
                              onClick={() => handleDelete(t.id)}
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

      {/* Modal (we build next step) */}
      <DocumentTypeModal
        key={selected?.id ?? "new"}
        open={openModal}
        onClose={() => setOpenModal(false)}
        initialData={selected}
        onSuccess={(newItem) => {
          setTypes((prev) => {
            const exists = prev.find((t) => t.id === newItem.id);

            if (exists) {
              return prev.map((t) =>
                t.id === newItem.id ? newItem : t
              );
            }

            return [newItem, ...prev];
          });
        }}
      />
    </Box>
  );
}