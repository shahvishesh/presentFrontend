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
  getDepartments,
  deleteDepartment,
  type DepartmentResponse,
} from "../../../api/department.api";
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

import DepartmentModal from "./DepartmentModal";

export default function DepartmentList() {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDept, setSelectedDept] =
    useState<DepartmentResponse | null>(null);

  useEffect(() => {
    getDepartments()
      .then(setDepartments)
      .catch(() => toast.error("Failed to load departments"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      toast.success("Department deleted");
    } catch (err: any) {
      // 🔥 important (backend restriction)
      const message =
        err.response?.data?.message ||
        "Cannot delete department (has employees)";
      toast.error(message);
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
              Departments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View, update, and delete department entries.
            </Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={() => {
              setSelectedDept(null);
              setOpenModal(true);
            }}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            Add Department
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageScrollableContentPaperSx}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : departments.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600 }}>No departments found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Click "Add Department" to create one.
            </Typography>
          </Box>
        ) : (
          <Box sx={pageScrollableAreaSx}>
            <TableContainer sx={dataTableContainerSx}>
              <Table aria-label="departments table">
                <TableHead>
                  <TableRow sx={dataTableHeadRowSx}>
                    <TableCell>#</TableCell>
                    <TableCell>Department Name</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {departments.map((dept, index) => (
                    <TableRow key={dept.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={dataTablePrimaryCellSx}>{dept.departmentName}</TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                          <Tooltip title="Update">
                            <IconButton
                              color="secondary"
                              size="small"
                              onClick={() => {
                                setSelectedDept(dept);
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
                              onClick={() => handleDelete(dept.id)}
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

      <DepartmentModal
        key={selectedDept?.id ?? "new"}
        open={openModal}
        onClose={() => setOpenModal(false)}
        initialData={selectedDept}
        onSuccess={(newDept) => {
          setDepartments((prev) => {
            const exists = prev.find((d) => d.id === newDept.id);

            if (exists) {
              return prev.map((d) =>
                d.id === newDept.id ? newDept : d
              );
            }

            return [newDept, ...prev];
          });
        }}
      />
    </Box>
  );
}