import axiosInstance from "./axiosInstance";

export type NotificationListResponse = {
    id: number;
    title: string;
    message: string;
    referenceType: string;
    referenceId: number;
    sender: string;
    createdAt: string;
}


export const getAllNotifications = async ():Promise<NotificationListResponse[]> => {
    const res = await axiosInstance.get<NotificationListResponse[]>("notification/all");
    return res.data;
}

export type NotificationDetailResponse = {
    id: number;
    title: string;
    message: string;
    referenceType: string;
    referenceId: number;
    sender: string;
    createdAt: string;
}

export const getNotificationById = async (notificationId: number):Promise<NotificationDetailResponse> => {
    const res = await axiosInstance.get<NotificationDetailResponse>(`notification/${notificationId}`);
    return res.data;
}

export const markAsRead = async (notificationId: number) => {
    await axiosInstance.patch(`notification/${notificationId}/mark`);
}

export const getUnreadNotifications = async ():Promise<NotificationListResponse[]> => {
    const res = await axiosInstance.get<NotificationListResponse[]>("notification/unread");
    return res.data;
}