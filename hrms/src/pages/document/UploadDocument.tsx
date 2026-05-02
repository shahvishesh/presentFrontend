import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Divider, Grid, IconButton, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { openDocumentFileE } from "../../api/file.api";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { ErrorResponse } from "../../utils/commonInterface";
import {
    deleteDocument,
    getDocumentTypes,
    getEmployeeDocumentsByEmployeeId,
    updateTravelDocument,
    uploadTravelDocument,
    type DocumentType,
    type TravelDocumentResponse,
    type UploadTravelDocumentRequest,
} from "../../api/document.api";
import {
    dataTableActionsStackSx,
    dataTableContainerSx,
    dataTableEmptyStateCellSx,
    dataTableHeadRowSx,
    dataTablePrimaryCellSx,
} from "../../components/table/tableStyles";
import {
    pageContentPaperSx,
    pageDividerSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";
import { getEmployeeProfileById, type EmployeeProfileDetail } from "../../api/employee.api";
import { getDepartments } from "../../api/department.api";
import UpdateDocumentModal from "./UpdateDocumentModal";

export default function UploadDocument(){

    const[documents, setDocuments] = useState<TravelDocumentResponse[]>([]);
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>();
    
    const { travelPlanId, employeeId } = useParams();
    const travelPlanIdNum = Number(travelPlanId);
    const employeeIdNum = Number(employeeId);

     //
    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<TravelDocumentResponse | null>(null);
    const [updateFile, setUpdateFile] = useState<File | null>(null);
    const [updateDocType, setUpdateDocType] = useState("");

    //

    //
        const [documentFile, setDocumentFile] = useState<File | null>(null);
 const [employee, setEmployee] = useState<EmployeeProfileDetail | null>(null);
  const [departmentName, setDepartmentName] = useState<string>("");

        const handleDocumentChange = (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            if (e.target.files && e.target.files[0]) {
            setDocumentFile(e.target.files[0]);
            }
        };

        const {
            reset,
            control,
            handleSubmit,
            formState: { errors },
        } = useForm<UploadTravelDocumentRequest>(
            { defaultValues: { documentTypeId: "" } }
        );

        const onSubmit = async (data: UploadTravelDocumentRequest) => {
            if (!documentFile) {
                toast.error("Please upload document");
                return;
            }
            if (!Number.isFinite(employeeIdNum) || !Number.isFinite(travelPlanIdNum)) {
                toast.error("Invalid route details");
                return;
            }
            try {
                data.employeeId = employeeIdNum;
                await uploadTravelDocument(travelPlanIdNum, data, documentFile)

                const refreshed = await getEmployeeDocumentsByEmployeeId(employeeIdNum, travelPlanIdNum);
                setDocuments(refreshed);

                toast.success("Document uploaded successfully");
                reset();
                setDocumentFile(null);
                //navigate("/dashboard/job");
            } catch (error: unknown) {
                    if(axios.isAxiosError<ErrorResponse>(error)){
                            const message = error.response?.data.message || "Failed to upload document";
                            toast.error(message);
                    }else{
                        toast.error("Something went wrong");
                    }
            }finally{
                // no-op
            }
        };


        useEffect(() => {
            getDocumentTypes()
            .then((data) => setDocumentTypes(data))
        },[]);


    //
        useEffect(() => {
         if (!Number.isFinite(employeeIdNum) || !Number.isFinite(travelPlanIdNum)) return;

         getEmployeeDocumentsByEmployeeId(employeeIdNum, travelPlanIdNum)
            .then((data) => setDocuments(data))
            .catch(() => toast.error("Failed to load documents"))
        }, [employeeIdNum, travelPlanIdNum]);

    useEffect(() => {
        if (!Number.isFinite(employeeIdNum)) return;
    
        Promise.all([getEmployeeProfileById(employeeIdNum), getDepartments()])
          .then(([profile, departments]) => {
            setEmployee(profile);
            const department = departments.find((d) => d.id === profile.departmentId);
            setDepartmentName(
              department?.departmentName ?? (profile.departmentId ? `Department #${profile.departmentId}` : "")
            );
          })
          .catch(() => toast.error("Failed to load employee"));
      }, [employeeId]);

       const handleDelete = async (travelDocumentId: number) => {
                  const confirmDelete = window.confirm("Are you sure you want to delete this document?");
                  if (!confirmDelete) return;
                
                  try {
                    await deleteDocument(travelDocumentId);
                
                    setDocuments((prev) => prev.filter((doc) => doc.travelDocumentId !== travelDocumentId));
                
                    toast.success("Travel document deleted");
                  } catch {
                    toast.error("Failed to delete document");
                  }
        };

         //
        const handleOpenUpdate = (doc: TravelDocumentResponse) => {
        setSelectedDoc(doc);
        setUpdateFile(null);
        setUpdateDocType(String(doc.documentTypeId)); // 👈 important
        setOpenUpdate(true);
        };

        const handleUpdateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUpdateFile(e.target.files[0]);
        }
        };

        const handleUpdateSubmit = async () => {
  if (!selectedDoc) return;
    if (!updateDocType) {
        toast.error("Document type is required");
        return;
    }
    if (!Number.isFinite(employeeIdNum) || !Number.isFinite(travelPlanIdNum)) {
        toast.error("Invalid route details");
        return;
    }

  try {
    await updateTravelDocument(
      selectedDoc.travelDocumentId,
      {
        documentTypeId: Number(updateDocType)
      },
      updateFile || undefined
    );

    toast.success("Document updated");

    setOpenUpdate(false);
    setUpdateFile(null);
setSelectedDoc(null);

    // 🔁 refresh list
    const refreshed = await getEmployeeDocumentsByEmployeeId(
            employeeIdNum,
            travelPlanIdNum
    );
    setDocuments(refreshed);

  } catch (error: unknown) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      const message =
        error.response?.data.message || "Failed to update document";
      toast.error(message);
    } else {
      toast.error("Something went wrong");
    }
  } finally {
        // no-op
  }
};

    return(
        <Box sx={pageRootSx}>


                <Paper variant="outlined" sx={pageHeaderPaperSx}>
                    <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                        <Stack spacing={0.25}>
                            <Typography variant="h6" sx={pageHeaderTitleSx}>
                                Assign Document
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Assign documents to the employee.
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
                    {employee && (
                    <Paper variant="outlined" sx={{
                        p: { xs: 2, sm: 2.5 },
                        overflow: "hidden",
                        borderTop:0,
                        borderRadius:0,
                    }}>
                      <Typography variant="h5">
                        {employee.firstName} {employee.lastName}
                      </Typography>
                      <Divider sx={pageDividerSx} />
            
                      <Stack spacing={0.5}>
                        <Typography variant="body1">
                          Email: {employee.email}
                        </Typography>
                        <Typography variant="body1">
                          Designation: {employee.designation}
                        </Typography>
                        <Typography variant="body1">
                          Department: {departmentName}
                        </Typography>
                      </Stack>
                    </Paper>
                  )}

                <Paper variant="outlined" sx={pageContentPaperSx}>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>

                        <Grid size={{ xs: 6 }}>
                            <Controller
                                name="documentTypeId"
                                control={control}
                                rules={{ required: "Document type is required" }}
                                render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Document"
                                    fullWidth
                                    error={!!errors.documentTypeId}
                                    helperText={errors.documentTypeId?.message}

                                >
                                    <MenuItem value="">Select document type</MenuItem>
                                    {documentTypes?.map((document) => (
                                    <MenuItem key={document.id} value={document.id}>
                                        {document.name}
                                    </MenuItem>
                                    ))}
                                </TextField>
                                )}
                            />
                            </Grid>

    
                    </Grid>

                    <Divider sx={pageDividerSx} />

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        gap={2}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", sm: "center" }}
                    >
                        {/* Upload Document */}
                        <Box>
                            {!documentFile ? (
                                <Button component="label" variant="outlined">
                                    Upload Document
                                    <input type="file" hidden onChange={handleDocumentChange} />
                                </Button>
                            ) : (
                                <Box>
                                    <Typography variant="body2">
                                        Selected: <strong>{documentFile.name}</strong>
                                    </Typography>

                                    <Box mt={1} display="flex" gap={1}>
                                        <Button component="label" size="small" variant="outlined">
                                            Change
                                            <input type="file" hidden onChange={handleDocumentChange} />
                                        </Button>

                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => setDocumentFile(null)}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ alignSelf: { xs: "flex-end", sm: "auto" } }}
                        >
                            Submit
                        </Button>
                    </Stack>
        
                    </Box>
                </Paper>

                <Paper variant="outlined" sx={{ ...pageHeaderPaperSx, pb: { xs: 2, sm: 2.5 } }}>
                    <Stack spacing={0.25}>
                        <Typography variant="h5" sx={pageHeaderTitleSx}>
                            Documents
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            View uploaded documents.
                        </Typography>
                    </Stack>
                </Paper>

                <Paper variant="outlined" sx={pageContentPaperSx}>
                    <TableContainer component={Box} sx={dataTableContainerSx}>
                        <Table aria-label="documents table">
                            <TableHead>
                                <TableRow sx={dataTableHeadRowSx}>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Uploaded by</TableCell>
                                    <TableCell>Owner type</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {documents?.map((doc) => (
                                    <TableRow key={doc.travelDocumentId} hover>
                                        <TableCell sx={dataTablePrimaryCellSx}>
                                            {doc.documentTypeName}
                                        </TableCell>
                                        <TableCell>{doc.uploadedByName}</TableCell>
                                        <TableCell>{doc.uploadedByRole}</TableCell>

                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} sx={dataTableActionsStackSx}>
                                                <Tooltip title="View Document">
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => openDocumentFileE(doc.travelDocumentId)}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {doc.uploadedByRole === "HR" && (
                                                    <>
                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                color="error"
                                                                size="small"
                                                                onClick={() => handleDelete(doc.travelDocumentId)}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Update">
                                                            <IconButton
                                                                color="secondary"
                                                                size="small"
                                                                onClick={() => handleOpenUpdate(doc)}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {documents?.length === 0 && (
                                    <TableRow key="no-documents">
                                        <TableCell colSpan={4} align="center" sx={dataTableEmptyStateCellSx}>
                                            No Documents found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <UpdateDocumentModal
  open={openUpdate}
  onClose={() => setOpenUpdate(false)}
  documentTypes={documentTypes}
  selectedDoc={selectedDoc}
  updateFile={updateFile}
  updateDocType={updateDocType}
  onDocTypeChange={setUpdateDocType}
  onFileChange={handleUpdateFileChange}
  onSubmit={handleUpdateSubmit}
/>
            </Box>
    )
}