import axiosInstance from "./axiosInstance";

export interface DocumentTypeResponse {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  allowedFormats: string[];
}

export interface DocumentTypeCreate {
  code: string;
  name: string;
  allowedFormats: string[];
}

export interface DocumentTypeUpdateDto {
  name: string;
  allowedFormats: string[];
}

export const getTypesOfDocuments = async (): Promise<DocumentTypeResponse[]> => {
  const res = await axiosInstance.get("/document-types/types");
  return res.data;
};

export const getDocumentTypeById = async (id: number): Promise<DocumentTypeResponse> => {
  const res = await axiosInstance.get(`/document-types/${id}`);
  return res.data;
};

export const createDocumentType = async (
  data: DocumentTypeCreate
): Promise<DocumentTypeResponse> => {
  const res = await axiosInstance.post("/document-types", data);
  return res.data;
};

export const updateDocumentType = async (
  id: number,
  data: DocumentTypeUpdateDto
): Promise<DocumentTypeResponse> => {
  const res = await axiosInstance.put(`/document-types/${id}`, data);
  return res.data;
};

export const deleteDocumentType = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/document-types/${id}`);
};

export const getDocumentFormats = async (): Promise<string[]> => {
  const res = await axiosInstance.get("/document-types/formats");
  return res.data;
};