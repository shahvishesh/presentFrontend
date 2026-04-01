import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  toggleLike,
  deletePost,
  type PostResponse,
  addComment,
  type CommentResponse,
  getAllCommentByPostId,
  deleteComment,
  editComment,
} from "../../api/social.api";
import { toast } from "react-toastify";
import {
  Box,
  Card,
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../context/useAuth";

export default function PostDetail() {
  const { postid } = useParams();
  const navigate = useNavigate();
  const postId = Number(postid);
  const { user } = useAuth();

  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(true);

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

const handleAddComment = async () => {
  if (!post || !commentText.trim()) return;

  try {
    setSubmitting(true);

    await addComment(post.id, { comment: commentText });

    const newComment: CommentResponse = {
      commentId: Date.now(), // temporary id
      commentText,
      employeeId: 0,
      employeeName: "You",
      createdAt: new Date().toISOString(),
      isEdited: false,
      canEdit: false,
      canDelete: false,
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
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Card>
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

            {post.canDelete && (
              <IconButton color="error" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            )}
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

          {/* Like Section */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={handleLike}>
              {post.isLikedByCurrentUser ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>

            <Typography>{post.likeCount} likes</Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

            {/* Add Comment */}
            <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 32, height: 32 }}>
                {user?.username.charAt(0)}
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
  <Card key={comment.commentId} sx={{ mb: 2 }}>
    <CardContent>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
          <Avatar>
            {comment.employeeName?.charAt(0)}
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
  </Card>
))
                )}
            </Box>
        </CardContent>
      </Card>
    </Box>
  );
}