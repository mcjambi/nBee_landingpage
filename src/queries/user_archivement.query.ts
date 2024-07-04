import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "helpers/index";
import { IQueryParams } from "queries";
import queryClient from './index';


export type TypedAchievementConditionName = "JOIN_DATE" | "ORDER_NUMBER" | "PAYMENT_NUMBER" | "TASK_DONE" | "AFFILIATE_NUMBER" | ""
export type TypedAchievementConditionAction = "immediately" | "daily" | "weekly" | "monthly";


export interface TypedUserAchievement {
    achievement_id?: string | bigint,
    achievement_badge?: string,
    achievement_name?: string,
    achievement_slug?: string,
    achievement_description?: string,
    achievement_status?: number,
    achievement_condition_name?: TypedAchievementConditionName, // name 
    achievement_condition_value?: string, // day ...
    achievement_condition_action?: TypedAchievementConditionAction, // interval
    createdAt?: bigint | string,
}



export interface TypeUserToAchievement {
    ID?: bigint | string,
    user_id?: bigint | string,
    achievement_id?: bigint | string,
    createdAt?: bigint | string,
    user?: any
    achievement?: any
}

type TypedQuery = TypedUserAchievement & IQueryParams;

/*
* List of all achievement
*/
export function useGetAchivements(params: TypedQuery) {
    const EndURL = helpers.buildEndUrl(params);
    return useQuery({
        queryKey: ["achievement"],
        queryFn: () => axios.get<TypedUserAchievement[]>(`/achievement${EndURL}`).then(response => {
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


export function useGetAchivement() {
    return useMutation({
        mutationKey: ['achievement/fetch_entity'],
        mutationFn: (achievement_id: string) => axios.get<TypedUserAchievement>(`/achievement/${achievement_id}`).then((res) => res.data),
    });
}

/** Load các thành tựu mà người đó đạt được! */
export function useGetAssignee(params: IQueryParams) {
    const EndURL = helpers.buildEndUrl(params);
    return useQuery({
        queryKey: ["user_to_achievement/fetch_list"],
        queryFn: () => axios.get<TypedUserAchievement[]>(`/user_to_achievement${EndURL}`).then(response => {
            let { data, headers } = response;
            return {
                body: data,
                totalItems: headers['x-total-count'] || 0
            }
        }),
        retry: 1,
        refetchOnWindowFocus: true,
        enabled: true,
    });
}

/** Lấy huân chương đầu tiên trong đời ... Huân chương gia nhập */
export function useGetFirstAchivement() {
    return useMutation({
        mutationKey: ['achievement/get_first_achievement'],
        mutationFn: () => axios.get<TypedUserAchievement>(`/achievement/get_my_first_achievement`).then((res) => res.data),
        onSettled(data, error, variables, context) {
            if (!error) {
                queryClient.invalidateQueries({ queryKey: ['user_to_achievement/fetch_list'] })
            }
        }
    });
}