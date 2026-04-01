import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  getEmployeeProfile,
  type EmployeeDetailResponse,
} from "../../api/employee.api";

export default function EmployeeProfile() {
  const [profile, setProfile] = useState<EmployeeDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployeeProfile()
      .then((res) => setProfile(res))
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 64, height: 64 }}>
              {profile.fullName?.charAt(0)}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight={600}>
                {profile.fullName}
              </Typography>

              <Typography color="text.secondary">
                {profile.designation}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2}>
            <Typography>
              <strong>Email:</strong> {profile.email}
            </Typography>

            <Typography>
              <strong>Phone:</strong> {profile.phoneNumber}
            </Typography>

            <Typography>
              <strong>Department:</strong> {profile.departmentName}
            </Typography>

            <Typography>
              <strong>Manager:</strong> {profile.managerName || "N/A"}
            </Typography>

            <Typography>
              <strong>Joining Date:</strong>{" "}
              {new Date(profile.joiningDate).toLocaleDateString()}
            </Typography>

            <Typography>
              <strong>Date of Birth:</strong>{" "}
              {new Date(profile.dateOfBirth).toLocaleDateString()}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}