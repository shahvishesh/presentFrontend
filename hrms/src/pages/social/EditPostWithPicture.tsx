import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  editPost,
  type TagTypeResponse,
  getTagTypes,
  type PostMedia,
} from "../../api/social.api";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Chip,
  Modal,
  Paper,
  Grid,
  Divider,
  FormControl,
  FormHelperText,
} from "@mui/material";
import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
} from "../../components/page/pageStyles";

type EditFormValues = {
  title: string;
  description: string;
  tagIds: number[];
};

export default function EditPostWithPicture() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);
  const [allTags, setAllTags] = useState<TagTypeResponse[]>([]);
    const [existingImages, setExistingImages] = useState<PostMedia[]>([]);
  const [removedIds, setRemovedIds] = useState<number[]>([]);
const [files, setFiles] = useState<File[]>([]);
const [previewUrls, setPreviewUrls] = useState<string[]>([]);
const [openImage, setOpenImage] = useState<string | null>(null);


  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>({
  defaultValues: {
    title: "",
    description: "",
    tagIds: [],
  },
});

 useEffect(() => {
  if (!postId) return;

  const fetchData = async () => {
    try {
      const [postRes, tagsRes] = await Promise.all([
        getPostById(postId),
        getTagTypes(),
      ]);

      setAllTags(tagsRes);

      reset({
        title: postRes.title,
        description: postRes.description,
        tagIds: postRes.postTags.map((t) => t.id),
      });

      setExistingImages(postRes.media || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [postId, reset]);

const handleRemoveExisting = (id: number) => {
setRemovedIds((prev) =>
  prev.includes(id) ? prev : [...prev, id]
);  setExistingImages((prev) =>
    prev.filter((img) => img.id !== id)
  );
};

const handleRemoveNew = (index: number) => {
  setFiles(prev => prev.filter((_, i) => i !== index));
  setPreviewUrls(prev => prev.filter((_, i) => i !== index));
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const selected = Array.from(e.target.files);

  setFiles((prev) => [...prev, ...selected]);

  const previews = selected.map((f) =>
    URL.createObjectURL(f)
  );

  setPreviewUrls((prev) => [...prev, ...previews]);
};

  const onSubmit = async (data: EditFormValues) => {
    try {
      await editPost(
  postId,
  {
    ...data,
    removeMediaIds: removedIds,
  },
  files
);

      toast.success("Post updated");
      navigate(`/dashboard/social/post/${postId}`, { replace: true });
    } catch {
      toast.error("Failed to update post");
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={pageRootSx}>
        <Paper variant="outlined" sx={pageHeaderPaperSx}>
          <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
            <Stack spacing={0.25}>
              <Typography variant="h5" sx={pageHeaderTitleSx}>
                Edit Post
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update post details, tags, and images.
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={pageContentPaperSx}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ p: { xs: 2, sm: 2.5 } }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Title"
                      fullWidth
                      size="small"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      multiline
                      rows={4}
                      fullWidth
                      size="small"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="tagIds"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.length > 0 || "At least one tag is required",
                  }}
                  render={({ field }) => (
                    <FormControl
                      error={!!errors.tagIds}
                      component="fieldset"
                      fullWidth
                    >
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Select tags
                      </Typography>

                      <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
                        {allTags.map((tag) => {
                          const selected = field.value.includes(tag.id);

                          return (
                            <Chip
                              key={tag.id}
                              label={tag.tagName}
                              clickable
                              color={selected ? "primary" : "default"}
                              variant={selected ? "filled" : "outlined"}
                              onClick={() => {
                                if (selected) {
                                  field.onChange(
                                    field.value.filter((id) => id !== tag.id)
                                  );
                                } else {
                                  field.onChange([...field.value, tag.id]);
                                }
                              }}
                            />
                          );
                        })}
                      </Stack>

                      <FormHelperText>{errors.tagIds?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Existing Images
                </Typography>

                <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                  {existingImages.map((img) => (
                    <Box key={img.id} position="relative">
                      <Box
                        component="img"
                        src={`http://localhost:8080${img.url}`}
                        onClick={() =>
                          setOpenImage(`http://localhost:8080${img.url}`)
                        }
                        sx={{
                          width: 120,
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 2,
                          cursor: "pointer",
                        }}
                      />

                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveExisting(img.id)}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          minWidth: 0,
                        }}
                      >
                        ✕
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button component="label" variant="outlined">
                  {files.length === 0
                    ? "Add Images"
                    : files.length === 1
                    ? "Add More Images (1 selected)"
                    : `Add More Images (${files.length} selected)`}
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>

              {previewUrls.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    New Images
                  </Typography>

                  <Box display="flex" gap={2} flexWrap="wrap">
                    {previewUrls.map((url, index) => (
                      <Box key={index} position="relative">
                        <Box
                          component="img"
                          src={url}
                          onClick={() => setOpenImage(url)}
                          sx={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: 2,
                            cursor: "pointer",
                          }}
                        />

                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveNew(index)}
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            minWidth: 0,
                          }}
                        >
                          ✕
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button variant="contained" type="submit">
                Update Post
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Modal open={!!openImage} onClose={() => setOpenImage(null)}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{ pointerEvents: "none" }}
          >
            <Box
              position="relative"
              bgcolor="rgba(0,0,0,0.8)"
              p={2}
              borderRadius={2}
              sx={{ pointerEvents: "auto" }}
            >
              <Box
                position="absolute"
                top={10}
                right={10}
                onClick={() => setOpenImage(null)}
                sx={{
                  cursor: "pointer",
                  color: "white",
                }}
              >
                ✕
              </Box>

              {openImage && (
                <Box
                  component="img"
                  src={openImage}
                  sx={{
                    maxHeight: "80vh",
                    maxWidth: "80vw",
                    borderRadius: 2,
                  }}
                />
              )}
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
}