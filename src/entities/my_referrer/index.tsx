import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  BlockStack,
  Box,
  Card,
  DescriptionList,
  Divider,
  EmptyState,
  ExceptionList,
  Image,
  IndexTable,
  InlineGrid,
  InlineStack,
  Link,
  Modal,
  Page,
  SkeletonDisplayText,
  Text,
  TextField,
  Thumbnail,
} from '@shopify/polaris';
import { Helmet } from 'react-helmet-async';
import { TypedMyReferrers, useCountReferrer, useMyRecentReferrers, useMyReferrers } from 'queries/user_referrer.query';
import __helpers from 'helpers/index';
import { QuestionCircleIcon, NoteIcon } from '@shopify/polaris-icons';
import __ from 'languages/index';
import { useAuth } from 'AuthContext';
import { useNavigate } from 'react-router-dom';

import dateandtime from 'date-and-time';
import MyReferrers from './list';

export default function MyReferrer() {
  const history = useNavigate();
  const { user: currentUserData } = useAuth();
  const { mutateAsync: getCountReferrer, isPending, data } = useCountReferrer();
  const { refetch: getMyRecentReferrers, isFetching: loadingMyRecentReferrer, data: myRecentReferrerData } = useMyRecentReferrers();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getCountReferrer();
    getMyRecentReferrers();
  }, []);

  const GuideModal = useCallback(() => {
    return (
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
    );
  }, [showModal]);

  const EmptyTemplate = useCallback(() => {
    return (
      <EmptyState heading="Bạn chưa mời ai?" image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png">
        <p>Tạo thu nhập thụ động, phần thưởng, vé du lịch và rất nhiều nguồn lợi từ việc giới thiệu thêm người.</p>
      </EmptyState>
    );
  }, []);

  const BodyHasData = useCallback(() => {
    return (
      <>
        <Box background="bg-fill">
          <Box padding={'400'}>
            <BlockStack gap={'400'}>
              <Text as="h2" variant="heading2xl">
                {currentUserData.display_name}
              </Text>
              <Text as="p" tone="subdued">
                Đây là tóm tắt những người bạn giới thiệu được.
              </Text>
              <InlineGrid gap={'200'} columns={{ xs: 1, md: 4 }}>
                <BlockStack gap="200">
                  <Text as="p">Trực tiếp</Text>
                  <div>
                    <Text as="p" variant="headingLg" tone="subdued">
                      {isPending ? <SkeletonDisplayText /> : __helpers.formatNumber(data?.level1 ?? 0)}
                    </Text>
                  </div>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="p">Cấp 2</Text>
                  <div>
                    <Text as="p" variant="headingLg" tone="subdued">
                      {isPending ? <SkeletonDisplayText /> : __helpers.formatNumber(data?.level2 ?? 0)}
                    </Text>
                  </div>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="p">Cấp 3</Text>
                  <div>
                    <Text as="p" variant="headingLg" tone="subdued">
                      {isPending ? <SkeletonDisplayText /> : __helpers.formatNumber(data?.level3 ?? 0)}
                    </Text>
                  </div>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="p">Cấp 4</Text>
                  <div>
                    <Text as="p" variant="headingLg" tone="subdued">
                      {isPending ? <SkeletonDisplayText /> : __helpers.formatNumber(data?.level4 ?? 0)}
                    </Text>
                  </div>
                </BlockStack>
              </InlineGrid>
            </BlockStack>
          </Box>
          <Box background="bg-fill-active" padding={'400'}>
            <ExceptionList
              items={[
                {
                  icon: NoteIcon,
                  description: (
                    <Text as="p">
                      Mọi thứ đang rất tuyệt, bạn có thể ghé <Link url="/edu">TRUNG TÂM GIÁO DỤC</Link> bất kỳ lúc nào để nhận chia sẻ về cách TĂNG
                      TỐC
                    </Text>
                  ),
                },
              ]}
            />
          </Box>
        </Box>
        <br />
        <br />
        <Box padding="400">
          <Text as="h4" variant="headingMd" tone="base">
            Vừa mới gia nhập
          </Text>
          <br />
          <InlineGrid columns={{ md: 4, xs: 1 }} gap={'100'}>
            {myRecentReferrerData?.body?.map((el, index) => {
              return (
                <InlineStack align="start" blockAlign="center" gap={'200'} key={index + '_latest_referrer'}>
                  <Thumbnail
                    size="small"
                    source={el.user_avatar ? __helpers.getMediaLink(el.user_avatar) : 'https://placehold.co/100x100'}
                    alt={''}
                  />
                  <BlockStack>
                    <Text as="h4" fontWeight="bold" tone="base">
                      {el.display_name}
                    </Text>
                    <Text as="p" tone="subdued" variant="bodyXs">
                      Cấp {el.level} - {__helpers.subtractTimeHistory(el.createdAt)}
                    </Text>
                  </BlockStack>
                </InlineStack>
              );
            })}
          </InlineGrid>
          <br />
          <Divider />
          <br />
          <Text as="h4" variant="headingMd" tone="base">
            Danh sách giới thiệu trực tiếp
          </Text>
          <br />
          <MyReferrers />
        </Box>
      </>
    );
  }, [data]);

  return (
    <>
      <GuideModal />
      <Helmet>
        <title>Giới thiệu nhận hoa hồng</title>
      </Helmet>

      <Page
        title="Giới thiệu nhận hoa hồng"
        primaryAction={{
          content: 'Hướng dẫn',
          icon: QuestionCircleIcon,
          onAction: () => setShowModal(true),
        }}
        backAction={{
          content: 'Back',
          onAction: () => history('/'),
        }}
      >
        {data?.level1 > 0 ? <BodyHasData /> : <EmptyTemplate />}
      </Page>
    </>
  );
}
