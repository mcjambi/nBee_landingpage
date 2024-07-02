import { Card, SkeletonBodyText, InlineGrid } from '@shopify/polaris';

import { useState, useCallback, useEffect, useMemo } from 'react';
import './media/user_profile.scss';

import { useParams } from 'react-router-dom';

import UserAchievement from 'components/user_achivement';
import ProfileHeader from './profile-header';
import { Helmet } from 'react-helmet-async';
import { useAuth } from 'AuthContext';
import { TypedUser, useGetEntity } from 'queries/user.query';

/************************************************************ *
 * MAINN
 * Private route
 ************************************************************ */

export default function MyProfile() {
  const { user: currentUserData } = useAuth();
  const { mutateAsync } = useGetEntity();

  const [profileData, setProfileData] = useState<TypedUser | null>(null);

  /**
   * If user apply filter, it will add to URL, then parse URL back to initial state
   */
  let useParam = {} as any;
  useParam = useParams();
  let Param = useParam.user_id || currentUserData?.user_id;

  const loadData = useCallback(async () => {
    let entity = await mutateAsync(Param);
    if (entity) {
      setProfileData(entity);
    }
  }, [Param]);

  useEffect(() => {
    if (Param) loadData();
  }, [Param]);

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>My Profile</title>
      </Helmet>

      {profileData && (
        <div id="staff-profile">
          <ProfileHeader current_user_id={Param} />

          <div id="profile_body" style={{ padding: '1.5rem' }}>
            <InlineGrid columns={{ xs: '1', sm: '1', md: '1', lg: ['oneThird', 'twoThirds'] }} gap="400">
              <UserAchievement user_id={profileData?.user_id} />
            </InlineGrid>
          </div>
          {/** profile_body */}
        </div>
      )}
    </>
  );
}
