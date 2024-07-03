import { BlockStack, DropZone, InlineStack, Modal, TextContainer, Text, Icon, Link, TextField, Button, Form, Tooltip } from '@shopify/polaris';
import __ from 'languages/index';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import face_id_icon from 'media/images/face-id-svgrepo-com.svg';
import { EnterIcon, ViewIcon, HideIcon, QuestionCircleIcon } from '@shopify/polaris-icons';
import helpers from 'helpers/index';
import { bufferToBase64URLString } from '@simplewebauthn/browser';
import { useSignByPasskey, useSignByPassword } from 'queries/webauthn.query';

/**
 * Xác thực hai bước, quan trọng!
 */
export default function UserSignComponent({ show = false, onClose }: { show: boolean; onClose: () => void }) {
  const { mutateAsync: signByPasskey } = useSignByPasskey();
  const { mutateAsync: signByPassword } = useSignByPassword();

  const [viewPasswordMode, setViewPasswordMode] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState('');
  const hideModal = useCallback(async () => {
    onClose();
  }, []);

  const handleTextFieldChange = useCallback((value: string) => {
    setTextFieldValue(value);
  }, []);
  const [passwordFieldMeetError, setPasswordFieldMeetError] = useState(false);

  const [passwordMode, setPasswordMode] = useState(false);
  const [passkeyMode, setPasskeyMode] = useState(false);

  const [passwordChecking, setPasswordChecking] = useState(false);

  useEffect(() => {
    /** Nếu người dùng còn mã này, thì đương nhiên pass qua và nhường cho Server xử lý... */
    let BA = helpers.cookie_get('BA');
    if (BA === '1') {
      setPasskeyMode(true);
      setPasswordMode(false);
    } else {
      setPasswordMode(true);
      setPasskeyMode(false);
    }
  }, [show]);

  const signByPasswordCallback = useCallback(async () => {
    setPasswordChecking(true);
    setPasswordFieldMeetError(false);
    try {
      let data = await signByPassword(textFieldValue);
      helpers.cookie_set('XS', data.ATSL, 0.0833); // lưu lâu lâu chút, vì dù gì cũng là server quyết định ... 5 phút
      hideModal();
    } catch (e) {
      console.log(e, '<<<< WEBAUTHN_ERROR');
      setPasswordFieldMeetError(true);
    } finally {
      setPasswordChecking(false);
    }
  }, [signByPassword, textFieldValue, hideModal]);

  const startAskForPasskey = useCallback(async () => {
    try {
      navigator.credentials
        .get({
          publicKey: {
            allowCredentials: [],
            userVerification: 'required',
            challenge: new Uint8Array([139, 66, 181, 87, 7, 203]),
          },
          mediation: 'silent',
        })
        .then((credential: any) => {
          // SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MdAAAAAA
          const authDataStr = bufferToBase64URLString(credential.response.authenticatorData);
          signByPasskey(authDataStr)
            .then(async (data) => {
              helpers.cookie_set('XS', data.ATSL, 0.00139);
              await helpers.sleep(1000);
              hideModal();
            })
            .catch((e) => {});
        })
        .catch((e) => {
          console.log(e, 'WEBAUTHN_ERROR <<<<');
        });
    } catch (e) {
    } finally {
    }
  }, [hideModal]);

  return (
    <>
      <Modal
        activator={null}
        open={show}
        onClose={hideModal}
        title={__('you_must_signed_before_process')}
        primaryAction={{
          content: __('close'),
          onAction: hideModal,
        }}
      >
        <Modal.Section>
          {passkeyMode && (
            <>
              <DropZone onClick={startAskForPasskey} variableHeight>
                <BlockStack gap="200">
                  <br />
                  <InlineStack align="center" blockAlign="center">
                    <img alt="Face ID or Touch ID" src={face_id_icon} width="50px" height="50px" />
                    <Text as="p">Sử dụng Passkey</Text>
                  </InlineStack>
                  <br />
                </BlockStack>
              </DropZone>

              <BlockStack gap="400">
                <br />
                <Text as="p" tone="subdued">
                  Bạn gặp vấn đề với Passkey? Chuyển sang{' '}
                  <Link
                    monochrome
                    onClick={() => {
                      setPasswordMode(true);
                      setPasskeyMode(false);
                    }}
                  >
                    sử dụng mật khẩu
                  </Link>
                  .
                </Text>
              </BlockStack>
            </>
          )}

          {passwordMode && (
            <>
              <Form onSubmit={signByPasswordCallback}>
                <BlockStack gap="400">
                  <br />
                  <TextField
                    label={__('login_by_your_password')}
                    placeholder="******"
                    error={passwordFieldMeetError}
                    focused={passwordFieldMeetError}
                    type={viewPasswordMode ? 'text' : 'password'}
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
                    value={textFieldValue}
                    onChange={handleTextFieldChange}
                    monospaced
                  />
                  <Button onClick={signByPasswordCallback} loading={passwordChecking}>
                    Xác thực
                  </Button>
                </BlockStack>
              </Form>
              <BlockStack gap="400">
                <br />
                <Text as="p" tone="subdued">
                  Để an toàn hơn, sử dụng{' '}
                  <Link
                    monochrome
                    onClick={() => {
                      setPasswordMode(false);
                      setPasskeyMode(true);
                    }}
                  >
                    Passkey
                  </Link>
                  .
                </Text>
              </BlockStack>
            </>
          )}

          <br />
          <TextContainer>
            <Tooltip content="Chức năng này yêu cầu bảo mật nâng cao để bảo vệ chính bạn.">
              <Button tone="critical" icon={QuestionCircleIcon}></Button>
            </Tooltip>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </>
  );
}
