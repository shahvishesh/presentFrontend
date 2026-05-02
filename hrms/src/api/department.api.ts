import axiosInstance from "./axiosInstance";

export type DepartmentResponse = {
    id: number;
    departmentName: string;
}

export const getDepartments = async (): Promise<DepartmentResponse[]> => {
    const res = await axiosInstance.get<DepartmentResponse[]>("/department");
    return res.data;
}

export interface DepartmentRequest {
  departmentName: string;
}

// CREATE
export const createDepartment = async (
  data: DepartmentRequest
): Promise<DepartmentResponse> => {
  const res = await axiosInstance.post("/department", data);
  return res.data;
};

// UPDATE
export const updateDepartment = async (
  id: number,
  data: DepartmentRequest
): Promise<DepartmentResponse> => {
  const res = await axiosInstance.put(`/department/${id}`, data);
  return res.data;
};

// DELETE
export const deleteDepartment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/department/${id}`);
};
