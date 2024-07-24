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

/** Admin only */
export type TypedMyReferrer = {
    "user": TypedUser,
    "referrers": {
        "user_id": string,
        "display_name": string,
        "user_email": string,
        "user_avatar": string,
        "user_status": number,
        "user_rate": number,
        "user_rate_count": number,
        "createdAt": string,
        "customer_to_user": {
            "customer_order_count": number,
            "customer_moneyspent_count": number
        }
    }[]
}


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
                totalItems: Number(headers['x-total-count'] || 0)
            }
        }),
        retry: 1,
        refetchOnWindowFocus: true,
        enabled: false,
    });
}

/** Admin only ...  */
export function useGetReferrer(object: IQuery) {
    let { user_id, ...rest } = object;
    let _rest = helpers.buildEndUrl(rest);
    return useQuery({
        queryKey: ["user_referrer/fetch_entity_list"],
        queryFn: () => axios.get<TypedMyReferrer>(`/user_referrer/${user_id}${_rest}`).then(response => {
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


/**
 * Analytics
 * Đếm toàn bộ số người giới thiệu được, chia làm 4 level
 */

type TypedCountReferrer = {
    level1: number,
    level2: number,
    level3: number,
    level4: number,
}

export function useCountReferrer() {
    return useMutation({
        mutationKey: ['user_referrer/count_my_sumarize'],
        mutationFn: () => axios.get<TypedCountReferrer>(`user_referrer/my_sumarize`).then(r => r.data)
    });
}


export type TypedMyReferrers = {
    "user_id": string,
    "display_name": string,
    "user_email": string,
    "user_phonenumber": string,
    "user_avatar": string,
    "user_status": number,
    "user_rate": string,
    "user_rate_count": string,
    "createdAt": string,
    "customer_to_user"?: {
        "customer_order_count": string,
        "customer_moneyspent_count": string
    }
    "level"?: number; // sử dụngn bởi danh sách những người vừa giới thiệu ... có level để hiển thị
}

/*
* User: get list of all my referrer
*/
export function useMyReferrers(object: IQuery) {
    const EndURL = helpers.buildEndUrl(object);
    return useQuery({
        queryKey: ["user_referrer/my_referrers"],
        queryFn: () => axios.get<TypedMyReferrers[]>(`/user_referrer/my_referrers${EndURL}`).then(response => {
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

/*
* User: get list of my_recent_referrer
*/
export function useMyRecentReferrers() {
    return useQuery({
        queryKey: ["user_referrer/my_recent_referrer"],
        queryFn: () => axios.get<TypedMyReferrers[]>(`/user_referrer/my_recent_referrer`).then(response => {
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