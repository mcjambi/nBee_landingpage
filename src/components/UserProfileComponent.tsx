import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text, BlockStack } from '@shopify/polaris';
import QuickUploadImage from 'components/oneclick-upload-image';

import default_avatar from 'media/images/user-default.svg';
import __ from 'languages/index';
import { useAuth } from 'AuthContext';
import { useUpdateProfile } from 'queries/user.query';

export default function UserProfileComponent() {
  const { user: profileData } = useAuth();

  const { mutateAsync: updateProfile } = useUpdateProfile();

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

  const ProfileHeaderData = () => {
    return (
      <div id="profile_header">
        <BlockStack gap="100" align="center" inlineAlign="center">
          <div className="profile_background">&nbsp;</div>
          <div className="profile_header">
            <QuickUploadImage onSuccess={handQuickUpdateSuccess} onError={() => {}}>
              <img src={srcImageAvatar} crossOrigin="anonymous" alt="User Profile" style={{ width: '115px' }} />
            </QuickUploadImage>
          </div>
          <Text as="p" variant="headingLg">
            {profileData?.display_name ? profileData?.display_name : profileData?.user_email} {`(${profileData?.user_role})`}
          </Text>
        </BlockStack>
      </div>
    );
  };

  return <ProfileHeaderData />;
}
