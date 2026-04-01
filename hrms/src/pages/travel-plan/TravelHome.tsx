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

export default function TravelHome() {
  const navigate = useNavigate();

  return (
    <RoleGuard role="ROLE_HR">
      <Box sx={{ py: 3, textAlign: "left" }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Travel Plans
        </Typography>

        <Grid container spacing={2} alignItems="stretch">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{ height: "100%", borderColor: "divider", boxShadow: 1 }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Manage Travel Plans
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View, review, and update existing plans.
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/dashboard/travel/list")}
                >
                  Open list
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{ height: "100%", borderColor: "divider", boxShadow: 1 }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Create Travel Plan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start a new plan for employee travel.
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/dashboard/travel/create")}
                >
                  Create
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </RoleGuard>
  );
}