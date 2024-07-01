import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import helpers from "../helpers";
import queryClient from './index';

export interface TypedUser {
    user_id: string;
    user_login: string;
    user_email: string;
    user_title: string | null;
    display_name: string;
    bio: string | null;
    user_role: string;
    user_status: number;
    user_phonenumber: string | null;
    user_birthday: string | null;
    user_avatar: string | null;
    user_gender: string;
    user_address: string | null;
    user_address_city: string | null;
    user_address_district: string | null;
    user_address_ward: string | null;
    user_rate: number;
    user_rate_count: number;
    user_achievement_count: number;
    user_verified_email: number;
    user_verified_phone: number;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string | null;
    lastActive: string;
    _count: {
        user_activity: number;
        orders: number;
        customers: number;
        referred: number;
    };
    referrer: string | null;
    user_social_profile: any[]; // Adjust the type as needed
    user_to_job: any[]; // Adjust the type as needed
    capacities: string[];
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