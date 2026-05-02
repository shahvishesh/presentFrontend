
import axiosInstance from "./axiosInstance";


export type CreatePost = {
    title: string;
    description: string;
    tags: PostTags[];
}

type PostTags = {
    tagId: number;
}

// export const createPost = async (data: CreatePost) => {
//     axiosInstance.post("/post/create", data);
// }

export const createPost = async (
  data: CreatePost,
  files?: File[]
) => {

  const formData = new FormData();

  // 🔹 Add JSON data
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  // 🔹 Add files (optional)
  if (files && files.length > 0) {
    files.forEach(file => {
      formData.append("files", file);
    });
  }

  return axiosInstance.post("/post/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export type PostResponse = {
    id: number;
    title: string;
    description: string;
    employeeId: number;
    authorName: string;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    isLikedByCurrentUser: boolean;
    canEdit: boolean;
    canDelete: boolean;
    isSystemGenerated: boolean;
    postTags: TagTypeResponse[]
    imageUrls: string[];
}


export const getAllPost = async (): Promise<EditPostResponse[]> => {
    const res = await axiosInstance.get<EditPostResponse[]>("/post");
    return res.data;
}

export const getPostById = async(postId: number): Promise<EditPostResponse> => {
    const res = await axiosInstance.get<EditPostResponse>(`/post/${postId}`);
    return res.data;
}

export type TagTypeResponse = {
    id: number;
    tagName: string;
}

export const getTagTypes = async ():Promise<TagTypeResponse[]> => {
    const res = await axiosInstance.get<TagTypeResponse[]>("/tags");
    return res.data;
}

export type LikeToggleResponse = {
    liked: true;
    likeCount: number;
}

export const toggleLike = async (id: number):Promise<LikeToggleResponse> => {
    const res = await axiosInstance.post<LikeToggleResponse>(`/like/${id}`);
    return res.data;
}

export const deletePost = async(postId: number) => {
   await axiosInstance.delete(`/post/delete/${postId}`);
}



export type AddComment = {
    comment: string;
}

export const addComment = async(postId: number, data: AddComment) => {
    await axiosInstance.post(`/comment/${postId}/add`, data);
}


export type CommentResponse = {
    commentId: number;
    commentText: string;
    employeeId: number;
    employeeName: string;
    createdAt: string;
    isEdited: boolean
    canEdit: boolean;
    canDelete: boolean;
    authorImageUrl?: string;
}

export const getAllCommentByPostId = async(postId: number): Promise<CommentResponse[]> => {
    const res = await axiosInstance.get<CommentResponse[]>(`/comment/${postId}`);
    return res.data;
}

export const deleteComment = async (commentId: number) => {
  await axiosInstance.delete(`/comment/${commentId}/delete`);
};


export type EditPostRequest = {
    title: string;
    description: string;
    tagIds: number[];
    removeMediaIds?: number[];
}

// export const editPost = async (postId: number, data: EditPostRequest): Promise<PostResponse> => {
//   const res = await axiosInstance.put<PostResponse>(`/post/${postId}`, data);
//   return res.data;
// };

export const editPost = async (
  postId: number,
  data: EditPostRequest,
  files?: File[]
): Promise<EditPostResponse> => {

  const formData = new FormData();

  // 🔹 JSON data
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  // 🔹 Files (optional)
  if (files && files.length > 0) {
    files.forEach(file => {
      formData.append("files", file);
    });
  }

  const res = await axiosInstance.put<EditPostResponse>(
    `/post/${postId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

type EditCommentRequest = {
    commentText : string;
}

export const editComment = async (commentId: number, data: EditCommentRequest): Promise<CommentResponse> => {
  const res = await axiosInstance.put<CommentResponse>(`/comment/${commentId}`, data);
  return res.data;
};

export const getMyPost = async (): Promise<EditPostResponse[]> => {
    const res = await axiosInstance.get<EditPostResponse[]>("/post/me");
    return res.data;
}

export const getUserPost = async (employeeId: number): Promise<EditPostResponse[]> => {
    const res = await axiosInstance.get<EditPostResponse[]>(`/post/user/${employeeId}`);
    return res.data;
}
export type PostMedia = {
  id: number;
  url: string;
};

export type PostMediaResponse = {
  id: number;
  url: string;
};

export type EditPostResponse = {
    id: number;
    title: string;
    description: string;
    employeeId: number;
    authorName: string;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    isLikedByCurrentUser: boolean;
    canEdit: boolean;
    canDelete: boolean;
    isSystemGenerated: boolean;
    postTags: TagTypeResponse[]
    media: PostMediaResponse[];
    authorImageUrl?: string;
}

export type PostLikeUser = {
  employeeId: number;
  name: string;
  authorImageUrl?: string;
};

export const getPostLikes = async (
  postId: number
): Promise<PostLikeUser[]> => {
  const res = await axiosInstance.get(
    `/post/${postId}/likes`
  );
  return res.data;
};

export const removeProfileImage = async (employeeId: number) => {
  await axiosInstance.delete(`/employee/${employeeId}/profile-image`);
};

// public class CommentResponseDto {
//     private Long commentId;
//     private String commentText;

//     private Long employeeId;
//     private String employeeName;

//     private Instant createdAt;
// }


// private Long id;
//     private String title;
//     private String description;
//     private Long employeeId;
//     private String authorName;
//     private Instant createdAt;

//     private Long likeCount;
//     private Long commentCount;

//     private Boolean isSystemGenerated;