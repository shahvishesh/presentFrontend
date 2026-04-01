import { useEffect, useState } from "react";
import { deletePost, getAllPost, toggleLike, type PostResponse } from "../../api/social.api";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  Avatar,
  IconButton,
  Button,
  CardActionArea,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import SystemGeneratedPostCard from "./SystemGeneratedPostCard";

export default function ViewAllPost() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const navigate = useNavigate();

useEffect(() => {
  getAllPost()
    .then((res) => {
      setPosts(res);
    })
    .catch(() => toast.error("Failed to load posts"));
}, []);

const handleLike = async (postId: number) => {
  try {
    const response = await toggleLike(postId);

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likeCount: response.likeCount,
              isLikedByCurrentUser: response.liked,
            }
          : post
      )
    );
  } catch {
    toast.error("Failed to toggle like");
  }
};
  
const handleDelete = async (postId: number) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  try {
    await deletePost(postId);

    setPosts((prev) => prev.filter((post) => post.id !== postId));

    toast.success("Post deleted");
  } catch {
    toast.error("Failed to delete post");
  }
};

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      {posts?.map((post) => 
       post.isSystemGenerated ? (
          <SystemGeneratedPostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onNavigate={(id) =>
              navigate(`/dashboard/social/post/${id}`)
            }
          />
        ) :(
        <Card key={post.id} sx={{ mb: 3 }}>
          <CardActionArea component="div" onClick={() => navigate(`/dashboard/social/post/${post.id}`)}>

            <CardContent>
              {/* Header */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>{post.authorName?.charAt(0)}</Avatar>
                  <Box>
                    <Typography fontWeight={600}>
                      {post.authorName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>

              <Stack direction="row" spacing={1}>
                {post.canEdit && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/social/edit/${post.id}`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                )}

                {post.canDelete && (
                  <IconButton
                    color="error"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Stack>

      
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Title */}
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 1 }}
              >
                {post.title}
              </Typography>

              {/* Description */}
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.description}
              </Typography>

              {/* Tags */}
              <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: "wrap" }}
                  mb={2}
                  >
                  {post.postTags?.map((tag) => (
                      <Chip
                      key={tag.id}
                      label={tag.tagName}
                      size="small"
                      color="primary"
                      variant="outlined"
                      />
                  ))}
              </Stack>

              <Divider sx={{ my: 1 }} />

              {/* Action Buttons */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post.id)}}
                    size="small"
                    
                  >
                    {post.isLikedByCurrentUser ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>

                  <Typography variant="body2">
                    {post.likeCount}
                  </Typography>
                </Stack>

                <Button
                  startIcon={<ChatBubbleOutlineIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/social/post/${post.id}`)}}
                  size="small"
                >
                  Comment ({post.commentCount})
                </Button>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}