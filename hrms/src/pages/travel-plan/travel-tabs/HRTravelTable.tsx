import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Box,
  Stack,
  IconButton,
    Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { TravelPlanResponse } from "../../../api/travel.api";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import {
    dataTableActionsStackSx,
    dataTableContainerSx,
    dataTableEmptyStateCellSx,
    dataTableHeadRowSx,
    dataTablePrimaryCellSx,
} from "../../../components/table/tableStyles";
import { formatDateToDDMMYYYY } from "../../../utils/dateFormat";

interface Props {
  travelPlans: TravelPlanResponse[];
  onDelete: (travelPlanId: number) => void;
}

export default function HRTravelTable({ travelPlans, onDelete }: Props) {
  const navigate = useNavigate();

  const handleDelete = async (travelPlanId: number) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this plan?"
        );
        if (!confirmDelete) return;

        onDelete(travelPlanId);
    };

    return (
        <Box>
            <TableContainer
                component={Box}
                sx={dataTableContainerSx}
            >
                <Table aria-label="travel plans table">
                    <TableHead>
                        <TableRow
                            sx={dataTableHeadRowSx}
                        >
                            <TableCell>Title</TableCell>
                            <TableCell>Period</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {travelPlans.map((travel) => (
                            <TableRow
                                key={travel.travelPlanId}
                                hover
                            >
                                <TableCell sx={dataTablePrimaryCellSx}>{travel.title}</TableCell>
                                <TableCell>
                                    {formatDateToDDMMYYYY(travel.startDate)} - {formatDateToDDMMYYYY(travel.endDate)}
                                </TableCell>
                                <TableCell sx={{ color: "text.secondary" }}>
                                    {travel.status}
                                </TableCell>
                                <TableCell>{travel.sourceLocation}</TableCell>
                                <TableCell>{travel.destinationLocation}</TableCell>

                                <TableCell align="center">
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={dataTableActionsStackSx}
                                    >
                                        <Tooltip title="View Details">
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() =>
                                                    navigate(`/dashboard/travel/${travel.travelPlanId}`)
                                                }
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        {travel.status === "DRAFT" && (
                                            <Tooltip title="Update">
                                                <IconButton
                                                    color="secondary"
                                                    size="small"
                                                    onClick={() =>
                                                        navigate(
                                                            `/dashboard/travel/update/${travel.travelPlanId}`
                                                        )
                                                    }
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {travel.status === "DRAFT" && (
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(travel.travelPlanId);
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}

                        {travelPlans.length === 0 && (
                            <TableRow key="no-plans">
                                <TableCell
                                    colSpan={6}
                                    align="center"
                                    sx={dataTableEmptyStateCellSx}
                                >
                                    No travel plans found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}