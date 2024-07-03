import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import helpers from '../helpers';

import { useLoginByFacebook } from 'queries/user.query';

export default function LoginByFacebook() {
  const { mutateAsync: loginByFacebook } = useLoginByFacebook();

  const __passport = (window as any).__passport || '';

  // /login/sso
  let { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      let _hash = helpers.ExtractUrl(hash);
      let access_token = _hash['#access_token'] || '';
      if (!access_token) return;
      facebookCallbackSuccess(access_token);
    }
  }, [hash]);

  const redirectTo = useCallback(async (access_token_for_sso: string) => {
    let app_id = localStorage.getItem('app_id');
    let redirect_to = localStorage.getItem('redirect') || process.env.REACT_APP_PUBLIC_URL;
    if (app_id) {
      window.location.href = decodeURIComponent(redirect_to) + `#oauth_access_token=` + access_token_for_sso;
    } else {
      window.location.href = decodeURIComponent(redirect_to);
    }
  }, []);

  const facebookCallbackSuccess = useCallback(
    async (access_token: string) => {
      await loginByFacebook({
        access_token: access_token,
        device_type: 'website',
        device_signature: 'a' /** For notification, but website doesn't need it ... */,
        device_uuid: __passport,
      })
        .then(({ headers }) => {
          const token = headers['x-authorization'] ?? '';
          redirectTo(token);
        })
        .catch((e) => {});
    },
    [__passport, loginByFacebook, redirectTo]
  );

  return <div style={{ padding: 10, margin: 'auto' }}>{hash ? 'Loading...' : 'Error'}</div>;
}
