import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text, BlockStack, Icon, InlineStack, Tooltip, Box } from '@shopify/polaris';
import QuickUploadImage from 'components/oneclick-upload-image';
import { StatusActiveIcon } from '@shopify/polaris-icons';
import default_avatar from 'media/images/user-default.svg';
import __ from 'languages/index';
import { useAuth } from 'AuthContext';
import { useUpdateProfile } from 'queries/user.query';
import __helpers from 'helpers/index';

export default function UserProfileHeader() {
  const { user: profileData } = useAuth();

  const { mutateAsync: updateProfile } = useUpdateProfile();

  const [srcImageAvatar, setSrcImageAvatar] = useState('');

  useEffect(() => {
    setSrcImageAvatar(profileData?.user_avatar);
  }, [profileData]);

  const handQuickUpdateSuccess = useCallback((res: any) => {
    setSrcImageAvatar(res.media_url);
    updateProfile({
      user_id: profileData?.user_id,
      user_avatar: res.media_url,
    });
  }, []);

  const ProfileHeaderData = () => {
    return (
      <Box id="profile_header">
        <BlockStack gap="100" align="center" inlineAlign="center">
          <div className="profile_background">&nbsp;</div>
          <div className="profile_header">
            <QuickUploadImage onSuccess={handQuickUpdateSuccess} onError={() => {}}>
              <img
                src={srcImageAvatar ? __helpers.getMediaLink(srcImageAvatar) : default_avatar}
                crossOrigin="anonymous"
                alt="User Profile"
                style={{ width: '115px' }}
              />
            </QuickUploadImage>
          </div>
          <InlineStack align="center" blockAlign="center" gap="200">
            {profileData?.user_verified_profile === 1 && (
              <Tooltip content="Tài khoản đã được xác minh">
                <Icon source={StatusActiveIcon} />
              </Tooltip>
            )}
            <Text as="p" variant="headingLg">
              {profileData?.display_name ? profileData?.display_name : profileData?.user_email}{' '}
              {`(${profileData?.user_title ?? profileData?.user_role})`}
            </Text>
          </InlineStack>
        </BlockStack>
      </Box>
    );
  };

  return <ProfileHeaderData />;
}
