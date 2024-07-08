import {
  Card,
  Text,
  InlineGrid,
  Button,
  Page,
  BlockStack,
  LegacyCard,
  InlineStack,
  CalloutCard,
  ExceptionList,
  SkeletonDisplayText,
} from '@shopify/polaris';
import { GiftCardFilledIcon, EmailIcon, LocationIcon, PhoneIcon, EditIcon } from '@shopify/polaris-icons';

import { useState, useCallback, useEffect, useRef } from 'react';
import 'media/css/user_profile.scss';
import dateandtime from 'date-and-time';
import { Helmet } from 'react-helmet-async';
import { useAuth } from 'AuthContext';
import UserProfileLoading from 'components/userProfileLoading';
import { useNavigate } from 'react-router-dom';
import helpers from 'helpers/index';
import StarRating from 'components/starRating';
import UserAchievement from 'components/user_achivement';
import MyOrder from './components/myOrders';
import UserReferrerComponent from './components/user_referrer_component';
import { useGetEntity } from 'queries/user.query';
import UserWalletCard from './components/user_wallet_card';
import UserProfileHeader from './components/UserProfileHeader';

/************************************************************ *
 * MAINN
 * Private route
 ************************************************************ */

export default function MyProfile() {
  const { user: currentUserData } = useAuth();
  const { mutate: getEntity, data: profileData, isPending } = useGetEntity();

  const history = useNavigate();

  /** Nếu load theo profile người dùng thì thực hiện nó ở đây */
  useEffect(() => {
    getEntity(currentUserData.user_id);
  }, [currentUserData]);

  const fullAddress = useRef('Chưa có thông tin');
  const getFullAddress = useCallback(async (profileData) => {
    try {
      if (!profileData?.user_address) return;

      let ward = await helpers.getDiaChinh(profileData?.user_address_ward);
      let distric = await helpers.getDiaChinh(profileData?.user_address_district);
      let city = await helpers.getDiaChinh(profileData?.user_address_city);

      let fullAddressArray = [profileData?.user_address, ward?.name ?? undefined, distric?.name ?? undefined, city?.name ?? undefined];
      fullAddressArray = helpers.filterEmptyArray(fullAddressArray);

      fullAddress.current = fullAddressArray.join(', ');
    } catch (e) {}
  }, []);

  useEffect(() => {
    getFullAddress(profileData);
  }, [profileData]);

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>Trang chủ</title>
      </Helmet>
      <Page>
        <UserProfileHeader />
        <br />
        <br />
        <UserWalletCard />
        <br />
        <br />
        <UserReferrerComponent />
        <br />
        <br />
        {profileData && (
          <InlineGrid columns={{ xs: '1', sm: '1', md: '1', lg: ['oneThird', 'twoThirds'] }} gap="400">
            <div>
              {isPending ? (
                <UserProfileLoading />
              ) : (
                <LegacyCard title="Thông tin" actions={[{ content: 'Chỉnh sửa', onAction: () => history('/edit-my-profile') }]}>
                  <LegacyCard.Section>
                    <br />
                    <BlockStack gap={'200'}>
                      <ExceptionList
                        items={[
                          {
                            icon: EmailIcon,
                            description: profileData?.user_email ?? '-',
                          },
                          {
                            icon: PhoneIcon,
                            description: profileData?.user_phonenumber ?? '-',
                          },
                          {
                            icon: LocationIcon,
                            description: profileData?.user_address ? fullAddress.current : '-',
                          },
                        ]}
                      />
                    </BlockStack>
                  </LegacyCard.Section>

                  <LegacyCard.Section subdued title="">
                    <Text as="p" variant="bodyMd">
                      Tham gia từ {dateandtime.format(new Date(Number(profileData?.createdAt)), 'DD/MM/YYYY')}
                    </Text>
                    {profileData?.user_rate > 0 ? (
                      <div>
                        <StarRating num={profileData?.user_rate} />
                        <Text as="span" tone="subdued">{`${profileData?.user_rate_count} đánh giá`}</Text>
                      </div>
                    ) : null}
                  </LegacyCard.Section>
                </LegacyCard>
              )}
              <br />
              <UserAchievement user_id={profileData?.user_id} />
            </div>

            <div>
              {(!currentUserData.user_address || !currentUserData.user_birthday || !currentUserData.user_avatar) && (
                <CalloutCard
                  title="Bạn chưa cập nhật thông tin"
                  illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                  primaryAction={{
                    content: 'Chỉnh sửa profile',
                    url: '/edit-my-profile',
                  }}
                >
                  <p>Điền đầy đủ thông tin và nhận về những phần quà đầu tiên.</p>
                </CalloutCard>
              )}
              <MyOrder />
            </div>
          </InlineGrid>
        )}
      </Page>
    </>
  );
}
