import {
  Frame,
  FormLayout,
  TextField,
  Form,
  Button,
  Link,
  Text,
  FooterHelp,
  Banner,
  Loading,
  InlineStack,
  Box,
  Page,
  Popover,
  ActionList,
  Thumbnail,
} from '@shopify/polaris';

import 'media/css/login_register.scss';

import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import LoginLogo from 'media/images/LoginLogo.svg';
import { useLocation, useNavigate } from 'react-router-dom';

import { lengthLessThan, lengthMoreThan, notEmptyString, useField, useForm } from '@shopify/react-form';

import helpers from '../helpers';

import useReferrer from 'components/useReferrer';
import __, { ___ } from 'languages/index';

import { EnterIcon, ViewIcon, HideIcon, LanguageTranslateIcon, PersonLockFilledIcon, KeyIcon } from '@shopify/polaris-icons';
import axios, { AxiosResponse } from 'axios';
import { startAuthentication, browserSupportsWebAuthn, platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';
import { Helmet } from 'react-helmet-async';
import { useGenerateWebAuthLoginOption, useUserLogin, useVerifyWebAuthlogin } from 'queries/user.query';
import { TypedApp } from 'queries/app.query';

export default function Login() {
  const { mutateAsync: generateWebAuthLoginOption } = useGenerateWebAuthLoginOption();
  const { mutateAsync: login, isPending: loading } = useUserLogin();
  const { mutateAsync: verifyWebAuthlogin } = useVerifyWebAuthlogin();

  const history = useNavigate();

  const __passport = (window as any).__passport || '';
  const [viewPasswordMode, setViewPasswordMode] = useState(false);

  const [sso_notice, setSso_notice] = useState<any>(null);
  const [loginLogoURI, setLoginLogoURI] = useState<string>(LoginLogo);
  const [loginMainTitle, setLoginMainTitle] = useState<string>(__('welcome'));
  const [loginSubTitle, setLoginSubTitle] = useState<string>(__('login'));

  const [internalErrorShow, setInternalErrorShow] = useState('');

  const clearInternalError = useCallback(() => {
    setInternalErrorShow('');
  }, []);

  /**
   * Do NOT remove
   * Đây là hàm check referrer, không được xóa ...
   */
  useReferrer();

  useLayoutEffect(() => {
    const SearchParam = new URLSearchParams(search);
    let app_id = SearchParam.get('app_id');
    if (app_id) {
      localStorage.setItem('app_id', app_id);
    }
    if (SearchParam.get('redirect_to')) {
      let decodeURI = decodeURIComponent(SearchParam.get('redirect_to'));
      localStorage.setItem('redirect', decodeURI);
    }
    fetchSSOApp();
  }, []);

  // /login/sso
  let { pathname, state: loginState, search } = useLocation();

  const fetchSSOApp = useCallback(async () => {
    let app_id = localStorage.getItem('app_id');
    if (!app_id) return;
    try {
      // SSO query to APP data for display information ...
      let _appData: AxiosResponse<TypedApp> = await axios.get(process.env.REACT_APP_BACKEND_URL + '/app/' + app_id);
      let appData = _appData.data;

      setSso_notice(
        ___('After login, you will be redirect to {app_name}, back to {app_homepage} homepage!', {
          app_name: <strong>{appData.app_name}</strong>,
          app_homepage: <Link url={appData.app_homepage}>{appData.app_name}</Link>,
        })
      );

      /**
       * Check before redirect
       */
      try {
        let redirect = localStorage.getItem('redirect');
        let decodeURI = decodeURIComponent(redirect);
        let { host } = new URL(decodeURI);
        let { host: appHost } = new URL(appData.app_homepage);
        if (host !== appHost) {
          localStorage.setItem('redirect', appData.app_homepage);
        }
      } catch (e) {
        localStorage.setItem('redirect', appData.app_homepage);
      }

      if (appData.app_thumbnail) setLoginLogoURI(process.env.REACT_APP_AJAX_UPLOAD_PERMALINK + '/' + appData.app_thumbnail);

      setLoginMainTitle(appData.app_name);
      setLoginSubTitle(appData.app_description);
    } catch (e) {
      // nếu lỗi gì, xóa luôn localStorage cho chắc chắn
      localStorage.removeItem('app_id');
      localStorage.removeItem('redirect');
    }
  }, [search]);

  /** Bắt đầu redirect ở đây... */
  const redirectTo = useCallback(
    (access_token_for_sso: string) => {
      let redirect_to = localStorage.getItem('redirect') || process.env.REACT_APP_PUBLIC_URL;
      let app_id = localStorage.getItem('app_id');
      if (app_id) {
        // cần chuyển URL sang bên khác ...
        window.location.href = decodeURIComponent(redirect_to) + `#oauth_access_token=` + access_token_for_sso;
      } else {
        window.location.href = decodeURIComponent(redirect_to);
      }
    },
    [pathname]
  );

  const removeSSO = () => {
    localStorage.removeItem('app_id');
    localStorage.removeItem('redirect');
    window.location.href = '/login';
  };

  // trường hợp add_referrer add-referrer sẽ phải quay lại trang này, nhưng báo là
  // cứ thế đăng nhập ...
  useEffect(() => {
    if (loginState && loginState?.mode === 'continue_login') {
      redirectTo(helpers.cookie_get('AT'));
    }
  }, [loginState]);

  /**
   * Khai báo field cho form!
   */
  const useFields = {
    user_input: useField<string>({
      value: '',
      validates: [
        notEmptyString('Trường này không được để trống.'),
        lengthLessThan(50, 'Bạn điền quá dài!'),
        lengthMoreThan(6, 'Email/số điện thoại quá ngắn!'),
        (inputValue) => {
          if (!helpers.isPhoneNumber(inputValue))
            if (!helpers.isEmail(inputValue)) {
              return 'Định dạng Email không hợp lệ! Vui lòng kiểm tra lại email của bạn!';
            }
          if (helpers.isUTF8(inputValue)) {
            return 'Trường này không nên có mã Unicode, bạn vui lòng kiểm tra lại!';
          }
        },
      ],
    }),
    password: useField<string>({
      value: '',
      validates: [
        notEmptyString('Trường này không được để trống.'),
        lengthMoreThan(6, 'Mật khẩu quá ngắn!'),
        (inputValue) => {
          if (helpers.isUTF8(inputValue)) {
            return 'Không nên dùng mã Unicode trong mật khẩu của bạn!';
          }
        },
      ],
    }),
  };

  const {
    fields,
    submit,
    reset: resetForm,
  } = useForm({
    fields: useFields,
    async onSubmit(form) {
      await login({
        user_input: form.user_input,
        password: form.password,
        device_type: 'website',
        device_signature: 'a_ignore' /** For notification, but website doesn't need it ... */,
        device_uuid: __passport,
      })
        .then(({ data }: any) => {
          let { access_token, refresh_token, expires_at, must_add_referrer } = data;
          helpers.cookie_set('AT', access_token, 30);
          helpers.cookie_set('RT', refresh_token, 30);
          helpers.cookie_set('EA', expires_at, 30);
          if (must_add_referrer === '1') {
            return history('/add-referrer');
          }
          redirectTo(access_token);
        })
        .catch((e) => {
          setInternalErrorShow(e?.message);
        });
      return { status: 'success' };
    },
  });

  useEffect(() => {
    resetForm();
  }, []);

  const [buttonFacebookLoading, setbuttonFacebookLoading] = useState(false);
  const loginByFacebookButton = useCallback(() => {
    setbuttonFacebookLoading(true);
  }, []);

  const facebookURICallback = process.env.REACT_APP_PUBLIC_URL + '/login/facebook';
  const loginByFacebookURL =
    process.env.REACT_APP_FACEBOOK_CLIENT_ID &&
    `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&display=popup&response_type=token&redirect_uri=` +
      facebookURICallback;

  const [languagePopoverStatus, setLanguagePopoverStatus] = useState(false);
  const toggleLanguagePopoverActive = useCallback(() => setLanguagePopoverStatus((active) => !active), []);

  const setDefaultLanguage = useCallback((lang_code: string) => {
    localStorage.setItem('language', lang_code);
    setLanguagePopoverStatus(false);
  }, []);

  const [waiting_for_webauthn, setWaiting_for_webauthn] = useState(false);
  const handleLoginByWebAuth = async () => {
    try {
      setWaiting_for_webauthn(true);
      const { data: options } = await generateWebAuthLoginOption();
      let { challenge } = options;
      const PublicKeyCredential = await startAuthentication(options);
      const { data: verificationJSON } = await verifyWebAuthlogin({
        data: PublicKeyCredential,
        challenge: challenge,
        device_type: 'website',
        device_signature: 'a_ignore' /** For notification, but website doesn't need it ... */,
        device_uuid: __passport,
      });
      if (verificationJSON.verified) {
        setInternalErrorShow('');
        let { access_token, refresh_token, expires_at } = verificationJSON.data;
        helpers.cookie_set('AT', access_token, 30);
        helpers.cookie_set('RT', refresh_token, 30);
        helpers.cookie_set('EA', expires_at, 30);

        /** Đánh dấu lại là tên này có dùng biometric Authentication và có thể dùng cho các giao dịch sau ... */
        helpers.cookie_set('BA', '1', 365);
        redirectTo(access_token);
      } else {
        setInternalErrorShow(__('login_via_webauthn_fail'));
        helpers.cookie_set('BA', '0', 365);
        setWaiting_for_webauthn(false);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setInternalErrorShow(__('login_fail_this_device_has_not_registered_yet'));
      setWaiting_for_webauthn(false);
    }
  };

  return (
    <Frame>
      <Helmet>
        <title>{__('login_page_title')}</title>
      </Helmet>
      {loading ? <Loading /> : null}
      <div id="login_register_outer_wrap">
        <InlineStack blockAlign="center" align="center">
          <div id="login_page" style={{ maxWidth: '400px' }}>
            <InlineStack blockAlign="center" align="end" gap="200">
              <Popover
                active={languagePopoverStatus}
                activator={
                  <Button onClick={toggleLanguagePopoverActive} disclosure variant="plain" icon={LanguageTranslateIcon}>
                    {__('switch_language_button')}
                  </Button>
                }
                autofocusTarget="first-node"
                onClose={toggleLanguagePopoverActive}
              >
                <ActionList
                  actionRole="menuitem"
                  items={[
                    {
                      content: 'Vietnamese',
                      onAction: () => setDefaultLanguage('vi'),
                      icon: LanguageTranslateIcon,
                    },
                    {
                      content: 'English',
                      onAction: () => setDefaultLanguage('en'),
                      icon: LanguageTranslateIcon,
                    },
                  ]}
                />
              </Popover>
            </InlineStack>

            <br />
            {internalErrorShow && (
              <>
                <Banner tone="critical" onDismiss={clearInternalError}>
                  {internalErrorShow}
                </Banner>
                <br />
              </>
            )}

            {sso_notice && (
              <>
                <Banner onDismiss={removeSSO}>
                  <p>{sso_notice}</p>
                </Banner>
                <br />
              </>
            )}

            <Box background="bg-fill" padding={'400'} borderRadius="400">
              <Form onSubmit={submit}>
                <InlineStack wrap={false} gap="200" blockAlign="center" align="start">
                  <div>
                    <Thumbnail size="medium" source={loginLogoURI} alt={'Login Logo'} />
                  </div>
                  <div>
                    <Text as="h3" variant="headingMd" fontWeight="regular">
                      {loginMainTitle}
                    </Text>
                    <Text as="h6" variant="bodySm" fontWeight="regular">
                      {loginSubTitle}
                    </Text>
                  </div>
                </InlineStack>

                <br />

                {loginState?.message && (
                  <>
                    <Text tone="success" as="p">
                      {loginState.message || ' '}
                    </Text>
                    <br />
                  </>
                )}
                <FormLayout>
                  <TextField
                    type="text"
                    disabled={loading}
                    placeholder=""
                    label={__('login_by_your_account')}
                    {...fields.user_input}
                    requiredIndicator
                    autoComplete="off"
                  />
                  <TextField
                    disabled={loading}
                    label={__('login_by_your_password')}
                    placeholder="******"
                    type={viewPasswordMode ? 'text' : 'password'}
                    requiredIndicator
                    autoComplete="off"
                    suffix={
                      <InlineStack blockAlign="center">
                        <Button
                          variant="plain"
                          onClick={() => setViewPasswordMode(!viewPasswordMode)}
                          icon={viewPasswordMode ? ViewIcon : HideIcon}
                        ></Button>
                      </InlineStack>
                    }
                    {...fields.password}
                  />

                  <Button
                    icon={PersonLockFilledIcon}
                    submit
                    variant="primary"
                    fullWidth
                    disabled={loading}
                    onClick={submit}
                    key={'button_login_normal'}
                    size="large"
                  >
                    {__('login_button_context')}
                  </Button>

                  {loginByFacebookURL && (
                    <Link key="FBA" target="_self" removeUnderline monochrome url={loginByFacebookURL} onClick={loginByFacebookButton}>
                      <Button size="large" icon={EnterIcon} fullWidth loading={buttonFacebookLoading}>
                        {__('login_by_facebook_button')}
                      </Button>
                    </Link>
                  )}

                  {/* {browserSupportsWebAuthn() && platformAuthenticatorIsAvailable() && (
                    <Button size="large" icon={KeyIcon} fullWidth loading={waiting_for_webauthn} key="BA" onClick={handleLoginByWebAuth}>
                      {__('login_using_biometric_authentication_button')}
                    </Button>
                  )} */}

                  <Text as="p" key="C">
                    {___("Forgot your password? {recover_link} to recover! If you don\\'t have an account, you can {register_link} here.", {
                      recover_link: <Link url="/recover_password">{__('click_here')}</Link>,
                      register_link: <Link url="/register">{__('register')}</Link>,
                    })}
                  </Text>
                </FormLayout>
              </Form>
            </Box>
            <br />
            <Text as="p" alignment="center">
              {___('Can not login? Visit {help_center_link}', {
                help_center_link: (
                  <Link monochrome url="/help_center">
                    {__('help_center_text')}
                  </Link>
                ),
              })}
            </Text>
          </div>
        </InlineStack>
      </div>
    </Frame>
  );
}
