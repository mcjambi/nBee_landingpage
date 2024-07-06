import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "helpers/index";
import queryClient, { IQueryParams } from 'queries';
import { TypedUser } from "./user.query";


export interface TypedUser_referrer {
    ID?: string
    user_id?: string
    user_referrer_id?: string
    createdAt?: string
    customer_data?: TypedUser
    referrer_data?: TypedUser
}

type IQuery = TypedUser_referrer & IQueryParams;




/*
* List of all referrer
*/
export function useGetReferrers(object: IQuery) {
    const EndURL = helpers.buildEndUrl(object);
    return useQuery({
        queryKey: ["user_referrer/fetch_entities_list"],
        queryFn: () => axios.get<TypedUser_referrer[]>(`/user_referrer${EndURL}`).then(response => {
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

export function useGetReferrer(object: IQuery) {
    let { user_id, ...rest } = object;
    let _rest = helpers.buildEndUrl(rest);
    return useQuery({
        queryKey: ["user_referrer/fetch_entity_list"],
        queryFn: () => axios.get<TypedUser_referrer[]>(`/user_referrer/${user_id}${_rest}`).then(response => {
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



export function useSetMyReferrer() {
    return useMutation({
        mutationKey: ['user_referrer/set_my_referrer'],
        mutationFn: (referrer: string) => axios.post<any>(`user_referrer/set_my_referrer`, { referrer }),
    });
}


/**
 * JamDev: updateReferrer
 */

export function useUpdateReferrer() {
    return useMutation({
        mutationKey: ['user_referrer/update_referrer'],
        mutationFn: (entity: { customer_id: any, referrer_id: any }) => axios.post<any>(`user_referrer/`, helpers.cleanEntity(entity))
    });
}