import { BlockStack, Box, Button, Icon, InlineStack, Link, Modal, Text, TextField } from '@shopify/polaris';
import { useAuth } from 'AuthContext';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import verify_phonenumber_background from 'media/lottie_files/verify_phonenumber_background.json';
import Lottie from 'lottie-react';
import { PhoneIcon, EmailIcon } from '@shopify/polaris-icons';
import { useActiveAccount, useGetActiveCode } from 'queries/user.query';
import helpers from 'helpers/index';
export default function ActiveMyAccount({ show = false }) {
  const { user } = useAuth();
  const [modalShow, setModalShow] = useState(false);

  const { mutateAsync: getActiveCode, isSuccess } = useGetActiveCode();
  const { mutateAsync: activeMyAccountFetch, isSuccess: successActived, isError: activeAccountError } = useActiveAccount();

  useEffect(() => {
    if (show) setModalShow(true);
  }, [show]);

  useEffect(() => {
    if (successActived) setModalShow(false);
  }, [successActived]);

  const [inputRef, setInputRef] = useState('');
  const currentValue = useRef(null);
  const [inputMode, setInputMode] = useState('');

  const verifiedPhonenumber = useCallback((phonenumber: string) => {
    getActiveCode({
      user_email: undefined,
      user_phonenumber: phonenumber,
    })
      .then((response) => {
        setInputMode('user_phonenumber');
        currentValue.current = phonenumber;
      })
      .catch((e) => {});
  }, []);

  const verifiedEmail = useCallback((user_email: string) => {
    getActiveCode({
      user_email: user_email,
      user_phonenumber: undefined,
    })
      .then((response) => {
        setInputMode('user_email');
        currentValue.current = user_email;
      })
      .catch((e) => {});
  }, []);

  const pleaseActiveMyAccount = useCallback(() => {
    activeMyAccountFetch({
      code: inputRef,
      user_email: helpers.isEmail(currentValue.current) ? currentValue.current : undefined,
      user_phonenumber: helpers.isPhoneNumber(currentValue.current) ? currentValue.current : undefined,
    })
      .then((response) => {})
      .catch((e) => {});
  }, [inputRef, currentValue]);

  return (
    <Modal open={modalShow} title={'Xác minh tài khoản'} onClose={() => {}}>
      <Modal.Section>
        <InlineStack gap="500" align="center">
          <Text as="p" alignment="center">
            Xác minh tài khoản và nhận nhiều ưu đãi.
          </Text>
          <Box width="400px">
            <Lottie animationData={verify_phonenumber_background} loop={false} />
          </Box>
        </InlineStack>
        <BlockStack gap="500" inlineAlign="center">
          {!inputMode && (
            <>
              {user?.user_phonenumber && user?.user_verified_phone === 0 && (
                <Link removeUnderline onClick={() => verifiedPhonenumber(user?.user_phonenumber)}>
                  <InlineStack align="space-between" blockAlign="center">
                    <Icon source={PhoneIcon} />
                    <Text as="p">Click để xác minh {user?.user_phonenumber}</Text>
                  </InlineStack>
                </Link>
              )}
              {user?.user_email && user?.user_verified_email === 0 && (
                <Link removeUnderline onClick={() => verifiedEmail(user?.user_email)}>
                  <InlineStack align="space-between" blockAlign="center">
                    <Icon source={EmailIcon} />
                    <Text as="p">Click để xác minh {user?.user_email}</Text>
                  </InlineStack>
                </Link>
              )}
            </>
          )}

          {isSuccess && (
            <TextField
              error={activeAccountError}
              autoFocus
              value={inputRef}
              onChange={(t) => setInputRef(t)}
              suffix={
                <Button disabled={!inputRef} onClick={pleaseActiveMyAccount} variant="plain">
                  Xác minh
                </Button>
              }
              autoComplete="off"
              label={inputMode === 'user_email' ? `Kiểm tra hòm thư ${currentValue.current}` : `Kiểm tra tin nhắn tới ${currentValue.current}`}
              helpText={'Đợi trong vòng 1 phút, bạn sẽ nhận được mã xác minh, hãy điền vào đây và bấm xác minh.'}
            />
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
