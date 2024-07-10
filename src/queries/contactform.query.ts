import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "helpers/index";
import queryClient, { IQueryParams } from 'queries';

/**
*   Interface/model file auto generate for Contactform
*   Interface for back-end
*   Model for front-end.
*   They are the same!
*/
export interface TypedContactform {
    contactform_id?: string;
    user_id?: string;
    contactform_category?: string;
    contactform_title?: string;
    contactform_name?: string;
    contactform_email?: string;
    contactform_numberphone?: string;
    contactform_content?: string;
    contactform_ip?: string;
    contactform_status?: number;
    createdAt?: any;
    updatedAt?: any;


    // test
    updater?: any;
    user?: any;
    device_uuid?: string;

    user_to_contactform?: any
}

type IQuery = TypedContactform & IQueryParams;



/*
* List of all app
*/
export function useGetContactforms(object: IQuery) {
    const EndURL = helpers.buildEndUrl(object);
    return useQuery({
        queryKey: ["contactform/fetch_entities_list"],
        queryFn: () => axios.get<TypedContactform[]>(`/contactform${EndURL}`).then(response => {
            let { data, headers } = response;
            return {
                body: data,
                totalItems: Number(headers['x-total-count'] || 0)
            }
        }),
        retry: 1,
        refetchOnWindowFocus: true,
        enabled: true,
    });
}



export function useGetContactform() {
    return useMutation({
        mutationKey: ['contactform/fetch_entity'],
        mutationFn: (contactform_id: string) => axios.get<TypedContactform>(`contactform/${contactform_id}`).then((res) => res.data),
    });
}




export function useCreateContactform() {
    return useMutation({
        mutationKey: ['contactform/create_entity'],
        mutationFn: (entity: TypedContactform) => axios.post<TypedContactform>(`contactform`, helpers.cleanEntity(entity)).then((res) => res.data),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['contactform/fetch_entities_list'] })
        }
    });
}


