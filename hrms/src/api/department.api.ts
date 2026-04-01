import axiosInstance from "./axiosInstance";

export type DepartmentResponse = {
    id: number;
    departmentName: string;
}

export const getDepartments = async (): Promise<DepartmentResponse[]> => {
    const res = await axiosInstance.get<DepartmentResponse[]>("/department");
    return res.data;
}