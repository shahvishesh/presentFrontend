import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
 
type SidebarProps = {
  drawerWidth: number;
};
 
export default function NewSidebar({ drawerWidth }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();

  const isSelected = (targetPath: string, options?: { exact?: boolean }) => {
    const exact = options?.exact ?? false;
    const currentPath = location.pathname;

    if (exact) return currentPath === targetPath;
    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  };

  const itemSx = {
    mx: 1,
    my: 0.5,
    borderRadius: 1,
    px: 2,
    py: 1,
    minHeight: 44,
    justifyContent: "flex-start",
    borderLeft: 4,
    borderLeftStyle: "solid",
    borderLeftColor: "transparent",
    color: "text.secondary",
    "& .MuiListItemText-primary": {
      typography: "body2",
    },
    "&:hover": {
      bgcolor: "action.hover",
      color: "text.primary",
    },
    "&.Mui-selected": {
      bgcolor: "action.selected",
      borderLeftColor: "primary.main",
      color: "text.primary",
      "&:hover": {
        bgcolor: "action.selected",
      },
    },
    "&.Mui-selected .MuiListItemText-primary": {
      fontWeight: 600,
    },
  };
 
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRightColor: "divider",
          bgcolor: "background.paper",
          pt: 1,
        },
      }}
    >
      <Toolbar />
 
      <List sx={{ py: 1 }}>
 
        <ListItem disablePadding>
          <ListItemButton
            selected={isSelected("/dashboard", { exact: true })}
            sx={itemSx}
            onClick={() => navigate("/dashboard")}
          >
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
 
        {hasRole("ROLE_HR") && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                selected={isSelected("/dashboard/travel")}
                sx={itemSx}
                onClick={() => navigate("/dashboard/travel")}
              >
                <ListItemText primary="Travel Plan Management" />
              </ListItemButton>
            </ListItem>
 
            {/* <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard/job")}>
                <ListItemText primary="Job" />
              </ListItemButton>
            </ListItem> */}
 
            <ListItem disablePadding>
              <ListItemButton
                selected={isSelected("/dashboard/expense")}
                sx={itemSx}
                onClick={() => navigate("/dashboard/expense")}
              >
                <ListItemText primary="Expense Management" />
              </ListItemButton>
            </ListItem>
          
            <ListItem disablePadding>
              <ListItemButton
                selected={isSelected("/dashboard/employee")}
                sx={itemSx}
                onClick={() => navigate("/dashboard/employee")}
              >
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
          </>
        )}
 
        {hasRole("ROLE_EMPLOYEE") && (
          <ListItem disablePadding>
            <ListItemButton
              selected={isSelected("/dashboard/Etravel")}
              sx={itemSx}
              onClick={() => navigate("/dashboard/Etravel")}
            >
              <ListItemText primary="Your Travel Plans" />
            </ListItemButton>
          </ListItem>
        )}

        {hasRole("ROLE_MANAGER") && (
          <ListItem disablePadding>
            <ListItemButton
              selected={isSelected("/dashboard/team")}
              sx={itemSx}
              onClick={() => navigate("/dashboard/team")}
            >
              <ListItemText primary="Team" />
            </ListItemButton>
          </ListItem>
        )}

        {hasRole("ROLE_ADMIN") && (
          <ListItem disablePadding>
            <ListItemButton
              selected={isSelected("/dashboard/user")}
              sx={itemSx}
              onClick={() => navigate("/dashboard/user")}
            >
              <ListItemText primary="User and Role Management" />
            </ListItemButton>
          </ListItem>
        )}
 
        {(hasRole("ROLE_HR") || hasRole("ROLE_EMPLOYEE")) && (
        <>
        
          <ListItem disablePadding>
            <ListItemButton
              selected={isSelected("/dashboard/chart")}
              sx={itemSx}
              onClick={() => navigate("/dashboard/chart")}
            >
              <ListItemText primary="Organization Chart" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={isSelected("/dashboard/notification")}
              sx={itemSx}
              onClick={() => navigate("/dashboard/notification")}
            >
              <ListItemText primary="Notification" />
            </ListItemButton>
          </ListItem>
        </>


        )}
 
      </List>
    </Drawer>
  );
}