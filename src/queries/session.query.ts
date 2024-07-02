import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "helpers/index";
import queryClient, { IQueryParams } from "queries";

/**
*   Interface/model file auto generate for Session
*   Interface for back-end
*   Model for front-end.
*   They are the same!
*/
export interface TypedSession {
    ID?: any;
    session_id?: string | bigint | number;
    device_id?: string;
    session_active?: number;
    session_ip?: string;
    user_id?: number;
    createdAt?: any;
    updatedAt?: any;
    device?: {
        device_uuid: string,
        user_agent: string,
        system_type: string,
        status: number,
    };
}

export interface ILoginResponse {
    access_token?: string;
    refresh_token?: string;
    expires_at?: string;
}

export interface IRefreshToken extends ILoginResponse { }

type IQuery = TypedSession & IQueryParams;


/*
* List of all session
*/
export function useGetSessions(object: IQuery) {
    const EndURL = helpers.buildEndUrl(object);
    return useQuery({
        queryKey: ["session"],
        queryFn: () => axios.get<TypedSession[]>(`/session${EndURL}`).then(response => {
            let { data, headers } = response;
            return {
                body: data,
                totalItems: headers['x-total-count'] || 0
            }
        }),
        retry: 1,
        refetchOnWindowFocus: true,
        enabled: false,
    });
}


export function useDeleteSession() {
    return useMutation({
        mutationKey: ['session/delete_entity'],
        mutationFn: (session_id: string | number | bigint) => axios.delete<any>(`/session/${session_id}`).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session'] });
        }
    });
}


export function useRefreshMyToken() {
    return useMutation({
        mutationKey: ['session/refresh_token'],
        mutationFn: (refresh_token: string) => axios.post<any>(`/session/refresh_token`, {
            refresh_token: String(refresh_token || ' ').trim()
        }).then((res) => res.data)
    });
}