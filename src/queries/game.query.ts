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

export interface TypedGame {
    id?: string;
    game_title?: string;
    game_excerpt?: string;
    game_description?: string;
    game_thumbnail?: string;
    game_slug?: string;
    game_setting?: string;
    game_status?: number;
    createdAt?: string;
}


type IQuery = TypedGame & IQueryParams;


/*
* List of all app
*/
export function useGetGame(object: IQuery) {
    const EndURL = helpers.buildEndUrl(object);
    return useQuery({
        queryKey: ["game/fetch_entity_list"],
        queryFn: () => axios.get<TypedGame[]>(`/game${EndURL}`).then(response => {
            let { data, headers } = response;
            return {
                body: data,
                totalItems: Number(headers['x-total-count'] || 0)
            }
        }),
        retry: 1,
        // refetchOnWindowFocus: true,
        // enabled: false,
    });
}



export function useGetAGame() {
    return useMutation({
        mutationKey: ['game/fetch_entity'],
        mutationFn: (game_slug: string) => axios.get<TypedGame>(`/game/${game_slug}`).then((res) => res.data)
    });
}



