import axiosInstance from "./axiosInstance";

export type CategoryType = {
    id: number;
    categoryName: string;
}

export const getCategoryType = async (): Promise<CategoryType[]> => {
    const res = await axiosInstance.get<CategoryType[]>("/category");
    return res.data;
}

