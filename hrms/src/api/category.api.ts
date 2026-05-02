import axiosInstance from "./axiosInstance";

export type CategoryType = {
    id: number;
    categoryName: string;
}

export const getCategoryType = async (): Promise<CategoryType[]> => {
    const res = await axiosInstance.get<CategoryType[]>("/category");
    return res.data;
}

export interface ExpenseCategoryCreate {
  name: string;
}

export const createCategoryType = async (data: ExpenseCategoryCreate): Promise<CategoryType> => {
    const res = await axiosInstance.post<CategoryType>("/category", data);
    return res.data;
}

export interface ExpenseCategoryUpdate {
  name: string;
}

export const updateCategoryType = async (categoryTypeId: number, data: ExpenseCategoryUpdate): Promise<CategoryType> => {
    const res = await axiosInstance.put<CategoryType>(`/category/${categoryTypeId}`, data);
    return res.data;
}

export const deleteCategoryType = async (categoryTypeId: number) => {
    await axiosInstance.delete(`/category/${categoryTypeId}`);
    
}
