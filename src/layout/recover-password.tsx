import { useNavigate } from 'react-router-dom';

import { TextField, Form, Button, Page, Link, Text, Frame, FooterHelp, InlineStack, Box, Banner } from '@shopify/polaris';
import React, { useState, useCallback, useEffect } from 'react';
import LoginLogo from '../media/images/LoginLogo.svg';
import { lengthLessThan, lengthMoreThan, notEmptyString, useField, useForm } from '@shopify/react-form';

import helpers from '../helpers';
import __, { ___ } from 'languages/index';
import { useUserRecoverPassword } from 'queries/user.query';

export default function RecoverPasswordComponent() {
  const { mutateAsync: recoverPassword, error } = useUserRecoverPassword();

  const navigate = useNavigate();
  const [internalError, setInternalError] = useState<string>('');

  /**
   * Khai báo field cho form!
   */
  const useFields = {
    user_email: useField<string>({
      value: '',
      validates: [
        notEmptyString('Trường này không được để trống.'),
        lengthLessThan(60, 'Email quá dài!'),
        lengthMoreThan(6, 'Email quá ngắn!'),
        (inputValue) => {
          if (!helpers.isEmail(inputValue)) {
            return 'Định dạng Email không hợp lệ! Vui lòng kiểm tra lại email của bạn!';
          }
          if (helpers.isUTF8(inputValue)) {
            return 'Email không nên có mã Unicode, bạn vui lòng kiểm tra!';
          }
        },
      ],
    }),
  };

  const {
    fields,
    submit,
    dirty,
    submitting,
    reset: resetForm,
  } = useForm({
    fields: useFields,
    async onSubmit(form) {
      await recoverPassword({ user_email: form.user_email })
        .then(() => {
          navigate('/active-account', {
            state: {
              mode: 'recover_password',
              user_email: form.user_email,
            },
          });
        })
        .catch((e) => {
          let message = e.message || 'internal_error';
          setInternalError(message);
        });

      return { status: 'success' };
    },
  });

  const toggleBannerActive = useCallback(() => {
    setInternalError('');
  }, []);

  const errorBanner = internalError ? (
    <Banner tone="critical" onDismiss={toggleBannerActive}>
      {internalError}
    </Banner>
  ) : null;

  return (
    <Frame>
      <Page>
        <InlineStack blockAlign="center" align="center" gap="100">
          <div id="login_page">
            <Box background="bg-fill" padding={'400'}>
              <Form onSubmit={submit}>
                <div className="Login_logo" style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <img src={LoginLogo} alt="Logo" />
                  <Text as="h1" variant="headingMd">
                    {__('welcome')},{' '}
                  </Text>
                  <Text as="h3" variant="headingSm">
                    {__('Reset your password')}...
                  </Text>
                </div>

                {errorBanner}
                <br />

                <Text as="h4" variant="headingMd">
                  {__('warning_use_browser_in_the_last_login_success')}
                </Text>

                <br />

                <TextField
                  type="email"
                  placeholder="Email@mail.com"
                  label={__('forgot_email_form_label')}
                  {...fields.user_email}
                  requiredIndicator
                  autoComplete="off"
                  helpText={__('forgot_password_helptext')} // "Please use your email, also check junk folder to make sure you can receive our email. If you do NOT receive any email from us, check it back after 5 minutes."
                />

                <br />

                <Button submit variant="primary" loading={submitting} fullWidth disabled={!dirty} onClick={submit}>
                  {__('send_password_link_button')}
                </Button>
              </Form>
            </Box>
            <FooterHelp>
              <Text as="p">
                {___('Go back to {homepage_link} or {login_link}', {
                  homepage_link: <Link url="/">{__('homepage')}</Link>,
                  login_link: <Link url="/login">{__('login')}</Link>,
                })}
              </Text>
              <br />
              <Text as="p" variant="bodySm" tone="caution">
                {___('Can not login? Visit {help_center_link}', {
                  help_center_link: <Link url="/help_center">{__('help_center_text')}</Link>,
                })}
              </Text>
            </FooterHelp>
          </div>
        </InlineStack>
      </Page>
    </Frame>
  );
}

