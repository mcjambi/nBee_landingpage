import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "helpers/index";
import queryClient, { IQueryParams } from 'queries';



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


