import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import NotificationBell from "../pages/notification/NotificationBell";
import { useUser } from "../context/useUser";

type NavbarProps = {
    drawerWidth: number;
}

export default function Navbar({ drawerWidth }: NavbarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setUser, user } = useUser();

  const handleLogout = () => {
    logout();
    setUser(null); 
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: 1201, ml: `${drawerWidth}px` }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor:"pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Worksphere
        </Typography>

        <NotificationBell/>

        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>

        <Avatar
  src={
    user?.profileImageUrl
      ? `http://localhost:8080${user.profileImageUrl}`
      : undefined
  }
  onClick={() => navigate("/dashboard/profile")}
  sx={{
    cursor: "pointer",
    ml: 2,
    "&:hover": { opacity: 0.8 },
  }}
>
  {!user?.profileImageUrl && user?.firstName?.charAt(0)}
</Avatar>

      </Toolbar>
    </AppBar>
  );
}