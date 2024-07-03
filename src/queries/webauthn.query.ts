import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";



export function useSignByPasskey() {
    return useMutation({
        mutationKey: ['webauthn/user_sign_by_passkey'],
        mutationFn: (passkeyID: string) => axios.post<any>(`/webauthn/verify-onetime-authentication/`, {
            passkey: passkeyID
        }).then((res) => res.data),
    });
}


export function useSignByPassword() {
    return useMutation({
        mutationKey: ['webauthn/user_sign_by_password'],
        mutationFn: (signByPasswordString: string) => axios.post<any>(`/login/sign`, {
            password: signByPasswordString
        }).then((res) => res.data),
    });
}