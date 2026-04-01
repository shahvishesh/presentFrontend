import axiosInstance from "./axiosInstance";

export interface EmployeeResponse{
    id: number;
    firstName: string;
    lastName: string;
    designation: string;
    department: string;
    managerId: number | null;
}

export const getEmployees = async (): Promise<EmployeeResponse []> => {
    const res = await axiosInstance.get<EmployeeResponse []>("/employee");
    return res.data;
}

export const getInterestedEmployees = async (gameSlotId: number): Promise<EmployeeResponse []> => {
    const res = await axiosInstance.get<EmployeeResponse []>(`/game-interest/${gameSlotId}/employees`);
    return res.data;
}

export const getEmployeeById = async (employeeId: number): Promise<EmployeeResponse> => {
    const res = await axiosInstance.get<EmployeeResponse>(`/employee/${employeeId}`);
    return res.data;
}

export const getAvailableEmploye = async ():Promise<EmployeeDetailResponse[]> => {
 const res = await axiosInstance.get<EmployeeDetailResponse[]>("/employee/available-employees");
 return res.data;
}

export const getEmployeeDetail = async (): Promise<EmployeeResponse> => {
    const res = await axiosInstance.get<EmployeeResponse>(`/employee/me`);
    return res.data;
}

export const getManagerialChain = async (employeeId: number): Promise<EmployeeResponse[]> => {
    const res = await axiosInstance.get<EmployeeResponse[]>(`/employee/${employeeId}/manager-chain`);
    return res.data;
}

export const getEmployeesByManagerId = async (employeeId: number): Promise<EmployeeResponse[]> => {
    const res = await axiosInstance.get<EmployeeResponse[]>(`/employee/manager/${employeeId}`);
    return res.data;
}

export const getEmployeesByManager = async (): Promise<EmployeeResponse[]> => {
    const res = await axiosInstance.get<EmployeeResponse[]>(`/employee/manager/employees`);
    return res.data;
}

export type AddEmployeeRequest = {
  dateOfBirth: string | undefined;
  designation: string;
  email: string;
  firstName: string;
  lastName: string;
  joiningDate: string | undefined;
  phoneNumber: string;
  salary: number;
  departmentId: number;
  managerId?: number | null;
}

export const addEmployee = async (data: AddEmployeeRequest) => {
  await axiosInstance.post("/employee/create", data);
}

export type EmployeeDetailResponse = {
    id: number;
    fullName: string;
    email: string;
    designation: string;
    phoneNumber: string;
    joiningDate: string;
    dateOfBirth: string;
    departmentName: string;
    managerName?: string;
}

export const getEmployeeProfile = async ():Promise<EmployeeDetailResponse> => {
    const res = await axiosInstance.get<EmployeeDetailResponse>("/employee/profile");
    return res.data;
}

export const getEmployeeProfileList = async ():Promise<EmployeeDetailResponse[]> => {
    const res = await axiosInstance.get<EmployeeDetailResponse[]>("/employee/profiles");
    return res.data;
}


export type EmployeeProfileDetail = {
    employeeId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    joiningDate: string;
    dateOfBirth: string;
    salary: number;
    designation: string;
    departmentId: number;
    managerId: number;
}

export const getEmployeeProfileById = async (employeeId: number):Promise<EmployeeProfileDetail> => {
    const res = await axiosInstance.get<EmployeeProfileDetail>(`/employee/profile/${employeeId}`);
    return res.data;
}

export type UpdateEmployeeProfile = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    joiningDate: string | undefined;
    dateOfBirth: string | undefined;
    salary: number;
    designation: string;
    departmentId: number;
    managerId: number | null;
}

export const updateEmployeeProfileById = async (employeeId: number, data: UpdateEmployeeProfile) => {
    const res = await axiosInstance.patch(`/employee/update/${employeeId}`, data);
    return res.data;
}

export const deleteEmployeeById = async (employeeId: number) => {
    await axiosInstance.delete(`/employee/delete/${employeeId}`);
    
}