import { useEffect, useState } from "react"
import { createPost, getTagTypes, type CreatePost, type TagTypeResponse } from "../../api/social.api"
import { Controller, useForm } from "react-hook-form";
import { Box, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddPost(){
    const [tagTypes, setTagTypes] = useState<TagTypeResponse[]>([]);
  const navigate = useNavigate();

     const {
                reset,
                control,
                register,
                handleSubmit,
                formState: { errors },
            } = useForm<CreatePost>(
              {
  defaultValues: {
    title: "",
    description: "",
    tags: [],   // ⭐ VERY IMPORTANT
  },
}
            );

    const onSubmit = async (data: CreatePost) => {
        try {
            
            await createPost(data);
        
            toast.success("Travel plan created successfully");
            navigate("/dashboard/social/all"); 
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "API Error");
            } else {
            toast.error("Something went wrong");
            }
        }
    };

    useEffect(() => {
        getTagTypes()
        .then((data) => setTagTypes(data))
        .catch(() => toast.error("Failed to load tags"));
    
    }, []);

    return(
        <>
            <Box>
              <Typography variant="h5" mb={3}>
                Create Post 
            </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>

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
                                    rows={3}
                                    fullWidth
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                                )}
                            />
                    

                      
                                
                          <Controller
                            name="tags"
                            control={control}
                            rules={{
                              validate: (value) =>
                                value.length > 0 || "At least one tag is required",
                            }}
                            render={({ field }) => (
                              <FormControl error={!!errors.tags} component="fieldset">
                                <Typography variant="subtitle1" mb={1}>
                                  Select tags
                                </Typography>

                                <FormGroup>
                                  {tagTypes.map((tag) => {
                                    const checked = field.value?.some(
                                      (t) => t.tagId === tag.id
                                    );

                                    return (
                                      <FormControlLabel
                                        key={tag.id}
                                        control={
                                          <Checkbox
                                            checked={checked}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                field.onChange([
                                                  ...field.value,
                                                  { tagId: tag.id },
                                                ]);
                                              } else {
                                                field.onChange(
                                                  field.value.filter(
                                                    (t) => t.tagId !== tag.id
                                                  )
                                                );
                                              }
                                            }}
                                          />
                                        }
                                        label={tag.tagName}
                                      />
                                    );
                                  })}
                                </FormGroup>

                                <FormHelperText>
                                  {errors.tags?.message}
                                </FormHelperText>
                              </FormControl>
                            )}
                      />

                                
                        </CardContent>
                    </Card>
                    <Button variant="contained" type="submit">
                        Create Post
                    </Button>
                </form>
            </Box>
        </>
    )
}