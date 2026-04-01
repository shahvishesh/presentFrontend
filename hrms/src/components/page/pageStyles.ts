import type { SxProps, Theme } from "@mui/material/styles";

export const pageRootSx: SxProps<Theme> = {
  p: { xs: 1, sm: 2 },
};

export const pageHeaderPaperSx: SxProps<Theme> = {
  pt: { xs: 2, sm: 2.5 },
  px: { xs: 2, sm: 2.5 },
  pb: 0,
  mb: 0,
  borderRadius: 2,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  overflow: "hidden",
};

export const pageHeaderStackSx: SxProps<Theme> = {
  pb: 1.5,
  mb: 2,
};

export const pageHeaderTitleSx: SxProps<Theme> = {
  fontWeight: 700,
};

export const pageTabsStripSx: SxProps<Theme> = {
  mx: { xs: -2, sm: -2.5 },
  borderTop: 1,
  borderColor: "divider",
  bgcolor: "grey.50",
};

export const pageTabsSx: SxProps<Theme> = {
  px: { xs: 1, sm: 2 },
};

export const pageContentPaperSx: SxProps<Theme> = {
  borderTop: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 2,
  borderBottomRightRadius: 2,
  overflow: "hidden",
  mb: 2,
};

export const pageScrollableContentPaperSx: SxProps<Theme> = {
  ...pageContentPaperSx,
  maxHeight: { xs: "calc(100vh - 220px)", sm: "calc(100vh - 240px)" },
  display: "flex",
  flexDirection: "column",
};

export const pageScrollableAreaSx: SxProps<Theme> = {
  flex: 1,
  overflowY: "auto",
  overscrollBehavior: "contain",
};

export const pageCenteredStateSx: SxProps<Theme> = {
  p: 6,
  textAlign: "center",
};

export const pageEmptyStateTitleSx: SxProps<Theme> = {
  fontWeight: 600,
};

export const pageStateSubtitleSx: SxProps<Theme> = {
  mt: 1.5,
};

export const pageEmptyStateSubtitleSx: SxProps<Theme> = {
  mt: 0.5,
};

export const pageDividerSx: SxProps<Theme> = {
  my: 2,
};

export const pageSectionPaperSx: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: 2,
  overflow: "hidden",
  mb: 2,
};
