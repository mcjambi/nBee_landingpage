import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "../helpers";
import queryClient from './index';


export function useGetSetting() {
    return useMutation({
        mutationKey: ['settings/fetch_entity'],
        mutationFn: (setting_key: string) => axios.get<any>(`/settings/${setting_key}`).then((res) => res.data),
    });
}
