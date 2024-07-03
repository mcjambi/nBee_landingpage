import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import helpers from 'helpers/index';
import { useUserLogout, useUserQuickLogin } from 'queries/user.query';

export default function QuickLogin() {
  const { mutateAsync: quick_login, isSuccess, error, isIdle } = useUserQuickLogin();

  let useParam = {} as any;
  useParam = useParams();
  let token = useParam.token || '';

  const __passport = (window as any).__passport || '';

  useEffect(() => {
    const params: any = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop: string): string => searchParams.get(prop),
    });
    if (params.redirect_to) {
      let decodeURI = decodeURIComponent(params.redirect_to);
      localStorage.setItem('redirect', decodeURI);
    } else {
      localStorage.setItem('redirect', process.env.REACT_APP_PUBLIC_URL);
    }
  }, []);

  const { mutate: logoutMe } = useUserLogout();
  useEffect(() => {
    /** Log out user */
    logoutMe();
  }, []);

  const loginByOnetimePassword = useCallback(async (token: string) => {
    await helpers.sleep(1000);
    await quick_login({
      device_type: 'website',
      device_signature: 'donotexistatall' /** For notification, but website doesn't need it ... */,
      device_uuid: __passport,
      token: token,
    })
      .then(({ data }: any) => {
        let { access_token, refresh_token, expires_at } = data;
        helpers.cookie_set('AT', access_token, 30);
        helpers.cookie_set('RT', refresh_token, 30);
        helpers.cookie_set('EA', expires_at, 30);
      })
      .catch((e) => {
        helpers.cookie_set('AT', '', -1);
        helpers.cookie_set('RT', '', -1);
        helpers.cookie_set('EA', '', -1);
      });
  }, []);

  useEffect(() => {
    if (token) loginByOnetimePassword(token);
  }, [token]);

  useEffect(() => {
    if (!isIdle) return;
    let redirect_to = localStorage.getItem('redirect') || process.env.REACT_APP_PUBLIC_URL;
    window.location.href = decodeURIComponent(redirect_to);
  }, [isIdle]);

  return <>Waiting...</>;
}

