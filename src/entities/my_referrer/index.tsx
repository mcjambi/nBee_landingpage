import React, { useEffect, useState } from 'react';
import { BlockStack, Card, DescriptionList, Divider, InlineGrid, Modal, Page, SkeletonDisplayText, Text, TextField } from '@shopify/polaris';
import { Helmet } from 'react-helmet-async';
import { useCountReferrer } from 'queries/user_referrer.query';
import __helpers from 'helpers/index';
import { QuestionCircleIcon } from '@shopify/polaris-icons';
import __ from 'languages/index';
import { useAuth } from 'AuthContext';
export default function MyReferrer() {
  const { user: currentUserData } = useAuth();
  const { mutateAsync: getCountReferrer, isPending, data } = useCountReferrer();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getCountReferrer();
  }, []);

  return (
    <>
      <Modal
        title="Mã giới thiệu của bạn"
        open={showModal}
        onClose={() => setShowModal(false)}
        primaryAction={{
          content: __('close_button_label'),
          onAction: () => setShowModal(false),
        }}
      >
        <Modal.Section>
          <Text as="p">Bạn có thể dùng Email của bạn, số điện thoại hoặc mã tự sinh để làm mã giới thiệu cho khách hàng / đối tác của bạn.</Text>
          <DescriptionList
            items={[
              {
                term: 'Email',
                description: currentUserData?.user_email ?? 'Bạn chưa có email.',
              },
              {
                term: 'Số điện thoại',
                description: currentUserData?.user_phonenumber ?? 'Bạn chưa có số điện thoại',
              },
              {
                term: 'Mã riêng của bạn',
                description: currentUserData?.referrer_code,
              },
            ]}
          />
          <BlockStack gap="200">
            <Divider />
            <Text as="p">
              Có hai cách để điền mã giới thiệu của bạn, đưa một trong các mã bên trên cho người đăng ký và họ điền vào khi đến bước yêu cầu mã đăng
              ký, hoặc:
            </Text>
            <Text as="p">
              Sử dụng đường link chia sẻ, bạn có thể cho mã giới thiệu vào cuối đường dẫn và cho người dùng click vào khi đăng ký. Sau đây là một link
              của bạn.
            </Text>

            <TextField
              label=""
              autoComplete="off"
              value={process.env.REACT_APP_PUBLIC_URL + '/register?ref=' + currentUserData?.referrer_code ?? currentUserData?.user_phonenumber}
              selectTextOnFocus
            />
            <Text as="p">
              <code>{'?ref=' + currentUserData?.referrer_code ?? currentUserData?.user_phonenumber}</code> chính là mã của bạn.
            </Text>
          </BlockStack>
        </Modal.Section>
      </Modal>

      <Page
        fullWidth
        title="Dữ liệu giới thiệu của bạn"
        primaryAction={{
          content: 'Hướng dẫn',
          icon: QuestionCircleIcon,
          onAction: () => setShowModal(true),
        }}
      >
        <Helmet>
          <title>Giới thiệu nhận hoa hồng</title>
        </Helmet>

        <InlineGrid gap={'200'} columns={{ xs: 1, md: 4 }}>
          <Card>
            <BlockStack gap="200">
              <Text as="p">Trực tiếp</Text>
              <Divider />
              <div>
                <Text as="p" variant="headingLg" tone="subdued">
                  {isPending ? <SkeletonDisplayText /> : __helpers.formatNumber(data?.level1 ?? 0)}
                </Text>
                <Text as="p">Tài khoản</Text>
              </div>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="200">
              <Text as="p">Cấp 2</Text>
              <Divider />
              <div>
                <Text as="p" variant="headingLg" tone="subdued">
                  {isPending ? <SkeletonDisplayText /> : __helpers.formatNumber(data?.level2 ?? 0)}
                </Text>
                <Text as="p">Tài khoản</Text>
              </div>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="200">
              <Text as="p">Cấp 3</Text>
              <Divider />
              <div>
                <Text as="p" variant="headingLg" tone="subdued">
                  {isPending ? <SkeletonDisplayText /> : __helpers.formatNumber(data?.level3 ?? 0)}
                </Text>
                <Text as="p">Tài khoản</Text>
              </div>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="200">
              <Text as="p">Cấp 4</Text>
              <Divider />
              <div>
                <Text as="p" variant="headingLg" tone="subdued">
                  {isPending ? <SkeletonDisplayText /> : __helpers.formatNumber(data?.level4 ?? 0)}
                </Text>
                <Text as="p">Tài khoản</Text>
              </div>
            </BlockStack>
          </Card>
        </InlineGrid>
      </Page>
    </>
  );
}
