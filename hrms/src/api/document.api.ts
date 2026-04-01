import axiosInstance from "./axiosInstance";

export type UploadTravelDocumentRequest = {
    documentTypeId: number | "";
    employeeId?: number | undefined | null;
}

export const uploadTravelDocument = async (
    travelPlanId: number,
    data: UploadTravelDocumentRequest,
    file: File
): Promise<number> => {
    const formData = new FormData();

    formData.append(
        "data",
        new Blob([JSON.stringify(data)],{
            type: "application/json",
        })
    );

    formData.append("file", file);

    const res = await axiosInstance.post(`/document/${travelPlanId}/upload`, formData);

    return res.data;
};

export type DocumentType = {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    allowedFormats: string;
}

export const getDocumentTypes = async (): Promise<DocumentType []> => {
    const res = await axiosInstance.get<DocumentType []>("/document-types");
    return res.data;
}

export type TravelDocumentResponse = {
    travelDocumentId: number;
    travelPlanId: number;
    employeeId: number;
    documentTypeName: string;
    fileName: string;
    uploadedByName: string;
    uploadedByRole: string;
}

export const getEmployeeDocuments = async (id: number): Promise<TravelDocumentResponse []> => {
    const res = await axiosInstance.get<TravelDocumentResponse []>(`/document/employee/${id}`);
    return res.data;
}

export const getEmployeeDocumentsByEmployeeId = async (employeeId: number, travelPlanId: number): Promise<TravelDocumentResponse []> => {
    const res = await axiosInstance.get<TravelDocumentResponse []>(`/document/employee/${employeeId}/${travelPlanId}`);
    return res.data;
}

export const getCommonTravelDocuments = async (id: number): Promise<TravelDocumentResponse[]> => {
    const res = await axiosInstance.get<TravelDocumentResponse []>(`/document/${id}`);
    return res.data;
}

export const deleteDocument = async (travelDocumentId: number) => {
    await axiosInstance.delete(`/document/${travelDocumentId}/delete`);
}


//  private Long travelDocumentId;
//     private Long travelPlanId;
//     private Long employeeId;
//     private String documentTypeName;
//     private String fileName;
//     private String uploadedByName;
//     private EOwnerType uploadedByRole;