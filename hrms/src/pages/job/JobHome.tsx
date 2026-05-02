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

export default function JobHome() {
  const navigate = useNavigate();

  const ActionCard = ({
    title,
    description,
    buttonLabel,
    buttonVariant = "outlined",
    onClick,
  }: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonVariant?: "contained" | "outlined";
    onClick: () => void;
  }) => (
    <Card
      variant="outlined"
      sx={{ height: "100%", borderColor: "divider", boxShadow: 1 }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
        <Button variant={buttonVariant} onClick={onClick}>
          {buttonLabel}
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ py: 3, textAlign: "left" }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Jobs
      </Typography>

      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ActionCard
            title="View Jobs"
            description="Browse all current job postings and details."
            buttonLabel="Open list"
            buttonVariant="outlined"
            onClick={() => navigate("/dashboard/job/list")}
          />
        </Grid>

        <RoleGuard role="ROLE_HR">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ActionCard
              title="Post a Job"
              description="Create a new job opening for candidates."
              buttonLabel="Create"
              buttonVariant="contained"
              onClick={() => navigate("/dashboard/job/create")}
            />
          </Grid>
        </RoleGuard>

        <RoleGuard role="ROLE_HR">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ActionCard
              title="Manage Job"
              description="Close positions and manage existing openings."
              buttonLabel="Manage"
              buttonVariant="contained"
              onClick={() => navigate("/dashboard/job/close")}
            />
          </Grid>
        </RoleGuard>

        <RoleGuard role="ROLE_HR">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ActionCard
              title="View Referrals"
              description="Review employee referrals and related details."
              buttonLabel="View"
              buttonVariant="contained"
              onClick={() => navigate("/dashboard/job/referral/list")}
            />
          </Grid>
        </RoleGuard>
      </Grid>
    </Box>
  );
}