import axiosInstance from "./axiosInstance";

export interface TagResponse {
  id: number;
  tagName: string;
}

export interface TagRequest {
  tagName: string;
}

export const getAllTags = async (): Promise<TagResponse[]> => {
  const response = await axiosInstance.get("/tags");
  return response.data;
};

export const getTagById = async (id: number): Promise<TagResponse> => {
  const response = await axiosInstance.get(`/tags/${id}`);
  return response.data;
};

export const createTag = async (data: TagRequest): Promise<TagResponse> => {
  const response = await axiosInstance.post("/tags", data);
  return response.data;
};

export const updateTag = async (
  id: number,
  data: TagRequest
): Promise<TagResponse> => {
  const response = await axiosInstance.put(`/tags/${id}`, data);
  return response.data;
};

export const deleteTag = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/tags/${id}`);
};