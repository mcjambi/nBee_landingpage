import { useNavigate } from 'react-router-dom';
import { Text, FormLayout, TextField, Form, Button, Link, InlineStack, Checkbox, FooterHelp, Frame, Banner, Box } from '@shopify/polaris';
import { useState, useCallback, useEffect, useRef } from 'react';
import LoginLogo from '../media/images/LoginLogo.svg';
import { asChoiceField, lengthLessThan, lengthMoreThan, notEmptyString, useField, useForm } from '@shopify/react-form';

import helpers from '../helpers';
import __, { ___ } from 'languages/index';
import useReferrer from 'components/useReferrer';
import { Helmet } from 'react-helmet-async';
import { TypedAuthenticationResponse, TypedUser, useUserRegister } from 'queries/user.query';

export default function Register() {
  const { mutateAsync: register, isPending } = useUserRegister();
  /**
   * Kéo kho tổng ra...
   */
  const [toastActive, setToastActive] = useState('');

  /**
   * Do NOT remove, please!
   * Liên quan tới referrer
   */
  useReferrer();

  // const dispatch = useAppDispatch();
  const history = useNavigate();

  const __passport = (window as any).__passport || '';

  useEffect(() => {
    resetForm();
  }, []);

  /** Do we need validate? */
  const registerSuccessCallback = useCallback((data: TypedAuthenticationResponse) => {
    // if (typeof data.must_validated_account !== 'undefined' && data.must_validated_account === 1) {
    let { access_token, refresh_token, expires_at } = data;
    helpers.cookie_set('AT', access_token, 30);
    helpers.cookie_set('RT', refresh_token, 30);
    helpers.cookie_set('EA', expires_at, 30);

    history('/active-account', {
      state: {
        mode: 'set_new_password',
      },
    });
    // }
  }, []);

  /**
   * Khai báo field cho form!
   */
  const useFields = {
    user_input: useField<string>({
      value: '',
      validates: [
        notEmptyString(__('field_not_allow_empty')),
        lengthLessThan(50, 'Bạn nhập quá dài!'),
        lengthMoreThan(6, 'Bạn nhập quá ngắn!'),
        (inputValue) => {
          if (helpers.isUTF8(inputValue)) {
            return 'Trường này không nên có mã Unicode, bạn vui lòng kiểm tra lại!';
          }
        },
      ],
    }),

    display_name: useField<string>({
      value: '',
      validates: [
        notEmptyString(__('field_not_allow_empty')),
        lengthLessThan(100, 'Tên của bạn quá dài!'),
        lengthMoreThan(2, 'Tên của bạn quá ngắn!'),
      ],
    }),

    agreement: useField<boolean>({
      value: false,
      validates: [
        (inputValue) => {
          if (!inputValue) {
            return __('you_must_agree_with_term_of_service');
          }
        },
      ],
    }),
  };

  const {
    fields,
    submit,
    submitting,
    dirty,
    reset: resetForm,
  } = useForm({
    fields: useFields,
    async onSubmit(form) {
      // reset password...
      await register({
        user_input: form.user_input,
        display_name: form.display_name,
        device_type: 'website',
        device_signature: 'a' /** For notification, but website doesn't need it ... */,
        device_uuid: __passport,
      })
        .then((r) => {
          registerSuccessCallback(r.data);
        })
        .catch((e) => {
          setToastActive(e?.message);
        });

      return { status: 'success' };
    },
  });

  const toggleToastActive = useCallback(() => {
    setToastActive('');
  }, []);

  const errorBanner = toastActive ? (
    <>
      <Banner tone="critical" onDismiss={toggleToastActive}>
        {toastActive}
      </Banner>
      <br />
    </>
  ) : null;

  return (
    <Frame>
      <Helmet>
        <title>{__('register_page_title')}</title>
      </Helmet>
      <div id="login_register_outer_wrap">
        <InlineStack blockAlign="center" align="center">
          <div id="login_page">
            <Box background="bg-fill" padding={'400'} borderRadius="400">
              <Form onSubmit={submit}>
                <div className="Login_logo" style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <img src={LoginLogo} alt="Logo" />
                  <Text as="h1">{__('welcome_register_header')}, </Text>
                  <Text as="h3">{__('register_title')}</Text>
                </div>
                {errorBanner}
                <FormLayout>
                  <TextField
                    label={__('register_form_your_email_phone_number_label')} //"Your email"
                    {...fields.user_input}
                    requiredIndicator
                    autoFocus={true}
                    clearButton
                    onClearButtonClick={() => fields.user_input.reset()}
                    autoComplete="off"
                  />

                  <TextField
                    type="text"
                    placeholder={''} //"Your display name"
                    label={__('register_form_your_name_label')}
                    {...fields.display_name}
                    requiredIndicator
                    autoComplete="off"
                  />

                  {/* {settingData?.setting_value === '1' && (
                  <TextField
                    type="text"
                    placeholder={''} //"Your display name"
                    label={__('register_referrer_form_label')}
                    requiredIndicator
                    helpText={__('register_referrer_form_helptext')}
                    autoComplete="off"
                    {...fields.user_referrer}
                  />
                )} */}

                  <Checkbox
                    label={___('I have read and agree to the {term_of_service_link}.', {
                      term_of_service_link: <Link url={'/help_center/tos'}>{__('Term of Service')}</Link>,
                    })} //"I have read and agree to the Terms of Use."
                    {...asChoiceField(fields.agreement)}
                    helpText={''}
                  />

                  <Button submit variant="primary" fullWidth disabled={!dirty} loading={submitting} onClick={submit} size="large">
                    {__('register_and_active_now')}
                  </Button>
                </FormLayout>
              </Form>
            </Box>
            <FooterHelp>
              {___('Go back to {homepage_link} or {login_link}', {
                homepage_link: <Link url="/">{__('homepage')}</Link>,
                login_link: <Link url="/login">{__('login')}</Link>,
              })}
            </FooterHelp>
          </div>
        </InlineStack>
      </div>
    </Frame>
  );
}
