import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

import { Button, Text, Toast, BlockStack, InlineStack, Badge } from '@shopify/polaris';

import { GiftCardFilledIcon, EmailIcon, LocationIcon, PhoneIcon, EditIcon } from '@shopify/polaris-icons';

import dateandtime from 'date-and-time';
import QuickUploadImage from 'components/oneclick-upload-image';

import default_avatar from 'media/images/user-default.svg';
import helpers from '../../helpers';
import StarRating from 'components/starRating';
import __ from 'languages/index';
import { useAuth } from 'AuthContext';
import { TypedUser, useGetEntity, useUpdateProfile } from 'queries/user.query';

export default function ProfileHeader({ current_user_id }: { current_user_id: string }) {
  const { user: currentUserData } = useAuth();

  const { mutateAsync } = useGetEntity();

  const { mutateAsync: updateProfile, isSuccess: updateProfileSuccess } = useUpdateProfile();

  const [profileData, setProfileData] = useState<TypedUser>(null);

  const fetchUsers = useCallback(async (user_id: string) => {
    let data = await mutateAsync(user_id);
    setProfileData(data);
  }, []);

  const getMainQueryDebound = useMemo(() => helpers.debounce((_value) => fetchUsers?.call(this, _value), 1000), []);
  useEffect(() => {
    if (current_user_id) getMainQueryDebound(current_user_id);
  }, [current_user_id]);

  const [internalErrorNotice, setInternalErrorNotice] = useState('');
  const [srcImageAvatar, setSrcImageAvatar] = useState(default_avatar);

  useEffect(() => {
    setSrcImageAvatar(profileData?.user_avatar ?? default_avatar);
  }, [profileData]);

  const handQuickUpdateSuccess = useCallback((res: any) => {
    setSrcImageAvatar(process.env.REACT_APP_BACKEND_URL + '/media/download/' + res.media_filename);
    updateProfile({
      user_id: profileData?.user_id,
      user_avatar: `${process.env.REACT_APP_BACKEND_URL}/media/download/${res.media_filename}`,
    });
  }, []);

  const handUploadError = useCallback((err: any) => {
    setInternalErrorNotice(err);
  }, []);

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

  return current_user_id ? (
    <>
      {internalErrorNotice ? <Toast content={internalErrorNotice} error onDismiss={() => setInternalErrorNotice('')} /> : null}
      <div id="profile_heading">
        <div className="profile_inner">
          <InlineStack gap="200" blockAlign="start" align="start">
            <div className="profile-avatar">
              <QuickUploadImage onSuccess={handQuickUpdateSuccess} onError={handUploadError}>
                <img src={srcImageAvatar} crossOrigin="anonymous" alt="User Profile" style={{ width: '115px' }} />
              </QuickUploadImage>
            </div>
            <div className="profile-description">
              <BlockStack gap="200">
                <Text as="h1" variant="headingLg">
                  {profileData?.display_name ? profileData?.display_name : profileData?.user_email}
                </Text>

                <Text as="p">
                  <Badge tone="success">{profileData?.user_role}</Badge>
                </Text>

                {profileData?.bio ? <Text as="p">{profileData.bio}</Text> : null}

                <Text as="p" variant="bodyMd" tone="text-inverse">
                  Tham gia từ ngày {dateandtime.format(new Date(Number(profileData?.createdAt)), 'DD/MM/YYYY HH:mm:ss')}
                </Text>
                {profileData?.user_rate > 0 ? (
                  <div>
                    <StarRating num={profileData?.user_rate} />
                    <Text as="span" tone="subdued">{`${profileData?.user_rate_count} đánh giá`}</Text>
                  </div>
                ) : null}
              </BlockStack>
            </div>
          </InlineStack>
        </div>
        {/** profile_inner // */}

        <br />

        <InlineStack wrap={false} gap={'400'}>
          {profileData?.user_birthday ? (
            <Button textAlign="left" icon={GiftCardFilledIcon} variant="plain">
              {dateandtime.format(new Date(profileData?.user_birthday), 'DD/MM/YYYY') || 'Your birthday'}
            </Button>
          ) : null}

          {profileData?.user_email ? (
            <Button textAlign="left" icon={EmailIcon} variant="plain">
              {profileData?.user_email}
            </Button>
          ) : null}

          {profileData?.user_phonenumber ? (
            <Button textAlign="left" icon={PhoneIcon} variant="plain">
              {profileData?.user_phonenumber}
            </Button>
          ) : null}
        </InlineStack>

        <br />
        {profileData?.user_address ? (
          <Button textAlign="left" icon={LocationIcon} variant="plain">
            {fullAddress.current}
          </Button>
        ) : null}

        {currentUserData?.user_id === profileData?.user_id ? (
          <>
            <br />
            <br />
            <Button icon={EditIcon} variant="plain" url={'/edit-my-profile'}>
              {__('edit_my_profile')}
            </Button>
          </>
        ) : null}
      </div>{' '}
      {/** profile_heading */}
    </>
  ) : null;
}
