import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
 
type SidebarProps = {
  drawerWidth: number;
};
 
export default function Sidebar({ drawerWidth }: SidebarProps) {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
 
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
 
      <List>
 
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
 
        {hasRole("ROLE_HR") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard/travel")}>
                <ListItemText primary="Travel Plan Management" />
              </ListItemButton>
            </ListItem>
 
            {/* <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard/job")}>
                <ListItemText primary="Job" />
              </ListItemButton>
            </ListItem> */}
 
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard/expense")}>
                <ListItemText primary="Expense Management" />
              </ListItemButton>
            </ListItem>
          
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard/employee")}>
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
          </>
        )}
 
        {hasRole("ROLE_EMPLOYEE") && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/dashboard/Etravel")}>
              <ListItemText primary="Your Travel Plans" />
            </ListItemButton>
          </ListItem>
        )}

        {hasRole("ROLE_MANAGER") && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/dashboard/team")}>
              <ListItemText primary="Team" />
            </ListItemButton>
          </ListItem>
        )}

        {hasRole("ROLE_ADMIN") && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/dashboard/user")}>
              <ListItemText primary="Role Management" />
            </ListItemButton>
          </ListItem>
        )}
 
        {(hasRole("ROLE_HR") || hasRole("ROLE_EMPLOYEE")) && (
        <>
        
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/dashboard/chart")}>
              <ListItemText primary="Organization Chart" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard/job")}>
                <ListItemText primary="Job" />
              </ListItemButton>
            </ListItem>

          <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard/social")}>
                <ListItemText primary="Social" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard/game")}>
                <ListItemText primary="Game" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/dashboard/notification")}>
              <ListItemText primary="Notification" />
            </ListItemButton>
          </ListItem>
        </>


        )}
 
      </List>
    </Drawer>
  );
}