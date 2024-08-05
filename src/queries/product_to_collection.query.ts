import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "helpers/index";
import queryClient, { IQueryParams } from 'queries';


type TypedProduct_to_collection = {
    "ID"?: string,
    "product_id"?: string,
    "collection_id"?: string,
    "relationship_hash"?: string,
    "createdAt"?: string,
    "product"?: {
        "product_id"?: string,
        "product_description"?: string,
        "product_slug"?: string,
        "product_name"?: string,
        "product_price"?: number,
        "product_original_price"?: number,
        "product_price_range"?: string,
        "product_status"?: number,
        "product_sold_quantity"?: number,
        "product_thumbnail"?: string,
        "product_to_category"?: any,
    }
}

type IQuery = TypedProduct_to_collection & IQueryParams;


/*
* List of all product in product to collection
*/
export function useGetProductToCollections() {
    return useMutation({
        mutationKey: ["product_to_collection/fetch_entity_list"],
        mutationFn: (object: IQuery) => axios.get<TypedProduct_to_collection[]>(`/product_to_collection${helpers.buildEndUrl(object)}`).then(response => {
            let { data, headers } = response;
            return {
                body: data,
                totalItems: Number(headers['x-total-count'] || 0)
            }
        }),
        retry: 1,
    });
}