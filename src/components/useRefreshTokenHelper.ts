import __helpers from "helpers/index";
import { useRefreshMyToken } from "queries/session.query";
import { useCallback, useEffect } from "react";



export default function useRefreshTokenHelper() {

    const { mutateAsync: RefreshMyToken } = useRefreshMyToken();

    const loadRefreshToken = useCallback(async () => {
        let RT = __helpers.cookie_get('RT');
        let EA = __helpers.cookie_get('EA');
        if (!EA || !RT || !__helpers.isNumeric(EA)) return;

        let hours_passed = Math.floor((Number(EA) - new Date().getTime()) / (1000 * 60 * 60));
        if (hours_passed > 4) return;

        try {
            let { access_token, refresh_token, expires_at } = await RefreshMyToken(RT);
            __helpers.cookie_set('AT', access_token, 30);
            __helpers.cookie_set('RT', refresh_token, 30);
            __helpers.cookie_set('EA', expires_at, 30);
        } catch (e) {
            console.error(e, 'REFRESH TOKEN ERROR E_45');
        }
    }, []);

    const loadUserData = useCallback(async () => {
        document.getElementById('root').style.display = 'block';
        document.getElementById('before_load').style.display = 'none';
        document.getElementById('before_load').style.width = '0';
        document.getElementById('before_load').style.height = '0';
    }, []);


    const initLoadingUserData = useCallback(async () => {
        try {
            await loadRefreshToken();
        } catch (e) {
            console.log(e, 'REFRESH TOKEN ERROR');
        }
        await loadUserData();
        setInterval(() => {
            loadRefreshToken();
        }, 120000);
    }, [loadRefreshToken]);

    useEffect(() => {
        initLoadingUserData();
    }, []);

}