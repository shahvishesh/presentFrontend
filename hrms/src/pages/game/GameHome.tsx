import { Button, Card, CardContent, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RoleGuard from "../../components/RoleGuard";

export default function GameHome() {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <h3>Manage game interest</h3>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/game/interest")}
              >
                Go
              </Button>
            </CardContent>
          </Card>
        </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Card>
          <CardContent>
            <h3>View Slots</h3>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/game/choose")}
            >
              Register Slot
            </Button>
          </CardContent>
        </Card>
      </Grid>

    <Grid size={{ xs: 12, sm: 4 }}>
        <Card>
          <CardContent>
            <h3>View Active Registrations</h3>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/game/choose/game")}
            >
              View
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Card>
          <CardContent>
            <h3>View Cancelled Bookings</h3>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/game/slot/booking/cancelled")}
            >
              View
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Card>
          <CardContent>
            <h3>View Completed Bookings</h3>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/game/slot/booking/completed")}
            >
              View
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Card>
          <CardContent>
            <h3>View Upcoming Bookings</h3>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/game/slot/booking/upcoming")}
            >
              View
            </Button>
          </CardContent>
        </Card>
      </Grid>

    <RoleGuard role="ROLE_HR">

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <h3>Add game configuration</h3>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/game/configure/create")}
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <h3>Update Configuration</h3>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/game/configure/update")}
              >
                Update
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
    </RoleGuard>

    </Grid>
  );
}