import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  editPost,
  type PostResponse,
  type TagTypeResponse,
  getTagTypes,
} from "../../api/social.api";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";

type EditFormValues = {
  title: string;
  description: string;
  tagIds: number[];
};

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);
  const [allTags, setAllTags] = useState<TagTypeResponse[]>([]);

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
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [postId, reset]);

  const onSubmit = async (data: EditFormValues) => {
    try {
      await editPost(postId, data);

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
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Edit Post
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />

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
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />

              <Controller
  name="tagIds"
  control={control}
  rules={{
    validate: (value) =>
      value.length > 0 || "At least one tag is required",
  }}
  render={({ field }) => (
    <>
      <Typography variant="subtitle1" mb={1}>
        Select Tags
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
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
                    field.value.filter(
                      (id) => id !== tag.id
                    )
                  );
                } else {
                  field.onChange([
                    ...field.value,
                    tag.id,
                  ]);
                }
              }}
            />
          );
        })}
      </Box>

      {errors.tagIds && (
        <Typography
          color="error"
          variant="caption"
          sx={{ mt: 1, display: "block" }}
        >
          {errors.tagIds.message}
        </Typography>
      )}
    </>
  )}
/>

              <Button variant="contained" type="submit">
                Update Post
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}