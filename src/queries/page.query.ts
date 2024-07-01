import { TypedUser } from "./user.query";

export interface TypedPosts {
    post_id?: number;
    createdBy?: number;
    post_name?: string;
    post_status?: "publish" | "draft" | "deleted" | "lock" | "future" | any;
    comment_status?: string | number;
    post_type?: string;
    post_parent?: number;
    comment_count?: number;
    post_tag?: string;
    post_thumbnail?: string;
    author?: TypedUser | null,
    createdAt?: any;
    updatedAt?: any;
    post_to_content?: {
        post_title: string;
        post_excerpt?: string;
        post_content: string;
        lang: string;
    } | any
}


export interface TypedPostToContent {
    ID?: string | number;
    post_id?: string;
    post_title?: string;
    post_excerpt?: string;
    post_content?: string;
    lang?: string;
}