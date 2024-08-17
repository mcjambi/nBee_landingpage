import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "helpers/index";
import queryClient, { IQueryParams } from 'queries';
import { TypedMedia } from "./media.query";



/**
*   Interface/model file auto generate for Setting Group
*   Interface for back-end
*   Model for front-end.
*   They are the same!
*/

export type ProductVariant = {
    "id"?: string,
    "product_id"?: string,
    "variant_thumbnail"?: string,
    "variant_name"?: string,
    "variant_slug"?: string,
    "variant_excerpt"?: string,
    "variant_sku"?: string,
    "variant_barcode"?: string,
    "variant_price"?: number,
    "variant_status"?: number,
    "hash"?: string,
    "createdAt"?: string

    variant_thumbnail_to_media?: TypedMedia
}

type ProductVariantGroup = {
    "id"?: string,
    "product_id"?: string,
    "variant_group_name"?: string,
    "variant_group_value"?: string,
    "hash"?: string,
    "createdAt"?: string
}

export interface TypedProduct {
    product_id?: string;
    product_name?: string;
    product_slug?: string;
    product_excerpt?: string;
    product_description?: string;

    product_thumbnail?: string;
    product_price?: number;
    product_original_price?: number;
    product_price_range?: string;
    product_sold_quantity?: number;
    product_type?: string;
    product_has_variants?: number;

    product_variant_group?: ProductVariantGroup[];
    product_variant?: ProductVariant[];
    product_to_category?: any[];
    product_to_collection?: any[];

    product_thumbnail_to_media?: TypedMedia
}


type IQuery = TypedProduct & IQueryParams;


/*
* List of all app
*/
export function useGetProducts() {
    return useMutation({
        mutationKey: ["product/fetch_entity_list"],
        mutationFn: (object: IQuery) => axios.get<TypedProduct[]>(`/product${helpers.buildEndUrl(object)}`).then(response => {
            let { data, headers } = response;
            return {
                body: data,
                totalItems: Number(headers['x-total-count'] || 0)
            }
        }),
        retry: 1,
    });
}



export function useGetProduct() {
    return useMutation({
        mutationKey: ['product/fetch_entity'],
        mutationFn: (product_slug: string) => axios.get<TypedProduct>(`/product/${product_slug}`).then((res) => res.data),
        retry: 1,
    });
}


type TypedProductMedia = {

    "id": string,
    "product_id": string,
    "media_id": string,
    "hash": string,
    "media_order": number,
    "media": TypedMedia

}

/** Lấy thông tin media ... */
export function useGetProductMedia() {
    return useMutation({
        mutationKey: ['product_to_media/fetch_entity_list'],
        mutationFn: (product_id: string) => axios.get<TypedProductMedia[]>(`/product_to_media/${product_id}`).then((res) => res.data),
        retry: 1,
    });
}


