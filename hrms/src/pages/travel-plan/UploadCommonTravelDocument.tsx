import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Divider, Grid, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { openDocumentFileE } from "../../api/file.api";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import type { ErrorResponse } from "../../utils/commonInterface";
import {
    getCommonTravelDocuments,
    getDocumentTypes,
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
import { getTravelPlanByid, type TravelPlanResponse } from "../../api/travel.api";

export default function UploadCommonTravelDocument(){

    const[documents, setDocuments] = useState<TravelDocumentResponse[]>([]);
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>();
    
    const { travelPlanId } = useParams();
        const [travelPlan, setTravelPlan] = useState<TravelPlanResponse | null>(null);
    

    //
        const [documentFile, setDocumentFile] = useState<File | null>(null);

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
            try {
                await uploadTravelDocument(Number(travelPlanId), data, documentFile)

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
         getCommonTravelDocuments(Number(travelPlanId))
            .then((data) => setDocuments(data))
            .catch(() => toast.error("Failed to load documents"))
    }, []);

    useEffect(() => {
                const travelIdNum = Number(travelPlanId);
                if (!Number.isFinite(travelIdNum)) return;
            
                Promise.all([getTravelPlanByid(travelIdNum)])
                  .then(([travelPlan]) => {
                    setTravelPlan(travelPlan);
                  })
                  .catch(() => toast.error("Failed to load travel plan"));
              }, [travelPlanId]);
    return(
        <Box sx={pageRootSx}>
                <Paper variant="outlined" sx={pageHeaderPaperSx}>
                    <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                        <Stack spacing={0.25}>
                            <Typography variant="h5" sx={pageHeaderTitleSx}>
                                Submit Document
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Upload a document for this travel plan.
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
                    {travelPlan && (
                    <Paper variant="outlined" sx={{
                        p: { xs: 2, sm: 2.5 },
                        overflow: "hidden",
                        borderTop:0,
                        borderRadius:0,
                    }}>
                      <Typography variant="h6">
                        {travelPlan.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {travelPlan.description}
                      </Typography>
                      <Divider sx={pageDividerSx} />
            
                      <Stack spacing={0.5}>
                        <Typography variant="body1">
                          Period: {travelPlan.startDate} to {travelPlan.endDate}
                        </Typography>
                        <Typography variant="body1">
                          From: {travelPlan.sourceLocation}
                        </Typography>
                        <Typography variant="body1">
                          To: {travelPlan.destinationLocation}
                        </Typography>
                      </Stack>
                    </Paper>
                  )}
                  
                <Paper variant="outlined" sx={pageContentPaperSx}>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 1 }}
                    >

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
                                                <Button
                                                    onClick={() => openDocumentFileE(doc.travelDocumentId)}
                                                    variant="contained"
                                                    size="small"
                                                >
                                                    View Document
                                                </Button>
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
            </Box>
    )
}