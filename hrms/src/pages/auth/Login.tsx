import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material"
import { getCurrentUser, login } from "../../api/auth.api"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useUser } from "../../context/useUser";
import {
    pageContentPaperSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

interface LoginRequest {
    username: string;
    password: string;
}

interface ErrorResponse{
    message: string;
    code: number;
    timestamp: string;
}


export default function Login(){
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>({
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const navigate = useNavigate();
    //
    const { login: setAuth } = useAuth();
    const { setUser } = useUser();

    const onSubmit = async (data: LoginRequest) => {
           try{
                const token: string = await login(data);
                //localStorage.setItem("token", token);
                setAuth(token);
                //
                const user = await getCurrentUser();
                setUser(user);
                //
                toast.success("Login successful");
                navigate("/dashboard");

           }catch(error: unknown){
                if(axios.isAxiosError<ErrorResponse>(error)){
                const message = error.response?.data.message || "Login failed";
                toast.error(message);
                }else{
                    toast.error("Something went wrong");
                }
                    
           }
    }

    return(
        <Box
            sx={{
                ...pageRootSx,
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 560 }}>
                <Paper variant="outlined" sx={pageHeaderPaperSx}>
                    <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                        <Stack spacing={0.25}>
                            <Typography variant="h5" sx={pageHeaderTitleSx}>
                                Login
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sign in to continue.
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>

                <Paper variant="outlined" sx={pageContentPaperSx}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{ p: { xs: 2, sm: 2.5 } }}
                    >
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Username"
                                {...register("username", { required: "Username is required" })}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                            />

                            <TextField
                                fullWidth
                                size="small"
                                label="Password"
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />

                            <Button
                                variant="contained"
                                type="submit"
                            >
                                Login
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}