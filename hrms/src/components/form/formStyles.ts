import type { SxProps, Theme } from "@mui/material/styles";

export const formBodySx: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
};

export const formActionsSx: SxProps<Theme> = {
  mt: 2,
  justifyContent: "flex-end",
};

export const formSectionTitleSx: SxProps<Theme> = {
  mb: 1,
};

export const formScrollableCheckboxListSx: SxProps<Theme> = {
  border: 1,
  borderColor: "divider",
  borderRadius: 1,
  p: 1,
  maxHeight: 260,
  overflowY: "auto",
};
