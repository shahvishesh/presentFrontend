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

export default function ManagerHome() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 3, textAlign: "left" }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Team
      </Typography>

      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            variant="outlined"
            sx={{ height: "100%", borderColor: "divider", boxShadow: 1 }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                View your team
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse your assigned team members.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/team/all")}
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