import React, { useEffect, useState } from 'react';
import { InlineStack, SkeletonThumbnail, Text } from '@shopify/polaris';
import crownICON from 'media/images/crown.svg';

// import { getEntities as getAchievement, createEntity as createAchievement, getAssignee, reset } from 'store/achievement.store.reducer';
import { useGetAssignee } from 'queries/user_archivement.query';

export default function UserAchievement({ user_id }: { user_id: bigint | string; showList?: boolean }) {
  const {
    data,
    error,
    refetch: loadData,
    isLoading,
  } = useGetAssignee({
    user_id: user_id,
    limit: 20,
  });

  const [userAchievementList, setUserAchievementList] = useState([]);
  const [userAchievementListCount, setUserAchievementListCount] = useState(0);

  useEffect(() => {
    if (data) {
      let { body, totalItems } = data;
      setUserAchievementList(body);
      setUserAchievementListCount(totalItems);
    }
  }, [data]);

  useEffect(() => {
    loadData();
  }, [user_id]);

  return (
    <>
      <br />
      {isLoading && (
        <InlineStack gap="200">
          <SkeletonThumbnail size="small" />
          <SkeletonThumbnail size="small" />
          <SkeletonThumbnail size="small" />
        </InlineStack>
      )}
      {userAchievementListCount > 0 ? (
        <>
          <Text as="h3" variant="headingMd">
            {userAchievementListCount} thành tích đã đạt được
          </Text>

          <div className="user_achievement">
            {userAchievementList?.map((achivement, index) => {
              if (index > 6) return;
              const { achievement_badge, achievement_name } = achivement?.achievement;
              let i = achievement_badge ? process.env.REACT_APP_AJAX_UPLOAD_PERMALINK + achievement_badge : crownICON;
              return (
                <div key={'dsfg_' + index} className={`badge  orange user_achivement_element`}>
                  <div className="circle">
                    <img alt="" src={i} width="100%" height="100%" />
                  </div>
                  <div className="ribbon">{achievement_name}</div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <Text as="p">Chưa có thành tựu nào!</Text>
      )}

      <br />
    </>
  );
}
