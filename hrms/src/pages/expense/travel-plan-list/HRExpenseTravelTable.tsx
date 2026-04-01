import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
  Box,
  Paper,
  Stack,
} from "@mui/material";
import type { TravelPlanResponse } from "../../../api/travel.api";
import {
  dataTableActionsStackSx,
  dataTableContainerSx,
  dataTableEmptyStateCellSx,
  dataTableHeadRowSx,
  dataTablePrimaryCellSx,
} from "../../../components/table/tableStyles";

interface Props {
  travels: TravelPlanResponse[];
  onClick: (travel: TravelPlanResponse) => void;
  actionLabel?: string;
}

export default function HRExpenseTravelTable({ travels, onClick, actionLabel }: Props) {
  const label = actionLabel ?? "View";

  return (
    <Box>
      <TableContainer component={Paper} sx={dataTableContainerSx}>
        <Table aria-label="travel plans table">
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
                  {travel.startDate} - {travel.endDate}
                </TableCell>
                <TableCell>{travel.sourceLocation}</TableCell>
                <TableCell>{travel.destinationLocation}</TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onClick(travel)}
                    >
                      {label}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {travels.length === 0 && (
              <TableRow key="no-plans">
                <TableCell
                  colSpan={5}
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