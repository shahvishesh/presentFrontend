import type { SxProps, Theme } from "@mui/material/styles";

export const dataTableContainerSx: SxProps<Theme> = {
  overflowX: "auto",
};

export const dataTableHeadRowSx: SxProps<Theme> = {
  "& th": {
    fontWeight: 600,
    borderBottomColor: "divider",
  },
};

export const dataTablePrimaryCellSx: SxProps<Theme> = {
  fontWeight: 500,
};

export const dataTableActionsCellSx: SxProps<Theme> = {
  textAlign: "center",
};

export const dataTableActionsStackSx: SxProps<Theme> = {
  justifyContent: "center",
  alignItems: "center",
};

export const dataTableEmptyStateCellSx: SxProps<Theme> = {
  py: 6,
  color: "text.secondary",
};
