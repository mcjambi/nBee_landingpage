import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "helpers/index";
import queryClient, { IQueryParams } from 'queries';

/**
*   Interface/model file auto generate for Setting Group
*   Interface for back-end
*   Model for front-end.
*   They are the same!
*/
export interface TypedApp {
    ID?: bigint | string | number;
    app_thumbnail?: string;
    app_name?: string;
    app_description?: string;
    app_type?: string;
    app_slug?: string;
    app_homepage?: string;
    client_private_key?: string;
    client_public_key?: string;
    status?: number;
    createdAt?: any;
}


type IQuery = TypedApp & IQueryParams;


/*
* List of all app
*/
export function useGetApps(object: IQuery) {
    const EndURL = helpers.buildEndUrl(object);
    return useQuery({
        queryKey: ["app/fetch_entity_list"],
        queryFn: () => axios.get<TypedApp[]>(`/app${EndURL}`).then(response => {
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



export function useGetApp() {
    return useMutation({
        mutationKey: ['app/fetch_entity'],
        mutationFn: (app_id: string) => axios.get<TypedApp>(`/app/${app_id}`).then((res) => res.data)
    });
}


export function useUpdateApp() {
    return useMutation({
        mutationKey: ['app/update_entity'],
        mutationFn: ({ ID, ...rest }: TypedApp) => axios.patch<any>(`app/${ID}`, helpers.cleanEntity(rest)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['app'] });
        }
    });
}


export function useCreateApp() {
    return useMutation({
        mutationKey: ['app/create_entity'],
        mutationFn: (entity: TypedApp) => axios.post<any>(`app/`, helpers.cleanEntity(entity)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['app'] });
        }
    });
}


export function useDeleteApp() {
    return useMutation({
        mutationKey: ['app/delete_entity'],
        mutationFn: (app_id: string) => axios.delete<any>(`app/${app_id}`)
    });
}


export function useGenerateNewClientPublicKey() {
    return useMutation({
        mutationKey: ['app/create_new_client_public_key'],
        mutationFn: (app_id: string) => axios.patch<any>(`app/client_public_key/${app_id}`)
    });
}