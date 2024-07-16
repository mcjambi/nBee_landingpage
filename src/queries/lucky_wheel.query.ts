import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "helpers/index";
import queryClient, { IQueryParams } from 'queries';

type TypedToday = {
    "id": string,
    "user_id": string,
    "present_id": string,
    "createdAt": string
}
type TypedIsJoinToday = {
    "today": TypedToday[],
    "remain": number,
    "game_setting": {
        "lucky_day": string,
        "lucky_time_to": string,
        "lucky_time_from": string,
        "lucky_time_per_day": string
    }
}
/**
 * Check Join or Not ...
 * @returns 
 */
export function useCheckJoinToday() {
    // {{local_url}}/game/lucky_wheel/is_join_today
    return useQuery({
        queryKey: ['game/lucky_wheel/is_join_today'],
        queryFn: () => axios.get<TypedIsJoinToday>(`/game/lucky_wheel/is_join_today`).then((res) => res.data)
    });
}

type TypedListPlayer = {
    "user_id": string,
    "createdAt": string,
    "user": {
        "user_email": string,
        "user_phonenumber": string,
        "display_name": string,
        "user_avatar": string
    },
    "game_lucky_wheel_present": {
        "present_id": string,
        "present_name": string,
        "present_slug": string,
        "createdAt": string
    }
}

export function useListPlayer() {
    // {{local_url}}/game/lucky_wheel/list
    return useQuery({
        queryKey: ['game/lucky_wheel/list'],
        queryFn: () => axios.get<TypedListPlayer[]>(`/game/lucky_wheel/list?limit=8&sort=createdAt:desc`).then((res) => res.data)
    });
}


type TypedListPresent = {
    "present_id": string,
    "present_name": string,
    "present_slug": string,
    "createdAt": string
}

export function useListPresent() {
    // {{local_url}}/game/lucky_wheel/present
    return useMutation({
        mutationKey: ['game/lucky_wheel/present'],
        mutationFn: () => axios.get<TypedListPresent[]>('/game/lucky_wheel/present?limit=12&sort=createdAt:desc').then((res) => res.data)
    })
}


type TypedMyPresent = {
    "id": string,
    "user_id": string,
    "present_id": string,
    "createdAt": string,
    "game_lucky_wheel_present": {
        "present_id": string,
        "present_name": string,
        "present_slug": string,
        "createdAt": string
    }
}

export function useMyPresent() {
    // {{local_url}}/game/lucky_wheel/my_present
    return useMutation({
        mutationKey: ['game/lucky_wheel/my_present'],
        mutationFn: (query: IQueryParams) => axios.get<TypedMyPresent[]>('/game/lucky_wheel/my_present' + helpers.buildEndUrl(query)).then((response) => {
            let { data, headers } = response;
            return {
                body: data,
                totalItems: Number(headers['x-total-count'] || 0)
            }
        })
    })
}



export function useSetMyPresent() {
    // {{local_url}}/game/lucky_wheel/set_my_presents
    return useMutation({
        mutationKey: ['game/lucky_wheel/set_my_presents'],
        mutationFn: (present_slug: string) => axios.post('/game/lucky_wheel/set_my_presents', { present_slug }).then((res) => res.data),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['game/lucky_wheel/is_join_today'] })
            queryClient.invalidateQueries({ queryKey: ['game/lucky_wheel/list'] })
        }
    })
}