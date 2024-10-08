import axios from 'axios';
import helpers from '../helpers';
import { router_must_sign } from '../constant';

/**
 * Timeout for 5 second
 */
const TIMEOUT = Number(process.env.REACT_APP_API_REQUEST_TIMEOUT) || 10000
axios.defaults.timeout = (TIMEOUT);
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

declare const window: any;


export function AxiosInterceptor(onStatus: (status: number) => void, onError: (error: string) => void, onLoading: (loading: boolean) => void): void {

    const onRequestSuccess = async (config: any) => {
        onLoading(true);
        config.headers['X-Authorization'] = helpers.cookie_get('AT');
        config.headers['User-Referrer'] = helpers.cookie_get('user_referrer');

        /**
         * If one of router need X-Signed to signed, automatically added here ...
         */
        config.headers['X-Signed'] = helpers.cookie_get('XS');
        let current_url = config['url'] || '';
        const isURLAllowed = router_must_sign.some((allowedURL: any) => current_url.includes(allowedURL));

        if (typeof window !== 'undefined' && (isURLAllowed)) {
            await window.getPassport((passportData: any) => {
                let {
                    __passport, __passport_verified, __passport_with_key
                } = passportData;
                config.headers['X-Passport'] = __passport;
                config.headers['X-Passport-Verified'] = __passport_verified;
                config.headers['X-Passport-With-Key'] = __passport_with_key;
            });
        }
        config.params = config.params || {};
        /**
         * Auto add cacheBuster to avoid cache in browser
         */
        config.params["cacheBuster"] = helpers.getRandomNumber(8);
        return config;
    };
    const onResponseSuccess = (response: any) => {
        // set access_token
        onLoading(false);

        const access_token = response.headers['x-authorization'] || false;
        if (access_token) helpers.cookie_set('AT', access_token, 30);
        return response;
    };

    const onResponseError = (err: any) => {
        onLoading(false);

        const status = err.status || err?.response?.status || 0;
        /***************
        * 401: User not (correctly) authenticated, the resource/page require authentication
        * 403: User's role or permissions does not allow to access requested resource, for instance user is not an administrator and requested page is for administrators.
        * 412: User must signed before process, it will valid in 2 minutes
        */
        onStatus(status);
        /**
         * translate all error message ...
         */
        let Data = err?.response?.data ?? { message: 'internet_connection_error' };
        let err_need_translate = Data?.message ?? 'internet_connection_error';
        onError(err_need_translate);
        return Promise.reject(Data);
    };

    const onRequestError = (err: any) => {
        onLoading(false);
        console.log('===>request Error: ', err);
        return Promise.reject(err);
    }

    axios.interceptors.request.use(onRequestSuccess, onRequestError);
    axios.interceptors.response.use(onResponseSuccess, onResponseError);
}