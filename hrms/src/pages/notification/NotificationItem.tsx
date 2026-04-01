import { Avatar, Stack, Typography } from "@mui/material";
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";

type NotificationItemProps = {
    id: number;
    title: string;
    message: string;
    referenceType: string;
    referenceId: number;
    sender: string;
}

export default function NotificationItem(
    {
        id,
        title,
        message,
        referenceType,
        referenceId,
        sender
    }: NotificationItemProps
){
    const navigate = useNavigate()
    const MAX_LENGTH = 50;
    let displayMessage:string = "";
    if(message.length > MAX_LENGTH){
        displayMessage = message.substring(0, MAX_LENGTH).concat("...");
    }else{
        displayMessage = message;
    }

    return(
        <>
            <Stack
                direction="row"
                spacing={2}
                sx={{py:2}}
                alignItems="flex-start"
            >
                <Avatar
                    sx={{ width: 30, height: 30}}
                >
                    {sender?.charAt(0)}
                </Avatar>
                <Stack
                    direction="column"
                    alignItems="flex-start"
                    >
                    <Typography 
                        variant="body1"
                        sx={{fontWeight:"bold"}}>
                        {title}
                    </Typography>
                    <Typography variant="subtitle2">
                        {displayMessage}
                    </Typography>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                            navigate(`/dashboard/notification/${id}`);
                        }}
                        underline="none"
                        sx={{mt:1}}
                        >
                        View details
                    </Link>
                </Stack>
            </Stack>
        </>
    )
}