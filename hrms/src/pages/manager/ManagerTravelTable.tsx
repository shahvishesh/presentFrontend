import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { TravelPlanResponse } from "../../api/travel.api";
import {
  dataTableActionsStackSx,
  dataTableContainerSx,
  dataTableEmptyStateCellSx,
  dataTableHeadRowSx,
  dataTablePrimaryCellSx,
} from "../../components/table/tableStyles";
import { formatDateToDDMMYYYY } from "../../utils/dateFormat";

interface Props {
  employeeId: number;
  travels: TravelPlanResponse[];
}

export default function ManagerTravelTable({ employeeId, travels }: Props) {
  const navigate = useNavigate();

  return (
    <Box>
      <TableContainer component={Paper} sx={dataTableContainerSx}>
        <Table aria-label="employee travel plans table">
          <TableHead>
            <TableRow sx={dataTableHeadRowSx}>
              <TableCell>Title</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {travels.map((travel) => (
              <TableRow key={travel.travelPlanId} hover>
                <TableCell sx={dataTablePrimaryCellSx}>{travel.title}</TableCell>
                <TableCell>
                  {formatDateToDDMMYYYY(travel.startDate)} - {formatDateToDDMMYYYY(travel.endDate)}
                </TableCell>
                <TableCell>{travel.sourceLocation}</TableCell>
                <TableCell>{travel.destinationLocation}</TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        navigate(`/dashboard/team/${employeeId}/${travel.travelPlanId}`)
                      }
                    >
                      View Details
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {travels.length === 0 && (
              <TableRow key="no-plans">
                <TableCell colSpan={5} align="center" sx={dataTableEmptyStateCellSx}>
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