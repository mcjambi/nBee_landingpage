import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "helpers/index";
import queryClient, { IQueryParams } from 'queries';

type TypedRankData = {
    "id": string,
    "user_id": string,
    "count": number,
    "createdAt": string,
    "user": {
        user_id: string,
        display_name: string | null,
        user_avatar: string | null
    }
}

/**
 * Check Join or Not ...
 * @returns 
 */
export function useCheckJoin() {
    return useQuery({
        queryKey: ['game/checkin/check_join'],
        queryFn: async () => await axios.get<{
            joined: boolean
        }>(`/game/checkin/check_join`).then((res) => res.data)
    });
}


export function useLetMeJoin() {
    // {{local_url}}/game/checkin/join
    return useMutation({
        mutationKey: ['game/checkin/join'],
        mutationFn: () => axios.post('/game/checkin/join')
    })
}

export function useMyCheckin() {
    // {{local_url}}/game/checkin/my_checkin
    return useMutation({
        mutationKey: ['game/checkin/my_checkin'],
        mutationFn: () => axios.get('/game/checkin/my_checkin').then(r => r.data)
    })
}
export function useDoCheckin() {
    //{{local_url}}/game/checkin/do_checkin
    return useMutation({
        mutationKey: ['game/checkin/do_checkin'],
        mutationFn: () => axios.post('/game/checkin/do_checkin').then(r => r.data)
    })
}
export function useGetRankCheckin() {
    // {{local_url}}/game/checkin/rank
    return useMutation({
        mutationKey: ['game/checkin/rank'],
        mutationFn: () => axios.get<TypedRankData[]>('/game/checkin/rank').then(r => r.data)
    })
}


