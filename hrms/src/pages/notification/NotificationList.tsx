import { useNavigate } from "react-router-dom"
import { getAllNotifications, type NotificationListResponse } from "../../api/notification.api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    Avatar,
    Box,
    Divider,
    List,
    ListItemAvatar,
    ListItemButton,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import {
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
    pageScrollableAreaSx,
    pageScrollableContentPaperSx,
} from "../../components/page/pageStyles";

export default function NotificationList(){
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationListResponse[]>();

    useEffect(() => {
        getAllNotifications()
        .then((data) => setNotifications(data))
        .catch(() => toast.error("Error loading notifications"));
    }, []);

    const MAX_LENGTH = 100;
    return(
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Notifications
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Latest updates and system messages.
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={pageScrollableContentPaperSx}>
                <List
                    disablePadding
                    sx={pageScrollableAreaSx}
                >
                    {notifications?.map((notification, index) => (
                        <Box key={notification.id}>
                            <ListItemButton
                                onClick={() => navigate(`/dashboard/notification/${notification.id}`)}
                                sx={{
                                    width: "100%",
                                    alignItems: "flex-start",
                                    px: { xs: 2, sm: 2.5 },
                                    py: 2,
                                }}
                            >
                                <ListItemAvatar sx={{ minWidth: 48, mt: 0.25 }}>
                                    <Avatar>
                                        {notification.sender === null
                                            ? "S"
                                            : notification.sender?.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>

                                <Box sx={{ flex: 1 }}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="baseline"
                                        gap={2}
                                    >
                                        <Typography fontWeight={600}>
                                            {notification.sender === null ? "System" : notification.sender}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ whiteSpace: "nowrap" }}
                                        >
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </Typography>
                                    </Stack>

                                    <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 0.5 }}>
                                        {notification.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                        {notification.message.length > MAX_LENGTH
                                            ? notification.message.substring(0, MAX_LENGTH) + "..."
                                            : notification.message}
                                    </Typography>
                                </Box>
                            </ListItemButton>

                            {index !== (notifications?.length ?? 0) - 1 && <Divider />}
                        </Box>
                    ))}

                    {notifications?.length === 0 && (
                        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                            <Typography color="text.secondary">No notifications found</Typography>
                        </Box>
                    )}
                </List>
            </Paper>
        </Box>
    )
}