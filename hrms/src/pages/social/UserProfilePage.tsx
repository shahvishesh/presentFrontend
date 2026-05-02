import { useEffect, useState } from "react";
import { deletePost, getUserPost, toggleLike, type EditPostResponse } from "../../api/social.api";
import { toast } from "react-toastify";
import {
  Box,
  Paper,
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
import {
  pageRootSx,
  pageHeaderPaperSx,
  pageScrollableContentPaperSx,
  pageScrollableAreaSx,
  pageCenteredStateSx,
  pageEmptyStateTitleSx,
  pageEmptyStateSubtitleSx,
} from "../../components/page/pageStyles";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import SystemGeneratedPostCard from "./SystemGeneratedPostCard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getEmployeeById, type EmployeeResponse } from "../../api/employee.api";

export default function UserProfilePage() {
  const [posts, setPosts] = useState<EditPostResponse[]>([]);
  const navigate = useNavigate();
  const [currentIndexMap, setCurrentIndexMap] = useState<Record<number, number>>({});
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState<EmployeeResponse | null>(null);
  
  
useEffect(() => {
  if (!employeeId) return;

  const id = Number(employeeId);

  const fetchData = async () => {
    try {
      const [postsRes, employeeRes] = await Promise.all([
        getUserPost(id),
        getEmployeeById(id),
      ]);

      setPosts(postsRes);
      setEmployee(employeeRes);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile data");
    }
  };

  fetchData();
}, [employeeId]);

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
    <Box sx={pageRootSx}>
      <Paper variant="outlined" sx={pageHeaderPaperSx}>
        {/* <Stack spacing={0.25} sx={pageHeaderStackSx}>
          <Typography variant="h5" sx={pageHeaderTitleSx}>
            Profile Posts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Posts shared by this employee.
          </Typography>
        </Stack> */}

        {employee && (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 2 }}>
            <Avatar sx={{ width: 64, height: 64 }}>
              {employee.firstName.charAt(0)}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight={600}>
                {employee.firstName} {employee.lastName}
              </Typography>

              {employee.designation && (
                <Typography variant="body2" color="text.secondary">
                  {employee.designation}
                </Typography>
              )}

              <Typography variant="caption" color="text.secondary">
                {posts.length} posts
              </Typography>
            </Box>
          </Stack>
        )}
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          ...pageScrollableContentPaperSx,
          backgroundColor: "grey.100",
        }}
      >
        {posts && posts.length > 0 ? (
          <Box sx={pageScrollableAreaSx}>
            <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 2.5 } }}>
              {posts?.map((post) =>
                post.isSystemGenerated ? (
                  <SystemGeneratedPostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onNavigate={(id) => navigate(`/dashboard/social/post/${id}`)}
                  />
                ) : (
                  <Paper
                    key={post.id}
                    elevation={0}
                    variant="outlined"
                    sx={{
                      mb: 3,
                      overflow: "hidden",
                      borderColor: "divider",
                      backgroundColor: "background.paper",
                      transition: "border-color 0.2s ease, background-color 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <CardActionArea
                      component="div"
                      onClick={() => navigate(`/dashboard/social/post/${post.id}`)}
                    >
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              src={
                                post.authorImageUrl
                                  ? `http://localhost:8080${post.authorImageUrl}`
                                  : undefined
                              }
                              sx={{ width: 40, height: 40 }}
                            >
                              {!post.authorImageUrl && post.authorName?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography fontWeight={600}>{post.authorName}</Typography>
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

                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                          {post.title}
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {post.description}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} mb={2}>
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

                        {post.media && post.media.length > 0 && (
                          <Box position="relative" sx={{ mb: 2 }}>
                            <Box
                              component="img"
                              src={`http://localhost:8080${post.media[currentIndexMap[post.id] || 0].url}`}
                              sx={{
                                width: "100%",
                                maxHeight: 350,
                                objectFit: "cover",
                                borderRadius: 2,
                              }}
                            />

                            {post.media.length > 1 && (
                              <IconButton
                                disabled={(currentIndexMap[post.id] || 0) === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentIndexMap((prev) => {
                                    const current = prev[post.id] || 0;
                                    return {
                                      ...prev,
                                      [post.id]: current > 0 ? current - 1 : 0,
                                    };
                                  });
                                }}
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  left: 10,
                                  transform: "translateY(-50%)",
                                  backgroundColor: "rgba(0,0,0,0.5)",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                  },
                                }}
                              >
                                <ChevronLeftIcon />
                              </IconButton>
                            )}

                            {post.media.length > 1 && (
                              <IconButton
                                disabled={(currentIndexMap[post.id] || 0) === post.media.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentIndexMap((prev) => {
                                    const current = prev[post.id] || 0;
                                    return {
                                      ...prev,
                                      [post.id]:
                                        current < post.media.length - 1
                                          ? current + 1
                                          : current,
                                    };
                                  });
                                }}
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  right: 10,
                                  transform: "translateY(-50%)",
                                  backgroundColor: "rgba(0,0,0,0.5)",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                  },
                                }}
                              >
                                <ChevronRightIcon />
                              </IconButton>
                            )}
                          </Box>
                        )}

                        <Divider sx={{ my: 1 }} />

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(post.id);
                              }}
                              size="small"
                            >
                              {post.isLikedByCurrentUser ? (
                                <FavoriteIcon color="error" />
                              ) : (
                                <FavoriteBorderIcon />
                              )}
                            </IconButton>

                            <Typography variant="body2">{post.likeCount}</Typography>
                          </Stack>

                          <Button
                            startIcon={<ChatBubbleOutlineIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/social/post/${post.id}`);
                            }}
                            size="small"
                          >
                            Comment ({post.commentCount})
                          </Button>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Paper>
                )
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={pageCenteredStateSx}>
            <Typography sx={pageEmptyStateTitleSx}>No posts yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={pageEmptyStateSubtitleSx}>
              This employee has not shared anything yet.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}