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


const apiUrl = 'user_referrer';


export function useSetMyReferrer() {
    return useMutation({
        mutationKey: ['user_referrer/set_my_referrer'],
        mutationFn: (referrer: string) => axios.post<any>(`${apiUrl}/set_my_referrer`, { referrer }),
    });
}


/**
 * JamDev: updateReferrer
 */

export function useUpdateReferrer() {
    return useMutation({
        mutationKey: ['user_referrer/update_referrer'],
        mutationFn: (entity: { customer_id: any, referrer_id: any }) => axios.post<any>(`${apiUrl}/`, helpers.cleanEntity(entity))
    });
}