import { Card, SkeletonBodyText, InlineGrid, Button } from '@shopify/polaris';

import { useState, useCallback, useEffect, useMemo, Suspense, lazy } from 'react';
import './media/user_profile.scss';

import ProfileHeader from './profile-header';
import { Helmet } from 'react-helmet-async';
import { useAuth } from 'AuthContext';
import { TypedUser, useGetEntity } from 'queries/user.query';
import axios from 'axios';

/************************************************************ *
 * MAINN
 * Private route
 ************************************************************ */

export default function MyProfile() {
  const { user: currentUserData } = useAuth();
  const { mutateAsync } = useGetEntity();

  const UserAchievement = lazy(() => import('components/user_achivement'));

  const [profileData, setProfileData] = useState<TypedUser | null>(null);

  const loadData = useCallback(async () => {
    let entity = await mutateAsync(currentUserData?.user_id);
    if (entity) {
      setProfileData(entity);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const test412 = useCallback(() => {
    axios.get('login/sign_test').catch(() => {});
  }, []);

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>My Profile</title>
      </Helmet>

      {profileData && (
        <div id="staff-profile">
          <ProfileHeader current_user_id={currentUserData?.user_id} />

          <div id="profile_body" style={{ padding: '1.5rem' }}>
            <InlineGrid columns={{ xs: '1', sm: '1', md: '1', lg: ['oneThird', 'twoThirds'] }} gap="400">
              <div>
                <Suspense>
                  <UserAchievement user_id={profileData?.user_id} />
                </Suspense>
              </div>

              <div>
                Chafo cacs banj, <Button onClick={test412}>Tesst</Button>
                Chafo cacs banj
              </div>
            </InlineGrid>
          </div>
          {/** profile_body */}
        </div>
      )}
    </>
  );
}
