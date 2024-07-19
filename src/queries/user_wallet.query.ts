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


export interface TypedWallet {
    "wallet_type_id": string,
    "user_id": string,
    "balance": number,
    "wallet_type"?: {
        "id": string,
        "wallet_unit": string,
        "wallet_sign": string,
        "wallet_name": string,
        "is_default": number,
    }
}

export interface TypedUserTransaction {
    "transaction_id": string,
    "sender_wallet_id": string,
    "receiver_wallet_id": string,
    "amount": number,
    "transaction_type": string,
    "transaction_category": string,
    "transaction_note": string,
    "transaction_hash": string,
    "createdAt": string
}

type IQuery = TypedWallet & IQueryParams;


/*
* List of all user wallet
*/
export function useGetMyWallet() {
    return useQuery({
        queryKey: ["my_wallet/fetch_wallet_list"],
        queryFn: () => axios.get<TypedWallet[]>(`/wallet/my_wallet`).then(response => {
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

export function useGetMyOneWallet(wallet_unit: string) {
    return useQuery({
        queryKey: ["my_wallet/fetch_wallet_list"],
        queryFn: () => axios.get<TypedWallet>(`/wallet/my_wallet/${wallet_unit}`).then(response => {
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

// {{local_url}}/transactions/my_transaction/:wallet_unit


/*
* List of all transaction in a wallet ...
*/
export function useGetMyTransaction(wallet_unit: string, object: IQuery) {
    const EndURL = helpers.buildEndUrl(object);
    return useQuery({
        queryKey: ["transactions/fetch_entity_list"],
        queryFn: () => axios.get<TypedUserTransaction[]>(`/transactions/my_transaction/${wallet_unit}${EndURL}`).then(response => {
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


type TypedWalletRank = {
    "balance": string,
    "user": {
        "display_name": string,
        "user_avatar": string
    }
}

/**
 * Cho phép xếp hạng người dùng theo ví, 
 * @returns 
 */
export function useGetWalletRank() {
    return useMutation({
        mutationKey: ['user_wallet/get_rank'],
        mutationFn: (wallet_slug: string) => axios.get<TypedWalletRank[]>(`wallet/rank/${wallet_slug}?limit=10`).then(res => res.data)
    });
}