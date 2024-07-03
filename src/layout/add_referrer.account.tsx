import React, { useCallback, useEffect, useState } from 'react';
import { Banner, Box, Button, FooterHelp, Form, Frame, InlineGrid, InlineStack, Link, Page, Text, TextField } from '@shopify/polaris';
import __, { ___ } from 'languages/index';
import { useField, useForm } from '@shopify/react-form';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import helpers from 'helpers/index';
import { useAuth } from 'AuthContext';
import { useSetMyReferrer } from 'queries/user_referrer.query';

/**
 * Router add-referrer if CRM require ...
 * @returns
 */
export default function AddReferrer() {
  const history = useNavigate();

  let { mutateAsync: setMyReferrer } = useSetMyReferrer();
  let { user: account } = useAuth();

  const [internalInformation, setInternalInformation] = useState('');
  const toggleBannerActive = useCallback(() => {
    setInternalInformation('');
  }, []);

  /**
   * Khai báo field cho form!
   */
  const useFields = {
    user_referrer: useField<string>({
      value: '',
      validates: [],
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
      try {
        await setMyReferrer(form.user_referrer);
        setInternalInformation('Thành công! Đợi vài giây!');
        await helpers.sleep(2000);
        history('/login', {
          state: {
            mode: 'continue_login',
          },
        });
      } catch (e) {
        useFields['user_referrer'].setError(e?.message);
      }
      return { status: 'success' };
    },
  });

  return (
    <div
      id="user_referrer_wrap"
      style={{
        backgroundColor: '#000',
      }}
    >
      <Frame>
        <Page>
          <Helmet>
            <title>Thêm mã giới thiệu vào tài khoản</title>
          </Helmet>
          <InlineStack blockAlign="center" align="center" gap="100">
            <div id="login_page">
              {internalInformation && (
                <Banner tone="success" onDismiss={toggleBannerActive}>
                  {internalInformation}
                </Banner>
              )}

              <br />

              <Box background="bg-fill" padding={'400'} borderRadius="200">
                <Form onSubmit={submit} key={'active_account'}>
                  <Text as="h2" variant="headingLg">
                    Xin chào {account?.display_name || account?.user_email || account?.user_phonenumber}
                  </Text>
                  <br />
                  <Text as="p" variant="bodySm" tone="subdued">
                    Phiếu giảm giá, khuyến mại, nhận sự trợ giúp từ người hướng dẫn bạn, và rất nhiều giá trị khác mà một người giới thiệu mang lại.
                  </Text>

                  <br />

                  <TextField
                    autoFocus
                    label={__('register_referrer_form_label')}
                    helpText={__('register_referrer_form_helptext')}
                    autoComplete="off"
                    {...useFields.user_referrer}
                  />

                  <br />
                  <Button submit variant="primary" loading={submitting} fullWidth disabled={!dirty} onClick={submit}>
                    {__('add_my_referrer_button')}
                  </Button>
                </Form>
              </Box>
              {/* 
            <FooterHelp>
              {___('Go back to {homepage_link} or {login_link}', {
                homepage_link: <Link url="/">{__('homepage')}</Link>,
                login_link: <Link url="/login">{__('login')}</Link>,
              })}
            </FooterHelp> */}
            </div>
          </InlineStack>
        </Page>
      </Frame>
    </div>
  );
}
