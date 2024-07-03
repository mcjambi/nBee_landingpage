import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { TextField, Form, Button, Page, Link, Text, Frame, FooterHelp, InlineStack, Box, Banner, InlineGrid, ProgressBar } from '@shopify/polaris';
import { useField, useForm } from '@shopify/react-form';
import __, { ___ } from 'languages/index';

import { ViewIcon, HideIcon, PasskeyIcon } from '@shopify/polaris-icons';
import helpers from 'helpers/index';
import { useActiveAccount, useUserSetNewPassword } from 'queries/user.query';

/**
 * Người dùng sẽ nhập mã active hoặc điền mật khẩu ...
 * @returns
 */
export default function ActiveAccountLayout() {
  const { mutateAsync: setNewPassword } = useUserSetNewPassword();

  const navigate = useNavigate();
  const [internalError, setInternalError] = useState<string>('');
  const [showChangePasswordBox, setShowChangePasswordBox] = useState(false);

  let { mutateAsync: activeAccount } = useActiveAccount();

  let { state } = useLocation();
  // mode, user_email

  /**
   * Khai báo field cho form!
   */
  const useFields = {
    user_active_code: useField<string>({
      value: '',
      validates: [],
    }),
  };

  useEffect(() => {
    if (state?.mode === 'set_new_password_no_need_actived') {
      setShowChangePasswordBox(true);
    }
  }, [state]);

  const {
    fields,
    submit,
    dirty,
    submitting,
    reset: resetForm,
  } = useForm({
    fields: useFields,
    async onSubmit(form) {
      activeAccount({
        mode: state?.mode,
        code: form.user_active_code,
        user_email: state?.user_email,
      })
        .then((response) => {
          setShowChangePasswordBox(true);
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
    <>
      <Banner tone="critical" onDismiss={toggleBannerActive}>
        {internalError}
      </Banner>
      <br />
    </>
  ) : null;

  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [num3, setNum3] = useState<string>('');
  const [num4, setNum4] = useState<string>('');
  const [num5, setNum5] = useState<string>('');
  const [num6, setNum6] = useState<string>('');

  const [focusField, setFocusField] = useState(1);

  useEffect(() => {
    if (num1 !== '') setFocusField(2);
    if (num2 !== '') setFocusField(3);
    if (num3 !== '') setFocusField(4);
    if (num4 !== '') setFocusField(5);
    if (num5 !== '') setFocusField(6);

    if (num1 && num2 && num3 && num4 && num5 && num6) {
      useFields.user_active_code.onChange(num1 + '' + num2 + '' + num3 + '' + num4 + '' + num5 + '' + num6);
    } else {
      useFields.user_active_code.onChange('');
    }
  }, [num1, num2, num3, num4, num5, num6]);

  const [viewPasswordMode, setViewPasswordMode] = useState(false);
  const [passwordField1, setPasswordField1] = useState('');
  const [passwordField2, setPasswordField2] = useState('');
  const [errorInRepeatField, setErrorInRepeatField] = useState(false);
  const [errorInMainField, setErrorInMainField] = useState<boolean | string>(false);
  const [allowButtonReset, setAllowButtonReset] = useState(false);
  const [buttonResetLoading, setButtonResetLoading] = useState(false);

  useEffect(() => {
    if (!passwordField1) return;
    if (helpers.getPasswordStrength(passwordField1) < 3) {
      setErrorInMainField(true);
      setAllowButtonReset(false);
    } else if (helpers.isUTF8(passwordField1)) {
      setErrorInMainField(__('warning_utf8_in_password_field'));
      setAllowButtonReset(false);
    } else {
      setErrorInMainField(null);
    }
  }, [passwordField1]);

  useEffect(() => {
    if (!passwordField2) return;
    setAllowButtonReset(false);
    if (passwordField2 !== passwordField1) {
      setErrorInRepeatField(true);
    } else {
      setErrorInRepeatField(false);
      setAllowButtonReset(true);
    }
  }, [passwordField2, passwordField1]);

  const resetPasswordCallback = useCallback(async () => {
    setButtonResetLoading(true);
    await setNewPassword({
      code: useFields.user_active_code.value,
      user_email: state.user_email,
      password: passwordField1,
    })
      .then(() => {
        navigate('/login', {
          state: {
            message: __('congratulation_after_fill_active_code_and_set_new_password_message'),
          },
        });
      })
      .catch(() => {
        setInternalError('Lỗi, không thể reset lại mật khẩu.');
      });

    setButtonResetLoading(false);
  }, [passwordField1, useFields]);

  return (
    <Frame>
      <Page>
        <InlineStack blockAlign="center" align="center" gap="100">
          <div id="login_page">
            {errorBanner}

            {showChangePasswordBox ? (
              <Box background="bg-fill" padding={'400'} borderRadius="200">
                <Text as="h4" variant="headingSm">
                  Tuyệt vời, giờ hãy tạo mật khẩu của riêng bạn.
                </Text>
                <br />
                <TextField
                  label={__('register_form_your_password_label')}
                  type={viewPasswordMode ? 'text' : 'password'}
                  value={passwordField1}
                  error={errorInMainField}
                  onChange={(e) => setPasswordField1(e)}
                  suffix={
                    <InlineStack blockAlign="center">
                      <Button
                        variant="plain"
                        onClick={() => setViewPasswordMode(!viewPasswordMode)}
                        icon={viewPasswordMode ? ViewIcon : HideIcon}
                      ></Button>
                    </InlineStack>
                  }
                  autoComplete="off"
                  helpText={
                    <>
                      <br />
                      {__(helpers.getPasswordStrengthContext(helpers.getPasswordStrength(passwordField1)))}
                      <ProgressBar
                        progress={helpers.getPasswordStrength(passwordField1) * 20}
                        tone={helpers.getPasswordStrength(passwordField1) < 4 ? 'critical' : 'success'}
                        size="small"
                      />
                    </>
                  }
                />
                <br />
                <TextField
                  label={__('register_form_your_password_retype_label')}
                  value={passwordField2}
                  type={viewPasswordMode ? 'text' : 'password'}
                  error={errorInRepeatField}
                  onChange={(e) => setPasswordField2(e)}
                  autoComplete="off"
                />

                <br />

                <Button
                  variant="primary"
                  disabled={!allowButtonReset}
                  icon={PasskeyIcon}
                  onClick={resetPasswordCallback}
                  loading={buttonResetLoading}
                  fullWidth
                >
                  {state.mode === 'recover_password' ? __('button_reset_my_password') : __('active_my_account_and_login')}
                </Button>
              </Box>
            ) : (
              <Box background="bg-fill" padding={'400'} borderRadius="200">
                <Form onSubmit={submit} key={'active_account'}>
                  <Text as="h4" variant="headingMd">
                    Kiểm tra email, kể cả thư mục SPAM để chắc chắn bạn nhận được mã Active gồm 6 chữ số.
                  </Text>

                  <br />

                  <Text as="p">{__('active_code_form_label')}</Text>
                  <br />

                  <InlineGrid gap="200" columns={6}>
                    <TextField
                      key={`form_1`}
                      label=""
                      placeholder="•"
                      align="center"
                      maxLength={1}
                      focused={focusField === 1}
                      value={num1}
                      onChange={(v) => setNum1(v)}
                      autoComplete="off"
                    />
                    <TextField
                      key={`form_2`}
                      label=""
                      placeholder="•"
                      align="center"
                      maxLength={1}
                      focused={focusField === 2}
                      autoComplete="off"
                      value={num2}
                      onChange={(v) => setNum2(v)}
                    />
                    <TextField
                      key={`form_3`}
                      label=""
                      placeholder="•"
                      align="center"
                      maxLength={1}
                      focused={focusField === 3}
                      autoComplete="off"
                      value={num3}
                      onChange={(v) => setNum3(v)}
                    />
                    <TextField
                      key={`form_4`}
                      label=""
                      placeholder="•"
                      align="center"
                      maxLength={1}
                      focused={focusField === 4}
                      autoComplete="off"
                      value={num4}
                      onChange={(v) => setNum4(v)}
                    />
                    <TextField
                      key={`form_5`}
                      label=""
                      placeholder="•"
                      align="center"
                      maxLength={1}
                      focused={focusField === 5}
                      autoComplete="off"
                      value={num5}
                      onChange={(v) => setNum5(v)}
                    />
                    <TextField
                      key={`form_6`}
                      label=""
                      placeholder="•"
                      align="center"
                      maxLength={1}
                      focused={focusField === 6}
                      autoComplete="off"
                      value={num6}
                      onChange={(v) => setNum6(v)}
                    />
                  </InlineGrid>

                  <br />
                  <Button submit variant="primary" loading={submitting} fullWidth disabled={!dirty} onClick={submit}>
                    {__('active_my_account_and_reset_password')}
                  </Button>
                </Form>
              </Box>
            )}

            <FooterHelp>
              {___('Go back to {homepage_link} or {login_link}', {
                homepage_link: <Link url="/">{__('homepage')}</Link>,
                login_link: <Link url="/login">{__('login')}</Link>,
              })}
            </FooterHelp>
          </div>
        </InlineStack>
      </Page>
    </Frame>
  );
}
