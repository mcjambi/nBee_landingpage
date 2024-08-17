import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import helpers from 'helpers/index';
import queryClient, { IQueryParams } from 'queries';
import { TypedMedia } from './media.query';

/**
 *   Interface/model file auto generate for Setting Group
 *   Interface for back-end
 *   Model for front-end.
 *   They are the same!
 */
export interface TypedShopping_cart {
    id?: string;
    user_id?: string;
    total_value?: number;
    total_quantity?: number;
    lastUpdated?: string;
    createdAt?: string;
}

/*
 * List of all app
 */
export function useGetShopingCart() {
    return useQuery({
        queryKey: ['shopping_cart/mine'],
        queryFn: () => axios.get<TypedShopping_cart>(`/shopping_cart/mine`).then((response) => response.data),
        retry: 1,
        refetchOnWindowFocus: true,
        enabled: true,
    });
}

export function useClearShoppingCart() {
    return useMutation({
        mutationKey: ['shopping_cart/fetch_entity'],
        mutationFn: () => axios.delete(`/shopping_cart/mine/clear_all`).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping_cart/mine'] });
            queryClient.invalidateQueries({ queryKey: ['shopping_cart_item/fetch_entity'] });
        },
    });
}

/**
 * Phần này dành cho shopping cart item
 * Phần này dành cho shopping cart item
 * Phần này dành cho shopping cart item
 */

export interface TypedShopping_cart_item {
    id?: string;
    shopping_cart_id?: string;
    product_id?: string;
    variant_id?: string;
    cart_quantity?: number;
    cart_price?: number;
    createdAt?: string;

    product?: {
        product_id: string,
        product_slug: string,
        product_name: string,
        product_thumbnail_to_media: TypedMedia,
        product_status: number,
    },
    product_variant?: {
        variant_name: string,
        variant_slug: string,
        variant_thumbnail_to_media: TypedMedia,
        variant_status: number,
    },

}

export function useGetShoppingCartItem() {
    return useQuery({
        queryKey: ['shopping_cart_item/fetch_entity'],
        queryFn: () =>
            axios.get<TypedShopping_cart_item[]>(`/shopping_cart_item/mine?limit=12`).then((response) => {
                let { data, headers } = response;
                return {
                    body: data,
                    totalItems: Number(headers['x-total-count'] || 0),
                };
            }),
        retry: 1,
        refetchOnWindowFocus: true,
        enabled: true,
    });
}

type TypedShoppingCartCreate = {
    product_id: string;
    variant_id: string;
    cart_quantity: number;
};

export function useAddToShoppingCart() {
    return useMutation({
        mutationKey: ['shopping_cart_item/create_entity'],
        mutationFn: (entity: TypedShoppingCartCreate) => axios.post(`/shopping_cart_item/mine/`, helpers.cleanEntity(entity)).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping_cart/mine'] });
            queryClient.invalidateQueries({ queryKey: ['shopping_cart_item/fetch_entity'] });
        },
    });
}

export function useUpdateShoppingCartItemQuantity() {
    return useMutation({
        mutationKey: ['shopping_cart_item/update_shopping_cart_item_quantity'],
        mutationFn: (entity: { id: string; cart_quantity: number }[]) => axios.patch(`/shopping_cart_item/mine/`, helpers.cleanEntity(entity)).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping_cart/mine'] });
            // queryClient.invalidateQueries({ queryKey: ['shopping_cart_item/fetch_entity'] });
        },
    });
}
