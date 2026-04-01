import axiosInstance from "./axiosInstance";
import type { EmployeeResponse } from "./employee.api";

export type TravelPlanRequest= {
    title: string;
    description: string;
    sourceLocation: string;
    destinationLocation: string;
    isInternational: boolean;
    startDate: string | undefined;
    endDate: string | undefined;
    employees: EmployeeTravel[];
}

export type EmployeeTravel={
    employeeId: number;
}

export type TravelPlanResponse={
    travelPlanId: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    sourceLocation: string;
    destinationLocation: string;
    isInternational: boolean;
    createdAt: string;
    createdById: number;
}

export type TravelPlanDetail={
    travelPlanId: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    sourceLocation: string;
    destinationLocation: string;
    isInternational: boolean;
    createdAt: string;
    createdById: number;
    participants: EmployeeResponse[];
}


export const createTravelPlan = async (data: TravelPlanRequest): Promise<TravelPlanResponse> => {
    const res = await axiosInstance.post<TravelPlanResponse>("/travel/create", data);
    return res.data;
}

export const getAllPlans = async (): Promise<TravelPlanResponse[]> => {
    const res = await axiosInstance.get<TravelPlanResponse[]>("/travel");
    return res.data;
}

export const getAllTravelPlanByStatus = async (status: string): Promise<TravelPlanResponse[]> => {
    const res = await axiosInstance.get<TravelPlanResponse[]>(`/travel/filter`, 
{
    params: { status }
  }
)
    return res.data;
}

export const getTravelPlanByid = async (id: number): Promise<TravelPlanResponse> => {
    const res = await axiosInstance.get<TravelPlanResponse>(`/travel/${id}`);
    return res.data;
}

export const getEmployeeTravelPlans = async (): Promise<TravelPlanResponse[]> => {
    const res = await axiosInstance.get<TravelPlanResponse[]>("/travel/employee");
    return res.data;
}

export const getTravelParticipants = async (id: number): Promise<EmployeeResponse[]> => {
    const res = await axiosInstance.get<EmployeeResponse[]>(`/travel/${id}/participants`);
    return res.data;
}

export const deleteTravelPlan = async (travelPlanId: number) => {
    await axiosInstance.delete(`/travel/delete/${travelPlanId}`);
}

export const getTravelPlanByStatus = async (status: string): Promise<TravelPlanResponse[]> => {
    const res = await axiosInstance.get<TravelPlanResponse[]>(`/travel/employee/filter`, 
{
    params: { status }
  }
)
    return res.data;
}

export const getTravelPlanDetailByid = async (id: number): Promise<TravelPlanDetail> => {
    const res = await axiosInstance.get<TravelPlanDetail>(`/travel/detail/${id}`);
    return res.data;
}

export const getTravelPlanByEmployeeId = async (employeeId: number): Promise<TravelPlanResponse[]> => {
    const res = await axiosInstance.get<TravelPlanResponse[]>(`/travel/employee/${employeeId}`);
    return res.data;
}

export const getTravelPlanByEmployeeIdAndStatus = async (employeeId: number,status: string): Promise<TravelPlanResponse[]> => {
    const res = await axiosInstance.get<TravelPlanResponse[]>(`/travel/employee/${employeeId}/filter`, 
{
    params: { status }
  }
)
    return res.data;
}


export type UpdateTravelPlanRequest= {
    title: string;
    description: string;
    sourceLocation: string;
    destinationLocation: string;
    isInternational: boolean;
    startDate: string | undefined;
    endDate: string | undefined;
    employeeIds: number[];
}

export const updateTravelPlan = async (travelPlanId: number, data: UpdateTravelPlanRequest):Promise<TravelPlanResponse> => {
    const res = await axiosInstance.patch<TravelPlanResponse>(`/travel/update/${travelPlanId}`, data);
    return res.data;
}