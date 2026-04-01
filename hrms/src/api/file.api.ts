import axiosInstance from "./axiosInstance";

export const openFile = async (fileId: number) => {
    try{
        const res = await axiosInstance.get(`expense/expense-proofs/${fileId}/view`, {
            responseType: "blob"
        });

        const fileBlob = new Blob([res.data], {
            type: res.headers["content-type"],
        });

        const fileURL = window.URL.createObjectURL(fileBlob);

        window.open(fileURL, "_blank");
    }catch(error){
        console.error("Error opening file:", error);
    }
}

export const openDocumentFileE = async (fileId: number) => {
    try{
        const res = await axiosInstance.get(`document/employee/document-files/${fileId}/view`, {
            responseType: "blob"
        });

        const fileBlob = new Blob([res.data], {
            type: res.headers["content-type"],
        });

        const fileURL = window.URL.createObjectURL(fileBlob);

        window.open(fileURL, "_blank");
    }catch(error){
        console.error("Error opening file:", error);
    }
}

export const openCVFile = async (fileId: number) => {
    try{
        const res = await axiosInstance.get(`job/cv/${fileId}/view`, {
            responseType: "blob"
        });

        const fileBlob = new Blob([res.data], {
            type: res.headers["content-type"],
        });

        const fileURL = window.URL.createObjectURL(fileBlob);

        window.open(fileURL, "_blank");
    }catch(error){
        console.error("Error opening file:", error);
    }
}