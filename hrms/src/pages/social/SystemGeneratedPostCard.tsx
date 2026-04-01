import { Avatar, Box, Button, Card, CardContent, Chip, Divider, IconButton, Stack, Typography } from "@mui/material";
import type { PostResponse } from "../../api/social.api";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";


export default function SystemGeneratedPostCard({
  post,
  onLike,
  onNavigate,
}: {
  post: PostResponse;
  onLike: (postId: number) => void;
  onNavigate: (postId: number) => void;
}) {
  return (
    <Card
      sx={{
        mb: 3,
        border: "1px solid",
        borderColor: "info.main",
        backgroundColor: "rgba(2,136,209,0.05)",
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
            <Avatar sx={{ bgcolor: "info.main" }}>
              ⚙
            </Avatar>

            <Box>
              <Typography fontWeight={600}>
                System
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {new Date(post.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Stack>

          {/* SYSTEM BADGE */}
          <Chip
            label="System Generated"
            size="small"
            color="info"
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Title */}
        <Typography variant="h6" fontWeight={600} mb={1}>
          {post.title}
        </Typography>

        {/* Description */}
        <Typography variant="body1" mb={2}>
          {post.description}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* Actions */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onLike(post.id);
              }}
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
              onNavigate(post.id);
            }}
            size="small"
          >
            Comment ({post.commentCount})
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}