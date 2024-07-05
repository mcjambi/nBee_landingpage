import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "../helpers";
import queryClient, { IQueryParams } from './index';
import { TypedUser } from "./user.query";



/**
*   Interface/model file auto generate for Comment
*   Interface for back-end
*   Model for front-end.
*   They are the same!
*/
export interface TypedOrder {
    order_id?: any;
    order_pnr?: string;
    user_id?: string;
    order_total_price?: string;
    order_total_fee?: string;
    product_id?: string;
    order_status?: any;
    payment_status?: any;
    order_note?: string;
    customer_campaign?: bigint;
    customer_campaign_relationship_id?: any;
    order_print_packing_slip?: number;
    order_delivery_type?: number;
    order_has_physical_product?: number; /** để xem là đơn kỹ thuật số hay đơn vật lý ... */
    order_checked?: number;
    createdBy?: string;
    createdAt?: any;
    updatedAt?: any;
    user?: any;
    customer_data?: TypedUser;
    order_fullfillment?: any;
}

type IQuery = TypedOrder & IQueryParams;



type bulkUpdateInput = {
    order_pnr: string;
    mode: string;
};

/*
* List of all orders 
*/
export function useGetOrders(object: IQuery) {
    const EndURL = helpers.buildEndUrl(object);
    return useQuery({
        queryKey: ["orders/fetch_many"],
        queryFn: () => axios.get<TypedOrder[]>(`/orders${EndURL}`).then(response => {
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
* Get one orders
*/
export function useGetOrderDetail() {
    return useMutation({
        mutationKey: ["orders/fetch_one"],
        mutationFn: (order_id: string) => axios.get<TypedOrder>(`/orders/${order_id}`).then(response => response.data)
    });
}

/** Create order  */
export function useCreateOrder() {
    return useMutation({
        mutationKey: ["orders/create_entity"],
        mutationFn: (entity: TypedOrder) => axios.post<TypedOrder>(`/orders`, helpers.cleanEntity(entity)).then(response => response.data)
    });
}

/** Update order */
export function useUpdateOrder() {
    return useMutation({
        mutationKey: ["orders/create_entity"],
        mutationFn: ({ order_id, ...rest }: TypedOrder) => axios.put<TypedOrder>(`/orders/${order_id}`, helpers.cleanEntity(rest)).then(response => response.data),
        onSettled(data, error, variables, context) {
            if (!error)
                queryClient.invalidateQueries({ queryKey: ['orders/fetch_one'] })
        },
    });
}


/** Bulk Update order */
export function useDeleteOrder() {
    return useMutation({
        mutationKey: ["orders/delete_entity"],
        mutationFn: (order_id: string) => axios.delete<TypedOrder>(`/orders/${order_id}`).then(response => response.data)
    });
}


/** Bulk Update order */
export function useBulkUpdateOrder() {
    return useMutation({
        mutationKey: ["orders/bulkUpdateEntities"],
        mutationFn: (rest: bulkUpdateInput) => axios.patch<any>(`/orders/bulkUpdateEntities`, helpers.cleanEntity(rest)).then(response => response.data)
    });
}



/** Order Assign */
export function useGetAssignList() {
    return useMutation({
        mutationKey: ["order/assign/fetch_entity_list"],
        mutationFn: (order_id: string) => axios.get<any>(`/orders/assign/${order_id}`).then(response => response.data)
    });
}


/** Order Add Assign */
export function useCreateAssign() {
    return useMutation({
        mutationKey: ["order/assign/create_entity"],
        mutationFn: (entity: { user_id: any; order_id: any }) => axios.post<any>(`/orders/assign/`, helpers.cleanEntity(entity)).then(response => response.data)
    });
}


/** Order Add Assign */
export function useDeleteAssign() {
    return useMutation({
        mutationKey: ["order/assign/delete_entity"],
        mutationFn: (assign_id: string) => axios.delete<any>(`/orders/assign/${assign_id}`).then(response => response.data)
    });
}