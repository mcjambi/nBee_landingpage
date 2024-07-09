import helpers from "helpers/index";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";


/**
 * user referrer ...
 * @returns 
 */
export default function useReferrer() {

    let { search } = useLocation();

    /**
     * user_referrer tính theo cơ chế first click ... tính theo 30 ngày ...
     * append cái ref vào URL là được
     */
    useEffect(() => {
        let _searchParam = new URLSearchParams(search);
        let _user_referrer = _searchParam.get('ref') || _searchParam.get('user_referrer');
        if (!_user_referrer) return;
        // cơ chế last click
        helpers.cookie_set('user_referrer', _user_referrer, 30);
    }, [search]);

    return null;
}