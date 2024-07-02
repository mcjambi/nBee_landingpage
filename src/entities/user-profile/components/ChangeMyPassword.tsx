import React, { useEffect } from 'react';
import {
  Link,
  FormLayout,
  Modal,
  Toast,
  SkeletonDisplayText,
  TextField,
  Form,
  Text,
  ProgressBar,
  InlineStack,
  Button,
  ContextualSaveBar,
  BlockStack,
  InlineGrid,
  Box,
  Card,
  Badge,
  DropZone,
  Icon,
  Divider,
} from '@shopify/polaris';
import { SaveIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import helpers from 'helpers';
import { useNavigate } from 'react-router-dom';
import __ from 'languages/index';
import { ViewIcon, HideIcon, PlusIcon, PasskeyIcon, XIcon } from '@shopify/polaris-icons';
import { platformAuthenticatorIsAvailable, startRegistration } from '@simplewebauthn/browser';
import {
  useDeletePasskey,
  useGenerateWebAuthRegisterOption,
  useGetAllMyPasskey,
  useUserSetNewPassword,
  useVerifyWebAuthRegister,
} from 'queries/user.query';

/**
 * Change his/her password
 * @param param0
 * @returns
 */
export default function ChangeMyPassword() {
  const __passport = (window as any).__passport || '';

  const { mutateAsync: setNewPassword } = useUserSetNewPassword();
  const { mutateAsync: generateWebAuthRegisterOption } = useGenerateWebAuthRegisterOption();
  const { mutateAsync: verifyWebAuthRegister } = useVerifyWebAuthRegister();
  const { data: passkeyList, isLoading: loadingPasskeyList } = useGetAllMyPasskey();
  const { mutateAsync: deletePasskey } = useDeletePasskey();

  const navigate = useNavigate();

  /**
   * Lấy URL ra... để query. chú ý phải load nội dung mới
   * trong useEffect
   */

  //   let useParam =  {} as any;
  //   useParam = useParams();
  //   let Param = useParam.users_slug || false;

  const [viewPasswordMode, setViewPasswordMode] = useState(false);
  const [viewPasswordMode1, setViewPasswordMode1] = useState(false);
  const [passwordField, setPasswordField] = useState('');
  const [passwordField1, setPasswordField1] = useState('');
  const [passwordField2, setPasswordField2] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [errorInRepeatField, setErrorInRepeatField] = useState(false);
  const [errorInMainField, setErrorInMainField] = useState<boolean | string>(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const generatePasswordAuto = () => {
    let autoPass = helpers.getRandomHash(12);
    setPasswordField1(autoPass);
    setPasswordField2(autoPass);
  };

  useEffect(() => {
    if (!passwordField2) return;
    if (passwordField2 !== passwordField1) {
      setErrorInRepeatField(true);
    } else {
      setErrorInRepeatField(false);
    }
  }, [passwordField2, passwordField1]);

  const submitChangePassword = async () => {
    if (errorInRepeatField || errorInMainField) return;
    setButtonLoading(true);
    await setNewPassword({
      current_password: passwordField,
      password: passwordField2,
    })
      .then(async () => {
        await helpers.sleep(2000);
        setButtonLoading(false);
        navigate('/login');
      })
      .catch((e) => {
        setButtonLoading(false);
        setOldPasswordError(__('old_password_invalid'));
      });
  };

  const deleteMyPasskey = useCallback(async (ID: any) => {
    await deletePasskey(ID)
      .then()
      .catch((e) => {});
  }, []);

  const PassKeyList = useCallback(() => {
    if (passkeyList && passkeyList?.length > 0) {
      return (
        <>
          {passkeyList?.map((element) => {
            return (
              <div style={{ marginBottom: '15px' }} key="npasskey">
                <InlineGrid columns="auto 1fr auto" alignItems="center">
                  <div className="big-icon">
                    <Icon source={PasskeyIcon} />
                  </div>
                  <div>
                    <Text as="h2" variant="headingSm">
                      Chìa khóa #{element.ID}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Đã tạo: {helpers.subtractTimeHistory(element.createdAt)}
                    </Text>
                    {element?.device?.user_agent ? (
                      <Text as="p" variant="bodyMd">
                        Đăng nhập lần cuối {element.updatedAt ? helpers.subtractTimeHistory(element.updatedAt) : ''} tại {element?.device?.user_agent}
                      </Text>
                    ) : (
                      <Text as="p" variant="bodyMd">
                        Chưa đăng nhập lần nào bằng Passkey này!
                      </Text>
                    )}
                  </div>
                  <Button onClick={() => deleteMyPasskey(element.ID)} accessibilityLabel={__('logout')} icon={XIcon}>
                    {__('logout')}
                  </Button>
                </InlineGrid>
              </div>
            );
          })}
        </>
      );
    } else {
      return <Text as="p">Chưa có một khóa nào!</Text>;
    }
  }, [passkeyList]);

  const [passkeysupport, setPasskeysupport] = useState(false);
  const checkPasskeySupport = useCallback(async () => {
    let check = await platformAuthenticatorIsAvailable();
    if (check) setPasskeysupport(true);
  }, []);

  useEffect(() => {
    checkPasskeySupport();
  }, []);

  const [showResultOfRegBiometrics, setShowResultOfRegBiometrics] = useState('');
  const clearResultOfRegBiometrics = useCallback(() => {
    setShowResultOfRegBiometrics('');
  }, []);

  const handleRegisterPasskey = async () => {
    try {
      const { data: options } = await generateWebAuthRegisterOption();
      let { challenge } = options;
      const attResp = await startRegistration(options);
      const { data: verificationJSON } = await verifyWebAuthRegister({
        data: attResp,
        challenge: challenge,
        device_type: 'website',
        device_signature: 'a_ignore' /** For notification, but website doesn't need it ... */,
        device_uuid: __passport,
      });
      if (verificationJSON.verified === true) {
        setShowResultOfRegBiometrics(__('Đăng ký thành công!'));
      } else {
        setShowResultOfRegBiometrics(__('Đăng ký chưa thành công!'));
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setShowResultOfRegBiometrics(__('Thiết bị đã được đăng ký cho tài khoản khác!'));
    }
  };

  const toastMarkup = showResultOfRegBiometrics ? <Toast content={showResultOfRegBiometrics} onDismiss={clearResultOfRegBiometrics} /> : null;

  return (
    <>
      {toastMarkup}
      <BlockStack gap={{ xs: '800', sm: '400' }}>
        <InlineGrid columns={{ xs: '1fr', md: '2fr 5fr' }} gap="400">
          <Box as="section" paddingInlineStart={{ xs: '400', sm: '0' }} paddingInlineEnd={{ xs: '400', sm: '0' }}>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Mật khẩu đăng nhập
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Form onSubmit={submitChangePassword}>
                <FormLayout>
                  <TextField
                    error={oldPasswordError}
                    label={__('change_my_password_type_your_old_password')}
                    type={viewPasswordMode ? 'text' : 'password'}
                    value={passwordField}
                    onChange={(e) => setPasswordField(e)}
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
                    autoFocus
                    selectTextOnFocus
                  />

                  <TextField
                    label={__('change_my_password_label')}
                    type={viewPasswordMode1 ? 'text' : 'password'}
                    disabled={passwordField.length < 6}
                    value={passwordField1}
                    error={errorInMainField}
                    onChange={(e) => setPasswordField1(e)}
                    suffix={
                      <InlineStack blockAlign="center">
                        <Button
                          variant="plain"
                          onClick={() => setViewPasswordMode1(!viewPasswordMode1)}
                          icon={viewPasswordMode1 ? ViewIcon : HideIcon}
                        ></Button>
                      </InlineStack>
                    }
                    autoComplete="off"
                    helpText={
                      <>
                        {__(helpers.getPasswordStrengthContext(helpers.getPasswordStrength(passwordField1)))}
                        <ProgressBar
                          progress={helpers.getPasswordStrength(passwordField1) * 20}
                          tone={helpers.getPasswordStrength(passwordField1) < 4 ? 'critical' : 'success'}
                          size="small"
                        />
                      </>
                    }
                  />
                  <TextField
                    label={__('change_my_password_retype_label')}
                    value={passwordField2}
                    disabled={passwordField.length < 6}
                    type={viewPasswordMode1 ? 'text' : 'password'}
                    error={errorInRepeatField}
                    onChange={(e) => setPasswordField2(e)}
                    autoComplete="off"
                  />
                </FormLayout>
                <div style={{ padding: '15px 0' }}>
                  Cần sự an toàn hơn? <Link onClick={generatePasswordAuto}>Tạo mật khẩu</Link> tự động.
                </div>

                <Text as="p" tone="caution">
                  Sau khi thay đổi mật khẩu thành công, bạn sẽ phải đăng nhập lại!
                </Text>
              </Form>
            </BlockStack>
            <br />
            <Divider />
            <br />
            <InlineStack align="end">
              <Button
                icon={SaveIcon}
                onClick={submitChangePassword}
                disabled={helpers.getPasswordStrength(passwordField1) < 4 || errorInRepeatField}
                loading={buttonLoading}
              >
                {__('button_set_my_password')}
              </Button>
            </InlineStack>
          </Card>
        </InlineGrid>
        <InlineGrid columns={{ xs: '1fr', md: '2fr 5fr' }} gap="400">
          <Box as="section" paddingInlineStart={{ xs: '400', sm: '0' }} paddingInlineEnd={{ xs: '400', sm: '0' }}>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Passkey <Badge tone="attention">Nên dùng</Badge>
              </Text>
              <Text as="p" variant="bodyMd">
                Đăng nhập bằng dấu vân tay, nhận dạng khuôn mặt hoặc mã PIN thay cho mật khẩu. Bạn có thể đồng bộ passkey trên các thiết bị đã đăng
                nhập vào cùng một nền tảng (như ID Apple hoặc tài khoản Google).
              </Text>
              <Text as="p">
                Tìm hiểu thêm về{' '}
                <Link target="_blank" url="https://help.shopify.com/vi/manual/your-account/logging-in/passkeys">
                  Passkey
                </Link>
              </Text>
            </BlockStack>
          </Box>

          <Card roundedAbove="sm">
            <BlockStack gap="400">
              {loadingPasskeyList ? (
                <>
                  <InlineGrid gap="400" columns={4}>
                    <SkeletonDisplayText size="medium" />
                    <SkeletonDisplayText size="medium" />
                    <SkeletonDisplayText size="medium" />
                    <SkeletonDisplayText size="medium" />
                  </InlineGrid>
                </>
              ) : (
                <PassKeyList />
              )}

              {passkeysupport ? (
                <InlineStack align="center" blockAlign="center">
                  <div onClick={handleRegisterPasskey} className="clickable">
                    <br />
                    <Button variant="plain" icon={PlusIcon}>
                      Thêm Passkey
                    </Button>
                    <br />
                  </div>
                </InlineStack>
              ) : (
                <Text as="p">Trình duyệt không hỗ trợ Passkey</Text>
              )}
            </BlockStack>
          </Card>
        </InlineGrid>
      </BlockStack>
    </>
  );
}
