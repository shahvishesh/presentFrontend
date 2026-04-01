import axiosInstance from "./axiosInstance";


export interface EmployeeRoleResponse{
    id: number;
    firstName: string;
    lastName: string;
    designation: string;
    department: string;
    roles: string[];
}

export const getUsers = async ():Promise<EmployeeRoleResponse[]> => {
    const res = await axiosInstance.get<EmployeeRoleResponse[]>("/role");
    return res.data;
}

export interface UpdateUserRole {
        roles: string[];

}

export const updateUserRole = async (userId: number, data: UpdateUserRole) => {
    await axiosInstance.patch(`/role/update/${userId}`, data);
}

export interface UserRoleDetailResponse {
    userId: number;
    name: string;
    assignedRoles: string[];
    allRoles: string[];
}

export const getUserDetail = async (userId: number): Promise<UserRoleDetailResponse> => {
    const res = await axiosInstance.get<UserRoleDetailResponse>(`/role/user/${userId}`);
    return res.data;
}