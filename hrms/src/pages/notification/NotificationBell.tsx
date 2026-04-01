import React, { useState, useRef, useEffect } from "react";
import {
  IconButton,
  Badge,
  Paper,
  List,
  ListItem,
  ListItemText,
  ClickAwayListener,
  Popper,
  Box,
  Typography
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getUnreadNotifications, type NotificationListResponse } from "../../api/notification.api";
import { toast } from "react-toastify";
import NotificationItem from "./NotificationItem";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  // const notifications: string[] = [
  //   "New message from John",
  //   "Your report is ready",
  //   "System update available"
  // ];

  const[notifications, setNotifications] = useState<NotificationListResponse[]>([]);
  useEffect(() => {
    getUnreadNotifications()
    .then((data) => setNotifications(data))
    .catch(() => toast.error("Cannot load notifications"));
  }, [])

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

//   const handleClickAway = (event: MouseEvent | TouchEvent) => {
//     if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
//       return; 
//     }
//     setOpen(false);
//   };

    const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        color="inherit"
        ref={anchorRef}
        onClick={handleToggle}
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        disablePortal
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                backgroundColor: "white",
                transform: "rotate(45deg)",
                display: "inline-block",
                position: "absolute",
                top: -5,
                right: 15
                
              }}
            />
            <Paper
              sx={{
                width: 280,
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              <List dense>
                {notifications.map((notification, index) => (
                  <ListItem key={notification.id} divider>
                    <NotificationItem 
                      {...notification}
                    />
                  </ListItem>
                ))}
                {notifications.length == 0 && (
                  <Typography>
                    No new notifications
                  </Typography>
                )}
              </List>
            </Paper>
          </Box>
        </ClickAwayListener>
      </Popper>
    </>
  );
}