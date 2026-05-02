import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  toggleLike,
  deletePost,
  addComment,
  type CommentResponse,
  getAllCommentByPostId,
  deleteComment,
  editComment,
  type EditPostResponse,
  type PostLikeUser,
  getPostLikes,
} from "../../api/social.api";
import { toast } from "react-toastify";
import {
  Box,
  Paper,
  CardContent,
  Typography,
  Stack,
  Divider,
  Avatar,
  IconButton,
  Button,
  Chip,
  CircularProgress,
  TextField,
  Modal,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useUser } from "../../context/useUser";

export default function PostDetail() {
  const { postid } = useParams();
  const navigate = useNavigate();
  const postId = Number(postid);
  const { user } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [post, setPost] = useState<EditPostResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(true);

    const [likesOpen, setLikesOpen] = useState(false);
const [likedUsers, setLikedUsers] = useState<PostLikeUser[]>([]);
const [likesLoading, setLikesLoading] = useState(false);
    //
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");
    const [updating, setUpdating] = useState(false);

    const handleStartEdit = (commentId: number, currentText: string) => {
        if (editingCommentId !== null) return;
        setEditingCommentId(commentId);
        setEditingText(currentText);
};

const handleCancelEdit = () => {
  setEditingCommentId(null);
  setEditingText("");
};

const handleSaveEdit = async (commentId: number) => {
  if (!editingText.trim()) return;

  try {
    setUpdating(true);

    const updated = await editComment(commentId, {
      commentText: editingText,
    });

    setComments((prev) =>
      prev.map((c) =>
        c.commentId === commentId ? updated : c
      )
    );

    setEditingCommentId(null);
    setEditingText("");
    toast.success("Comment updated");
  } catch {
    toast.error("Failed to update comment");
  } finally {
    setUpdating(false);
  }
};
    //

  useEffect(() => {
  if (!postId) return;

  const fetchData = async () => {
    try {
      const [postRes, commentRes] = await Promise.all([
        getPostById(postId),
        getAllCommentByPostId(postId),
      ]);

      setPost(postRes);
      setComments(commentRes);
    } catch {
      toast.error("Failed to load post details");
    } finally {
      setLoading(false);
      setCommentsLoading(false);
    }
  };

  fetchData();
}, [postId]);


  const handleLike = async () => {
    if (!post) return;

    try {
      const res = await toggleLike(post.id);

      setPost({
        ...post,
        likeCount: res.likeCount,
        isLikedByCurrentUser: res.liked,
      });
    } catch {
      toast.error("Failed to toggle like");
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await deletePost(post.id);
      toast.success("Post deleted");
      navigate("/dashboard/social/all");
    } catch {
      toast.error("Failed to delete post");
    }
  };

//   const handleAddComment = async () => {
//   if (!post || !commentText.trim()) return;

//   try {
//     setSubmitting(true);

//     await addComment(post.id, { comment: commentText });

//     // increase comment count locally
//     setPost({
//       ...post,
//       commentCount: post.commentCount + 1,
//     });

//     setCommentText("");
//     toast.success("Comment added");
//   } catch {
//     toast.error("Failed to add comment");
//   } finally {
//     setSubmitting(false);
//   }
// };

const handleOpenLikes = async () => {
  if (!post) return;

  try {
    setLikesLoading(true);
    setLikesOpen(true);

    const res = await getPostLikes(post.id);
    setLikedUsers(res);
  } catch {
    toast.error("Failed to load likes");
  } finally {
    setLikesLoading(false);
  }
};

const handleAddComment = async () => {
  if (!post || !commentText.trim()) return;

  try {
    setSubmitting(true);

    await addComment(post.id, { comment: commentText });

    const newComment: CommentResponse = {
      commentId: Date.now(), // temporary id
      commentText,
      employeeId: 0,
      employeeName: user?.firstName + " " + user?.lastName,
      createdAt: new Date().toISOString(),
      isEdited: false,
      canEdit: false,
      canDelete: false,
      authorImageUrl: user?.profileImageUrl || undefined,
    };

    setComments((prev) => [newComment, ...prev]);

    setPost({
      ...post,
      commentCount: post.commentCount + 1,
    });

    setCommentText("");
  } catch {
    toast.error("Failed to add comment");
  } finally {
    setSubmitting(false);
  }
};

const handleDeleteComment = async (commentId: number) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this comment?"
  );
  if (!confirmDelete) return;

  try {
    await deleteComment(commentId);

    setComments((prev) =>
      prev.filter((c) => c.commentId !== commentId)
    );

    if (post) {
      setPost({
        ...post,
        commentCount: post.commentCount - 1,
      });
    }

    toast.success("Comment deleted");
  } catch {
    toast.error("Failed to delete comment");
  }
};

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) return null;

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          overflow: "hidden",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <CardContent>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
  src={
    post.authorImageUrl
      ? `http://localhost:8080${post.authorImageUrl}`
      : undefined
  }
  sx={{
    width: 40,
    height: 40,
  }}
>
  {!post.authorImageUrl && post.authorName?.charAt(0)}
</Avatar>
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
                      onClick={() => {
                        navigate(`/dashboard/social/edit/${post.id}`);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}

              {post.canDelete && (
                <IconButton color="error" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Title */}
          <Typography variant="h5" fontWeight={600} mb={1}>
            {post.title}
          </Typography>

          {/* Description */}
          <Typography variant="body1" mb={2}>
            {post.description}
          </Typography>

          {/* Tags */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {post.postTags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.tagName}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Images */}
          {/* Images */}
{post.media && post.media.length > 0 && (
  <Box position="relative" sx={{ mb: 2 }}>

    {/* Current image */}
    <Box
      component="img"
      src={`http://localhost:8080${post.media[currentIndex].url}`}
      sx={{
        width: "100%",
        maxHeight: 400,
        objectFit: "contain",
        borderRadius: 2,
      }}
    />

    {/* LEFT ARROW */}
    {post.media.length > 1 && (
      <IconButton
        disabled={currentIndex === 0}
        onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0))}
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

    {/* RIGHT ARROW */}
    {post.media.length > 1 && (
      <IconButton
        disabled={currentIndex === post.media.length - 1}
        onClick={() =>
          setCurrentIndex((prev) =>
            prev < post.media.length - 1 ? prev + 1 : prev
          )
        }
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

          {/* Like Section */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={handleLike}>
              {post.isLikedByCurrentUser ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>

            <Typography
            sx={{ cursor: "pointer" }}
            onClick={handleOpenLikes}
          >
            {post.likeCount} likes
          </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

            {/* Add Comment */}
            <Stack direction="row" spacing={2} alignItems="center">
 <Avatar
  src={
    user?.profileImageUrl
      ? `http://localhost:8080${user.profileImageUrl}`
      : undefined
  }
  onClick={() => navigate("/dashboard/profile")}
  sx={{
    cursor: "pointer",
    ml: 2,
    "&:hover": { opacity: 0.8 },
  }}
>
  {!user?.profileImageUrl && user?.firstName?.charAt(0)}
</Avatar>

            <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
            />

            <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={submitting || !commentText.trim()}
            >
                Post
            </Button>
            </Stack>

            <Typography variant="body2" sx={{ mt: 1 }}>
            {post.commentCount} comments
            </Typography>

            <Box sx={{ mt: 3 }}>
                {commentsLoading ? (
                    <Typography>Loading comments...</Typography>
                ) : comments.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                    No comments yet.
                    </Typography>
                ) : (
                    comments.map((comment) => (
  <Paper
    key={comment.commentId}
    elevation={0}
    variant="outlined"
    sx={{
      mb: 2,
      borderColor: "divider",
      backgroundColor: "background.paper",
    }}
  >
    <CardContent>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
        <Avatar
  src={
    comment?.authorImageUrl
      ? `http://localhost:8080${comment.authorImageUrl}`
      : undefined
  }
  onClick={() => navigate("/dashboard/profile")}
  sx={{
    cursor: "pointer",
    ml: 2,
    "&:hover": { opacity: 0.8 },
  }}
>
  {!comment?.authorImageUrl && comment?.employeeName?.charAt(0)}
</Avatar>

          <Box sx={{ width: "100%" }}>
            <Typography fontWeight={600}>
              {comment.employeeName}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {new Date(comment.createdAt).toLocaleString()}
              {comment.isEdited && " • edited"}
            </Typography>

            {/* EDIT MODE */}
            {editingCommentId === comment.commentId ? (
              <Box sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={editingText}
                  onChange={(e) =>
                    setEditingText(e.target.value)
                  }
                />

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 1 }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() =>
                      handleSaveEdit(comment.commentId)
                    }
                    disabled={updating}
                  >
                    Save
                  </Button>

                  <Button
                    size="small"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Typography sx={{ mt: 1 }}>
                {comment.commentText}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* ACTION ICONS */}
        <Stack direction="row">
          {comment.canEdit && (
            <IconButton
              size="small"
              onClick={() =>
                handleStartEdit(
                  comment.commentId,
                  comment.commentText
                )
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}

          {comment.canDelete && (
            <IconButton
              size="small"
              color="error"
              onClick={() =>
                handleDeleteComment(comment.commentId)
              }
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Stack>
    </CardContent>
  </Paper>
))
                )}
            </Box>
        </CardContent>
      </Paper>

      <Modal open={likesOpen} onClose={() => setLikesOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      bgcolor: "background.paper",
      p: 3,
      borderRadius: 2,
      width: 300,
      maxHeight: 400,
      overflow: "auto",
    }}
  >
    <Typography variant="h6" mb={2}>
      Liked by
    </Typography>

    {likesLoading ? (
      <Typography>Loading...</Typography>
    ) : likedUsers.length === 0 ? (
      <Typography>No likes yet</Typography>
    ) : (
      likedUsers.map((user) => (
        <Stack
          key={user.employeeId}
          direction="row"
          spacing={2}
          alignItems="center"
          mb={1}
        >
           <Avatar
  src={
    user?.authorImageUrl
      ? `http://localhost:8080${user.authorImageUrl}`
      : undefined
  }
  onClick={() => navigate("/dashboard/profile")}
  sx={{
    cursor: "pointer",
    ml: 2,
    "&:hover": { opacity: 0.8 },
  }}
>
  {!user?.authorImageUrl && user?.name?.charAt(0)}
</Avatar>
          <Typography>{user.name}</Typography>
        </Stack>
      ))
    )}
  </Box>
</Modal>
    </Box>
  );
}