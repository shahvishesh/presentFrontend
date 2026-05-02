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
  Button,
  Dialog,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  getEmployeeProfile,
  uploadProfileImage,
  type EmployeeDetailResponse,
} from "../../api/employee.api";
import { removeProfileImage } from "../../api/social.api";
import CloseIcon from "@mui/icons-material/Close";

export default function EmployeeProfile() {
  const [profile, setProfile] = useState<EmployeeDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [openImage, setOpenImage] = useState(false);

  const hasImage = !!(preview || profile?.profileImageUrl);
  const imageSrc = preview
    ? preview
    : profile?.profileImageUrl
    ? `http://localhost:8080${profile.profileImageUrl}`
    : undefined;

  useEffect(() => {
    getEmployeeProfile()
      .then((res) => setProfile(res))
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(
    () => () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    },
    [preview]
  );

  const handleFileChange = async (file: File) => {
    if (!profile) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      setPreview((prev) => {
        if (prev?.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return previewUrl;
      });

      const res = await uploadProfileImage(profile.id, file);

      setProfile((prev) =>
        prev ? { ...prev, profileImageUrl: res.imageUrl } : prev
      );

      toast.success("Profile image updated");
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleRemoveImage = async () => {
    if (!profile) return;

    try {
      await removeProfileImage(profile.id);

      setProfile((prev) =>
        prev ? { ...prev, profileImageUrl: undefined } : prev
      );

      setPreview((prev) => {
        if (prev?.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return null;
      });

      toast.success("Profile image removed");
    } catch {
      toast.error("Failed to remove image");
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;

  const profileMeta = [
    { label: "Email", value: profile.email || "N/A" },
    { label: "Phone", value: profile.phoneNumber || "N/A" },
    { label: "Department", value: profile.departmentName || "N/A" },
    { label: "Manager", value: profile.managerName || "N/A" },
    {
      label: "Joining Date",
      value: profile.joiningDate
        ? new Date(profile.joiningDate).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Date of Birth",
      value: profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toLocaleDateString()
        : "N/A",
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          background:
            "linear-gradient(160deg, rgba(10,99,132,0.08) 0%, rgba(255,255,255,1) 45%, rgba(53,162,159,0.08) 100%)",
          backdropFilter: "blur(6px)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 3 }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ width: "100%" }}
            >
              <Avatar
                src={imageSrc}
                sx={{
                  width: { xs: 78, sm: 96 },
                  height: { xs: 78, sm: 96 },
                  border: "3px solid",
                  borderColor: "background.paper",
                  //boxShadow: "0 5px 12px rgba(0, 0, 0, 0.18)",
                  cursor: hasImage ? "pointer" : "default",
                  transition: "transform 0.2s ease, filter 0.2s ease",
                  "&:hover": hasImage
                    ? {
                        filter: "brightness(0.9)",
                        transform: "scale(1.03)",
                      }
                    : undefined,
                }}
                onClick={() => {
                  if (hasImage) {
                    setOpenImage(true);
                  }
                }}
              >
                {!hasImage && profile.fullName?.charAt(0)}
              </Avatar>

              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, letterSpacing: 0.3 }}
                >
                  {profile.fullName}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.5, fontWeight: 500 }}
                >
                  {profile.designation || "Employee"}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.2} sx={{ flexShrink: 0 }}>
              <Button component="label" variant="contained" size="small">
                Change Photo
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (!e.target.files?.[0]) return;
                    handleFileChange(e.target.files[0]);
                  }}
                />
              </Button>
              <Button
                color="error"
                variant="outlined"
                size="small"
                onClick={handleRemoveImage}
                disabled={!hasImage}
              >
                Remove Photo
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: { xs: 2.5, sm: 3.5 } }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.5,
            }}
          >
            {profileMeta.map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "rgba(255,255,255,0.65)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textTransform: "uppercase", mb: 0.3 }}
                >
                  {item.label}
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>{item.value}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={openImage}
        onClose={() => setOpenImage(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(9, 18, 26, 0.72)",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setOpenImage(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.45)",
              zIndex: 1,
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            component="img"
            src={imageSrc}
            alt="Profile"
            sx={{
              width: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}