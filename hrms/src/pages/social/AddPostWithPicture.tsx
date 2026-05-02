import { useEffect, useState, type ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { Box, Button, Chip, Divider, FormControl, FormHelperText, Grid, Modal, Paper, Stack, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createPost, getTagTypes, type CreatePost, type TagTypeResponse } from "../../api/social.api";
import {
    pageContentPaperSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

export default function AddPostWithPicture() {
    const [tagTypes, setTagTypes] = useState<TagTypeResponse[]>([]);
    const navigate = useNavigate();
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [openImage, setOpenImage] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreatePost>({
        defaultValues: {
            title: "",
            description: "",
            tags: [],
        },
    });

    const onSubmit = async (data: CreatePost) => {
        try {
            await createPost(data, files);
            setFiles([]);
            setPreviewUrls([]);
            toast.success("Post created successfully");
            navigate("/dashboard/social/all");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "API Error");
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);

        setFiles((prev) => [...prev, ...selectedFiles]);

        const previews = selectedFiles.map((file) => URL.createObjectURL(file));

        setPreviewUrls((prev) => [...prev, ...previews]);
    };

    const handleRemoveNew = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        getTagTypes()
            .then((data) => setTagTypes(data))
            .catch(() => toast.error("Failed to load tags"));
    }, []);

    return (
        <>
            <Box sx={pageRootSx}>
                <Paper variant="outlined" sx={pageHeaderPaperSx}>
                    <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                        <Stack spacing={0.25}>
                            <Typography variant="h5" sx={pageHeaderTitleSx}>
                                Create Post
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Share a new post with tags and images.
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
                                    name="tags"
                                    control={control}
                                    rules={{
                                        validate: (value) =>
                                            value.length > 0 || "At least one tag is required",
                                    }}
                                    render={({ field }) => (
                                        <FormControl error={!!errors.tags} component="fieldset" fullWidth>
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                Select tags
                                            </Typography>

                                            <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
                                                {tagTypes.map((tag) => {
                                                    const selected = field.value?.some((t) => t.tagId === tag.id);

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
                                                                        field.value.filter((t) => t.tagId !== tag.id)
                                                                    );
                                                                } else {
                                                                    field.onChange([
                                                                        ...field.value,
                                                                        { tagId: tag.id },
                                                                    ]);
                                                                }
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </Stack>

                                            <Divider sx={{ my: 3 }} />

                                            <Box>
                                                <Button component="label" variant="outlined">
                                                    {files.length === 0
                                                        ? "Upload Images"
                                                        : files.length === 1
                                                        ? "Add More Images (1 selected)"
                                                        : `Add More Images (${files.length} selected)`}
                                                    <input type="file" hidden multiple onChange={handleFileChange} />
                                                </Button>
                                            </Box>

                                            {previewUrls.length > 0 && (
                                                <Box mt={2}>
                                                    <Typography variant="subtitle2">Preview:</Typography>

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
                                                </Box>
                                            )}

                                            <FormHelperText>{errors.tags?.message}</FormHelperText>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Create Post
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