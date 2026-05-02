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

export default function GameHome() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 3, textAlign: "left" }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Games
      </Typography>

      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            variant="outlined"
            sx={{ height: "100%", borderColor: "divider", boxShadow: 1 }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Manage Game Interest
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set your game preferences and interests.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/game/interest")}
              >
                Go
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
                View Slots
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse available slots and register.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/game/choose")}
              >
                Register Slot
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
                View Bookings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your game bookings.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/game/booking")}
              >
                View
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
                Active Registrations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your active game bookings.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/game/choose/game")}
              >
                View
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            variant="outlined"
            sx={{ height: "100%", borderColor: "divider", boxShadow: 1 }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Cancelled Bookings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your cancelled game bookings.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/game/slot/booking/cancelled")}
              >
                View
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
                Completed Bookings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your completed game bookings.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/game/slot/booking/completed")}
              >
                View
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
                Upcoming Bookings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your upcoming game registrations.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/game/slot/booking/upcoming")}
              >
                View
              </Button>
            </CardActions>
          </Card>
        </Grid> */}

        <RoleGuard role="ROLE_HR">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{ height: "100%", borderColor: "divider", boxShadow: 1 }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Add Game Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a new game configuration.
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/dashboard/game/configure/create")}
                >
                  Configure
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
                  Update Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Modify existing game configurations.
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/dashboard/game/configure/update")}
                >
                  Update
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </RoleGuard>
      </Grid>
    </Box>
  );
}