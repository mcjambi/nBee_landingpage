import { Text, InlineGrid, Page, BlockStack, LegacyCard, CalloutCard, ExceptionList, Grid, Box, InlineStack, Icon, Divider } from '@shopify/polaris';
import { GiftCardFilledIcon, EmailIcon, LocationIcon, PhoneIcon, EditIcon, ClockIcon } from '@shopify/polaris-icons';

import { useState, useCallback, useEffect, useRef } from 'react';
import 'media/css/user_profile.scss';
import dateandtime from 'date-and-time';
import { Helmet } from 'react-helmet-async';
import { useAuth } from 'AuthContext';
import UserProfileLoading from 'components/userProfileLoading';
import helpers from 'helpers/index';
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

  /** Nếu load theo profile người dùng thì thực hiện nó ở đây */
  useEffect(() => {
    getEntity(currentUserData.user_id);
  }, [currentUserData]);

  const [fullAddress, setFullAddress] = useState('Chưa có thông tin');
  const getFullAddress = useCallback(async () => {
    try {
      if (!profileData?.user_address) return;

      let ward = await helpers.getDiaChinh(profileData?.user_address_ward);
      let distric = await helpers.getDiaChinh(profileData?.user_address_district);
      let city = await helpers.getDiaChinh(profileData?.user_address_city);

      let fullAddressArray = [profileData?.user_address, ward?.name ?? undefined, distric?.name ?? undefined, city?.name ?? undefined];
      fullAddressArray = helpers.filterEmptyArray(fullAddressArray);

      setFullAddress(fullAddressArray.join(', '));
    } catch (e) {}
  }, [profileData]);

  useEffect(() => {
    getFullAddress();
  }, [profileData]);

  const MySumary = useCallback(() => {
    return (
      <Box padding="400" background="bg-fill" borderRadius="400" borderColor="border" borderWidth="025">
        <Text as="h3" tone="subdued" variant="headingMd">
          Thông tin liên hệ
        </Text>
        <br />
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
              description: fullAddress,
            },
            {
              icon: ClockIcon,
              description: (
                <Text as="p" variant="bodyMd">
                  Tham gia từ {dateandtime.format(new Date(Number(profileData?.createdAt)), 'DD/MM/YYYY')}
                </Text>
              ),
            },
          ]}
        />
      </Box>
    );
  }, [fullAddress, profileData]);

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>Trang cá nhân</title>
      </Helmet>
      <UserProfileHeader />

      <Page>
        <UserWalletCard />
        <br />

        <InlineGrid columns={{ xs: 1, sm: 1, md: ['oneThird', 'twoThirds'] }} gap="400">
          <Box id="profile_cot_a">
            {isPending ? <UserProfileLoading /> : <MySumary />}
            <br />
            <Divider />
            <br />
            <UserAchievement user_id={profileData?.user_id} />
            <br />
            <Divider />
            <br />
            <UserReferrerComponent />
          </Box>
          <Box id="profile_cot_b">
            {profileData && (
              <BlockStack gap="400">
                {!currentUserData.user_address || !currentUserData.user_birthday || !currentUserData.user_avatar ? (
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
                ) : null}
                <MyOrder />
              </BlockStack>
            )}
          </Box>
          {/** END profile cot b */}
        </InlineGrid>

        <br />
        <br />
        <br />
      </Page>
    </>
  );
}
