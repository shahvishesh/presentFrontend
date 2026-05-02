import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RoleGuard from "../../components/RoleGuard";

export default function ConfigHome() {
  const navigate = useNavigate();

  const configItems = [
    {
      title: "Manage Document Type",
      description: "Create and maintain document type definitions.",
      path: "/dashboard/config/document",
      buttonLabel: "Open",
      buttonVariant: "outlined" as const,
    },
    {
      title: "Manage Category Type",
      description: "Set up and update employee category options.",
      path: "/dashboard/config/category",
      buttonLabel: "Open",
      buttonVariant: "contained" as const,
    },
    {
      title: "Manage Tag Types",
      description: "Control available tags used across records.",
      path: "/dashboard/config/tag",
      buttonLabel: "Open",
      buttonVariant: "contained" as const,
    },
    {
      title: "Manage Game",
      description: "Configure game entries and their settings.",
      path: "/dashboard/config/game",
      buttonLabel: "Open",
      buttonVariant: "contained" as const,
    },
    {
      title: "Manage Departments",
      description: "Add, edit, and organize company departments.",
      path: "/dashboard/config/department",
      buttonLabel: "Open",
      buttonVariant: "contained" as const,
    },
  ];

  return (
    <RoleGuard role="ROLE_HR">
      <Box sx={{ py: 3, textAlign: "left" }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Configuration
        </Typography>

        <Grid container spacing={2} alignItems="stretch">
          {configItems.map((item) => (
            <Grid key={item.path} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{ height: "100%", borderColor: "divider", boxShadow: 1 }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
                  <Button
                    variant={item.buttonVariant}
                    onClick={() => navigate(item.path)}
                  >
                    {item.buttonLabel}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </RoleGuard>
  );
}