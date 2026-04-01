import { useEffect, useState } from "react";
import { getNotificationById, markAsRead, type NotificationDetailResponse } from "../../api/notification.api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Avatar, Box, CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material";
import {
    pageContentPaperSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

export default function NotificationDetail(){
    const { notificationId } = useParams();
    const [notification, setNotification] = useState<NotificationDetailResponse>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!notificationId) return;

        setLoading(true);
        getNotificationById(Number(notificationId))
            .then((data) => setNotification(data))
            .catch(() => toast.error("Error loading notification"))
            .finally(() => setLoading(false));
    }, [notificationId]);

    useEffect(() => {
        if (!notificationId) return;
        void markAsRead(Number(notificationId));
    }, [notificationId]);

    if (loading) {
        return (
            <Box sx={pageRootSx}>
                <Paper variant="outlined" sx={pageContentPaperSx}>
                    <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
                        <CircularProgress />
                    </Box>
                </Paper>
            </Box>
        );
    }

    if (!notification) {
        return (
            <Box sx={pageRootSx}>
                <Paper variant="outlined" sx={pageContentPaperSx}>
                    <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                        <Typography color="text.secondary">Notification not found.</Typography>
                    </Box>
                </Paper>
            </Box>
        );
    }


    return(
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Notification
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Details and message.
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={pageContentPaperSx}>
                <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar>
                            {notification.sender === null ? "S" : notification.sender?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography fontWeight={600}>
                                {notification.sender === null ? "System" : notification.sender}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(notification.createdAt).toLocaleString()}
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                        {notification.title}
                    </Typography>

                    <Typography variant="body1">{notification.message}</Typography>
                </Box>
            </Paper>
        </Box>
    )
}