import axios from "axios";
import axiosInstance from "./axiosInstance";

export interface CreateJobRequest{
    title: string;
    description: string;
    companyName: string;
    location: string;
    minExperience: number;
    maxExperience: number;
    jobType: string;
    workPlaceType: string;
    reviewerIds: number[];
}

export interface JobResponse{
    id: number;
    title: string;
    description: string;
    companyName: string;
    location: string;
    minExperience: number;
    maxExperience: number;
    jobType: string;
    workPlaceType: string;  
    status: string; 
}

export const createJob = async (data: CreateJobRequest): Promise<JobResponse> => {
    const res = await axiosInstance.post<JobResponse>("/job/create", data);
    return res.data;

}

export const getAllJobs = async (): Promise<JobResponse[]> => {
    const res = await axiosInstance.get<JobResponse[]>("/job");
    return res.data;

}

export const getJobById = async (id: number): Promise<JobResponse> => {
    const res = await axiosInstance.get<JobResponse>(`/job/${id}`);
    return res.data;

}

export const deleteJob = async (jobId: number) => {
    await axiosInstance.delete(`/job/${jobId}`);
}


export interface GiveReferral{
    comment: string;
    friendName: string;
    friendEmail: string;
}

export interface ReferralResponse{
    id: number;
    comment?: string;
    friendName: string;
    friendEmail?: string;
}

export const giveReferral = async (
    jobId: number,
    data: GiveReferral,
    file: File
): Promise<ReferralResponse> => {
    const formData = new FormData();

    formData.append(
        "data",
        new Blob([JSON.stringify(data)],{
            type: "application/json",
        })
    );

    formData.append("file", file);
    
    const res = await axiosInstance.post<ReferralResponse>(`/job/${jobId}/refer`, formData);
    return res.data;
}

export type ShareJob = {
    email: string;
}

export const shareJob = async (jobId: number, data: ShareJob) => {
    await axiosInstance.post(`/share/job/${jobId}`, data);
}

export type ViewReferralResponse = {
    id: number;
    employeeName: string;
    comment: string;
    friendName: string;
    friendEmail: string;
    fileName: string;

}

export const getReferrralByJobId = async (id: number): Promise<ViewReferralResponse []> => {
    const res = await axiosInstance.get<ViewReferralResponse[]>(`/job/referral/${id}`);
    return res.data;

}

export interface UpdateJobRequest{
    title: string;
    description: string;
    location: string;
    companyName: string;
    minExperience: number;
    maxExperience: number;
    jobType: string;
    workPlaceType: string;
    jobCvReviewerIds: number[];
}

export interface JobDetail{
    id: number;
    title: string;
    description: string;
    companyName: string;
    location: string;
    minExperience: number;
    maxExperience: number;
    jobType: string;
    workPlaceType: string;  
    status: string; 
    reviewerIds: number[];
}

export const updateJob = async(jobId: number, data: UpdateJobRequest): Promise<JobResponse> => {
    const res = await axiosInstance.patch<JobResponse>(`/job/update/${jobId}`, data);
    return res.data;
}

export const getJobDetailById = async (id: number): Promise<JobDetail> => {
    const res = await axiosInstance.get<JobDetail>(`/job/${id}/detail`);
    return res.data;

}


// private long id;
//     private String employeeName;
//     private String comment;
//     private String friendName;
//     private String friendEmail;
//     private String fileName;