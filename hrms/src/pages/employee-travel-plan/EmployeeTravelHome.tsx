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

export default function EmployeeTravelHome() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 3, textAlign: "left" }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        My Travel
      </Typography>

      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            variant="outlined"
            sx={{ height: "100%", borderColor: "divider", boxShadow: 1 }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Submit Expense
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submit expenses for an approved travel plan.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/Etravel/Elist")}
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
                Submit Document
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload documents required for your travel.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/Etravel/Dlist")}
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
                View Travels
              </Typography>
              <Typography variant="body2" color="text.secondary">
                See your travel plans and their status.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/Etravel/travels")}
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