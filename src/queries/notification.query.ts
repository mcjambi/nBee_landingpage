import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "helpers/index";
import queryClient, { IQueryParams } from 'queries';


export interface TypedNotification {
    notification_id?: number;
    notification_title?: string;
    notification_content?: string;
    notification_schedule?: any;
    notification_status?: number;
    notification_user?: number | string;
    notification_channel?: string;
    notification_data?: string;
    createdAt?: any;
    createdBy?: number;
}


type IQuery = TypedNotification & IQueryParams;


/*
* List of all notification
*/
export function useGetNotifications(object: IQuery) {
    const EndURL = helpers.buildEndUrl(object);
    return useQuery({
        queryKey: ["notification"],
        queryFn: () => axios.get<TypedNotification[]>(`/notification${EndURL}`).then((res) => res.data),
        retry: 1,
        refetchOnWindowFocus: true,
    });
}

