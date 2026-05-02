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
import { toast } from "react-toastify";
import { deleteCategoryType, getCategoryType, type CategoryType } from "../../../api/category.api";
import EditIcon from "@mui/icons-material/Edit";
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
import CategoryModal from "./CategoryModal";

export default function CategoryTypeList() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  useEffect(() => {
    getCategoryType()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Delete this category?");
    if (!confirm) return;

    try {
      await deleteCategoryType(id);

      setCategories((prev) =>
        prev.filter((c) => c.id !== id)
      );

      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
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
              Expense Categories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View, update, and delete category entries.
            </Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={() => {
              setSelectedCategory(null);
              setOpenModal(true);
            }}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            Add Category
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageScrollableContentPaperSx}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600 }}>No categories found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Click "Add Category" to create one.
            </Typography>
          </Box>
        ) : (
          <Box sx={pageScrollableAreaSx}>
            <TableContainer sx={dataTableContainerSx}>
              <Table aria-label="categories table">
                <TableHead>
                  <TableRow sx={dataTableHeadRowSx}>
                    <TableCell>ID</TableCell>
                    <TableCell>Category Name</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat.id} hover>
                      <TableCell>{cat.id}</TableCell>
                      <TableCell sx={dataTablePrimaryCellSx}>{cat.categoryName}</TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                          <Tooltip title="Update">
                            <IconButton
                              color="secondary"
                              size="small"
                              onClick={() => {
                                setSelectedCategory(cat);
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
                              onClick={() => handleDelete(cat.id)}
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
      <CategoryModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  initialData={selectedCategory}
  onSuccess={(newCategory) => {
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === newCategory.id);

      if (exists) {
        // update
        return prev.map((c) =>
          c.id === newCategory.id ? newCategory : c
        );
      }

      // create
      return [newCategory, ...prev];
    });
  }}
/>
    </Box>
  );
}