import { Button, Card, CardContent, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SocialHome() {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card>
          <CardContent>
            <h3>View Posts</h3>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/social/all")}
            >
              Go
            </Button>
          </CardContent>
        </Card>
      </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <h3>Create Post</h3>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/social/create")}
              >
                Create
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <h3>Your posts</h3>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/social/post/my")}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>
    </Grid>
  );
}