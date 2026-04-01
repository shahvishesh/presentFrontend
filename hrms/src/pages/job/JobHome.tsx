import { Button, Card, CardContent, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RoleGuard from "../../components/RoleGuard";

export default function JobHome() {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card>
          <CardContent>
            <h3>View Jobs</h3>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/job/list")}
            >
              Go
            </Button>
          </CardContent>
        </Card>
      </Grid>

    <RoleGuard role="ROLE_HR">

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <h3>Post a Job</h3>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/job/create")}
              >
                Post
              </Button>
            </CardContent>
          </Card>
        </Grid>
    </RoleGuard>

     <RoleGuard role="ROLE_HR">

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <h3>Manage Job</h3>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/job/close")}
              >
                Go
              </Button>
            </CardContent>
          </Card>
        </Grid>
    </RoleGuard>

    <RoleGuard role="ROLE_HR">

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <h3>View Referrals</h3>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/job/referral/list")}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>
    </RoleGuard>
    </Grid>
  );
}