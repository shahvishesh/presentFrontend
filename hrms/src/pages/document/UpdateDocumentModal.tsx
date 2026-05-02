import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import type {
  DocumentType,
  TravelDocumentResponse,
} from "../../api/document.api";

interface Props {
  open: boolean;
  onClose: () => void;
  documentTypes?: DocumentType[];
  selectedDoc: TravelDocumentResponse | null;
  updateFile: File | null;
  updateDocType: string;
  onDocTypeChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export default function UpdateDocumentModal({
  open,
  onClose,
  documentTypes,
  selectedDoc,
  updateFile,
  updateDocType,
  onDocTypeChange,
  onFileChange,
  onSubmit,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 0.5 }}>
        <Stack spacing={0.25}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Update Document
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Change document type or replace the uploaded file
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        <Stack gap={1.5} mt={0.5}>
          {/* Document Type */}
          <TextField
            select
            label="Document"
            value={updateDocType}
            onChange={(e) => onDocTypeChange(e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value="">Select document type</MenuItem>
            {documentTypes?.map((doc) => (
              <MenuItem key={doc.id} value={doc.id}>
                {doc.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Existing file */}
          {!updateFile && selectedDoc && (
            <Typography variant="body2">
              Current: <strong>{selectedDoc.fileName}</strong>
            </Typography>
          )}

          {/* Upload */}
          {!updateFile ? (
            <Button component="label" variant="outlined" sx={{ mt: 0.5 }}>
              Upload New File
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={onFileChange}
              />
            </Button>
          ) : (
            <Box mt={0.5}>
              <Typography variant="body2">
                Selected: <strong>{updateFile.name}</strong>
              </Typography>

              <Box mt={1} display="flex" gap={1}>
                <Button component="label" size="small" variant="outlined">
                  Change
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={onFileChange}
                  />
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary">
                This will replace the existing document
              </Typography>
            </Box>
          )}

        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}