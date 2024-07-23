import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "../helpers";
import queryClient from './index';


export interface TypedAuthenticationResponse {
    access_token: string,
    refresh_token: string,
    expires_at: string,
    must_add_referrer?: boolean,
}

export interface TypedLogin {
    user_input?: string;
    user_email?: string;
    password?: string;
    remember?: number;
    access_token?: string;
    token?: string;
    device_type?: string;
    device_signature?: string;
    device_uuid?: any;
}

export interface TypedRegister {
    user_input: string;
    user_email?: string;
    display_name: string;
    device_type?: string;
    device_signature?: string;
    device_uuid?: any;
    user_referrer?: string;
}

export interface TypedUserToJob {
    user_id: string | number | bigint,
    job_id: string[] | number[]
}
export interface TypedUser {
    user_id?: string;
    user_login?: string;
    user_email?: string;
    user_title?: string | null;
    display_name?: string;
    bio?: string | null;
    user_role?: string;
    user_status?: number;
    user_phonenumber?: string | null;
    user_birthday?: string | null;
    user_avatar?: string | null;
    user_gender?: string;
    user_address?: string | null;
    user_address_city?: string | null;
    user_address_district?: string | null;
    user_address_ward?: string | null;
    user_rate?: number;
    user_rate_count?: number;
    user_achievement_count?: number;
    user_verified_email?: number;
    user_verified_phone?: number;
    user_verified_profile?: number;
    createdAt?: string;
    updatedAt?: string | null;
    createdBy?: string | null;
    lastActive?: string;
    referrer_code?: string;
    _count?: {
        user_activity: number;
        orders: number;
        customers: number;
        referred: number;
    };
    referrer?: string | null;
    user_social_profile?: any[]; // Adjust the type as needed
    user_to_job?: any[]; // Adjust the type as needed
    capacities?: string[];
    must_validated_account?: number;
}


/** 
 * Trả về user data hoặc là throw lỗi nếu chưa login ...
 */
export function useGetCurrentUserData() {
    return useQuery({
        queryKey: ["user"],
        queryFn: () => axios.get<TypedUser>("/user").then((res) => res.data),
        retry: 1
    });
}


export function useGetEntity() {
    return useMutation({
        mutationKey: ['user_get_entity'],
        mutationFn: (userID: string) => axios.get<TypedUser>(`/user/${userID}`).then((res) => res.data),
    });
}


export function useUserLogout() {
    return useMutation({
        mutationKey: ['user_logout'],
        mutationFn: () => axios.get<any>("/logout"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    })
}


export function useUpdateProfile() {
    return useMutation({
        mutationKey: ['user_update_profile'],
        mutationFn: ({ user_id: user_profile_id, ...entity }: TypedUser) => axios.patch<TypedUser>(`/user/`, helpers.cleanEntity(entity)),
        onSuccess: () => {
            /** Để reset lại data, chỉ cần nhớ key, nó sẽ refetch lại ... */
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    })
}


export function useAddUserToJob() {
    return useMutation({
        mutationKey: ['user_add_user_to_job'],
        mutationFn: (entity: any) => axios.post<any>(`/user/user_to_job/`, helpers.cleanEntity(entity)),
    })
}


/** Payment method ? Chưa save */


export interface TypedUser_bank_information {
    id?: string;
    user_id?: string;
    bank_name?: string;
    bank_owner_display_name?: string;
    bank_owner_number_account?: string;
    bank_owner_card_number?: string;
    createdAt?: string;
}


export function useGetUserPayment() {
    return useQuery({
        queryKey: ["user_get_user_payment"],
        queryFn: () => axios.get<TypedUser_bank_information>("/user_bank_information").then((res) => res.data),
        retry: 1,
        refetchOnWindowFocus: false,
    });
}


export function useUpdateUserPayment() {
    return useMutation({
        mutationKey: ['user_add_user_payment'],
        mutationFn: (entity: TypedUser_bank_information) => axios.patch<TypedUser_bank_information>(`/user_bank_information`, helpers.cleanEntity(entity)),
        onSuccess: () => {
            /** Để reset lại data, chỉ cần nhớ key, nó sẽ refetch lại ... */
            queryClient.invalidateQueries({ queryKey: ['user_get_user_payment'] });
        }
    })
}

/** END USER Payment method */



export function useUserQuickLogin() {
    return useMutation({
        mutationKey: ['quick_login'],
        mutationFn: (entity: TypedLogin) => axios.post<TypedAuthenticationResponse>(`login/onetimepassword`, helpers.cleanEntity(entity))
    })
}

export function useUserLogin() {
    return useMutation({
        mutationKey: ['manual_login'],
        mutationFn: (entity: TypedLogin) => axios.post<TypedAuthenticationResponse>(`login`, helpers.cleanEntity(entity))
    })
}


export function useLoginByFacebook() {
    return useMutation({
        mutationKey: ['user_facebook_login'],
        mutationFn: (entity: TypedLogin) => axios.post<TypedLogin>(`login/facebook`, helpers.cleanEntity(entity))
    })
}



export function useCheckActiveCode() {
    return useMutation({
        mutationKey: ['user_check_active_code'],
        mutationFn: (entity: any) => axios.post<TypedLogin>(`user/check_active_code`, helpers.cleanEntity(entity))
    })
}


export function useGetActiveCode() {
    return useMutation({
        mutationKey: ['user_get_active_code'],
        mutationFn: (entity: any) => axios.post<any>(`user/get_active_code`, helpers.cleanEntity(entity))
    })
}

/** Gửi mã active lên server để active tài khoản ... */
export function useActiveAccount() {
    return useMutation({
        mutationKey: ['user_active_account'],
        mutationFn: (entity: { code?: string, user_email?: string, user_phonenumber?: string }) => axios.post<any>(`user/active_account`, helpers.cleanEntity(entity)),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    })
}



/**
 * JamDev: register
 */
export function useUserRegister() {
    return useMutation({
        mutationKey: ['user_register'],
        mutationFn: (entity: TypedRegister) => axios.post<TypedAuthenticationResponse>(`register`, helpers.cleanEntity(entity))
    })
}


/**
 * JamDev: RecoverPassword
 */

export function useUserRecoverPassword() {
    return useMutation({
        mutationKey: ['user_recover_password'],
        mutationFn: (entity: any) => axios.post<TypedRegister>(`recover_password`, helpers.cleanEntity(entity))
    })
}


/**
 * Set new Password
 */

export function useUserSetNewPassword() {
    return useMutation({
        mutationKey: ['user_set_new_password'],
        mutationFn: (entity: { password: string, user_email?: string, user_phonenumber?: string, code?: string, current_password?: string }) => axios.patch<any>(`user/set_new_password`, helpers.cleanEntity(entity))
    })
}


/** Generate password */
export function useGenerateWebAuthLoginOption() {
    return useMutation({
        mutationKey: ['webauthn/generate-authentication-options'],
        mutationFn: () => axios.get<any>(`/webauthn/generate-authentication-options`)
    })
}

/** webauthn */

export function useGenerateWebAuthRegisterOption() {
    return useMutation({
        mutationKey: ['webauthn/generate-registration-options'],
        mutationFn: () => axios.get<any>(`/webauthn/generate-registration-options`)
    })
}


export function useVerifyWebAuthlogin() {
    return useMutation({
        mutationKey: ['webauthn/verify-authentication'],
        mutationFn: (authResp: {
            data: any,
            challenge: string,
            [propKey: string]: any
        }) => axios.post<any>(`/webauthn/verify-authentication`, helpers.cleanEntity(authResp))
    })
}

export function useVerifyWebAuthRegister() {
    return useMutation({
        mutationKey: ['webauthn/verify-registration'],
        mutationFn: (authResp: {
            data: any,
            challenge: string,
            [propKey: string]: any
        }) => axios.post<any>(`/webauthn/verify-registration`, (authResp)),
        onSuccess: () => {
            /** Để reset lại data, chỉ cần nhớ key, nó sẽ refetch lại ... */
            queryClient.invalidateQueries({ queryKey: ['webauthn/get_all_passkey'] });
        }
    })
}


export function useGetAllMyPasskey() {
    return useQuery({
        queryKey: ['webauthn/get_all_passkey'],
        queryFn: () => axios.get<any[]>(`/webauthn`).then((res) => res.data),
    })
}


export function useDeletePasskey() {
    return useMutation({
        mutationKey: ['webauthn/deletePasskey'],
        mutationFn: (passkeyID: any) => axios.delete<any>(`/webauthn/${passkeyID}`),
        onSuccess: () => {
            /** Để reset lại data, chỉ cần nhớ key, nó sẽ refetch lại ... */
            queryClient.invalidateQueries({ queryKey: ['webauthn/get_all_passkey'] });
        },
    })
}