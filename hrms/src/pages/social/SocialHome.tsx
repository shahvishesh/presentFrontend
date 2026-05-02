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

export default function SocialHome() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 3, textAlign: "left" }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Social
      </Typography>

      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            variant="outlined"
            sx={{ height: "100%", borderColor: "divider", boxShadow: 1 }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                View Posts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse all social posts across the organization.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/social/all")}
              >
                Open
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
                Create Post
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share updates, ideas, and announcements with your team.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/social/create")}
              >
                Create
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
                My Posts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track and manage posts you have created.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/social/post/my")}
              >
                Open
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}