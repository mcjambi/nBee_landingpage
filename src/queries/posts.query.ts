import helpers from "helpers/index";
import { IQueryParams } from ".";
import { TypedUser } from "./user.query";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";



export interface TypedPosts {
    post_id?: number;
    createdBy?: number;
    post_name?: string;
    post_title?: string;
    post_excerpt?: string;
    post_content?: string;

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
}

export interface TypedPost {
    post_id?: number;
    createdBy?: number;
    post_name?: string;
    post_title?: string;
    post_excerpt?: string;
    post_content?: string;

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
}

type IQuery = TypedPosts & IQueryParams;


/*
* List of all app
*/
export function useGetPosts(object: IQuery) {
    const EndURL = helpers.buildEndUrl(object);
    return useQuery({
        queryKey: ["posts/fetch_entity_list"],
        queryFn: () => axios.get<TypedPosts[]>(`/posts${EndURL}`).then(response => {
            let { data, headers } = response;
            return {
                body: data,
                totalItems: Number(headers['x-total-count'] || 0)
            }
        }),
        retry: 1,
        refetchOnWindowFocus: true,
        enabled: false,
    });
}


export function useGetPost(post_slug: string) {
    return useQuery({
        queryKey: ['posts/fetch_entity'],
        queryFn: () => axios.get<TypedPost>(`posts/${post_slug}?lang=vi`).then(res => res.data)
    })
}
