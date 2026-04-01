
import axiosInstance from "./axiosInstance";


export type CreatePost = {
    title: string;
    description: string;
    tags: PostTags[];
}

type PostTags = {
    tagId: number;
}

export const createPost = async (data: CreatePost) => {
    axiosInstance.post("/post/create", data);
}

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
}


export const getAllPost = async (): Promise<PostResponse[]> => {
    const res = await axiosInstance.get<PostResponse[]>("/post");
    return res.data;
}

export const getPostById = async(postId: number): Promise<PostResponse> => {
    const res = await axiosInstance.get<PostResponse>(`/post/${postId}`);
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
}

export const editPost = async (postId: number, data: EditPostRequest): Promise<PostResponse> => {
  const res = await axiosInstance.put<PostResponse>(`/post/${postId}`, data);
  return res.data;
};

type EditCommentRequest = {
    commentText : string;
}

export const editComment = async (commentId: number, data: EditCommentRequest): Promise<CommentResponse> => {
  const res = await axiosInstance.put<CommentResponse>(`/comment/${commentId}`, data);
  return res.data;
};

export const getUserPost = async (): Promise<PostResponse[]> => {
    const res = await axiosInstance.get<PostResponse[]>("/post/me");
    return res.data;
}

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