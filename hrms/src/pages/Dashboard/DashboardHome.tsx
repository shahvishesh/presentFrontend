import { Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../../context/useAuth";

export default function DashboardHome(){
    const { user } = useAuth();

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Welcome {user?.username}</Typography>
                <Typography color="text.secondary">
                
                    HRMS  Dashboard
                </Typography>
            </CardContent>
        </Card>
    )
}