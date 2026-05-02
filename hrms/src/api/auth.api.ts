import type { CurrentUser } from "../context/UserContexr";
import axiosInstance from "./axiosInstance";

interface LoginRequest {
    username: string;
    password: string;
}

type Role = "HR" | "EMPLOYEE" | "MANAGER" 

interface RegisterRequest {
    username: string;
    //email:string;
    password: string;
    employeeId: number;
    roles: Role[];

}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ValidateResetTokenResponse {
  valid: boolean;
}

interface SignupResponse {
  username: string;
  email: string;
}

export const login = async (data: LoginRequest): Promise<string> => {
  const response = await axiosInstance.post<string>("/auth/login", data);
  return response.data;
};

export const signup = async (data: RegisterRequest): Promise<SignupResponse> => {
  const response = await axiosInstance.post<SignupResponse>("/auth/signup", data);
  return response.data;
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const res = await axiosInstance.get<CurrentUser>("/auth/me");
  return res.data;
};

export const requestPasswordReset = async (data: ForgotPasswordRequest): Promise<void> => {
  await axiosInstance.post("/auth/forgot-password", data);
};

export const validateResetToken = async (token: string): Promise<boolean> => {
  const response = await axiosInstance.get<ValidateResetTokenResponse>("/auth/validate-reset-token", {
    params: { token },
  });
  return response.data.valid;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await axiosInstance.post("/auth/reset-password", data);
};


// "dateOfBirth": "2002-08-12",
//     "designation": "Backend Engineer",
//     "email": "jay@gmail.com",
//     "firstName": "Jay",
//     "lastName": "Parekh",
//     "joiningDate": "2021-03-15",
//     "phoneNumber": "8876890678",
//     "salary": 70000,
//     "departmentId": 1,
//     "managerId": 2