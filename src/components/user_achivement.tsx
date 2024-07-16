import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BlockStack, Box, Card, EmptyState, ExceptionList, InlineGrid, InlineStack, Link, Modal, SkeletonThumbnail, Text } from '@shopify/polaris';
import crownICON from 'media/images/crown.svg';
import 'media/css/achievement.scss';
import Lottie from 'lottie-react';
import achievement_background from 'media/lottie_files/achievement_background.json';
import achievement_congratulation_modal from 'media/lottie_files/achievement_congratulation_modal.json';
import { MagicIcon } from '@shopify/polaris-icons';
import { useGetAssignee, useGetFirstAchivement } from 'queries/user_archivement.query';
import __helpers from 'helpers/index';
import Parser from 'html-react-parser';

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

  const { mutateAsync: getFirstAchivement, isPending } = useGetFirstAchivement();

  const getMyFistAchievement = useCallback(async () => {
    try {
      await getFirstAchivement();
    } catch (e) {}
  }, []);

  const [userAchievementList, setUserAchievementList] = useState([]);
  const [userAchievementListCount, setUserAchievementListCount] = useState(0);

  useEffect(() => {
    if (data) {
      let { body, totalItems } = data;
      setUserAchievementList(body);
      setUserAchievementListCount(totalItems);
    }
  }, [data]);

  const [popup, setPopup] = useState(false);
  const currentActiveAchievement = useRef(null);
  const getAchievementDetail = useCallback((achievement_data: any) => {
    setPopup(true);
    currentActiveAchievement.current = achievement_data;
  }, []);

  return (
    <div id="user_achievement">
      <Modal title="" titleHidden open={popup} onClose={() => setPopup(null)}>
        <Modal.Section>
          <BlockStack gap="200">
            <InlineGrid columns={['twoThirds', 'oneThird']} alignItems="center">
              <div>
                <Text as="h3" tone="subdued" variant="heading2xl">
                  {currentActiveAchievement?.current?.achievement?.achievement_name || ''}
                </Text>
                <Text as="p" tone="subdued" variant="bodyMd">
                  {Parser(currentActiveAchievement?.current?.achievement?.achievement_description || ' ')}
                </Text>
              </div>
              <InlineStack align="center">
                {currentActiveAchievement?.current?.achievement?.achievement_badge ? (
                  <img
                    alt=""
                    className="achievement_badge_inModal"
                    src={__helpers.getMediaLink(currentActiveAchievement?.current?.achievement?.achievement_badge, 'https://placehold.co/600x400')}
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <Lottie className="achievement_badge_inModal" animationData={achievement_congratulation_modal} loop={false} />
                )}
              </InlineStack>
            </InlineGrid>

            <Text as="p" tone="disabled" variant="bodyXs">
              * Mỗi một huy chương đều có một giá trị nhất định, có thể dùng để quy đổi thành quà tặng hoặc các chương trình khuyến mại.
            </Text>
          </BlockStack>
        </Modal.Section>
        <Modal.Section>
          <ExceptionList
            items={[
              {
                icon: MagicIcon,
                description: `Chúc mừng, bạn đã đạt được nó ${__helpers.subtractTimeHistory(currentActiveAchievement?.current?.createdAt)}`,
              },
            ]}
          />
        </Modal.Section>
      </Modal>

      {(isLoading || isPending) && (
        <BlockStack gap="400">
          <Text as="h3" variant="headingMd">
            Bảng thành tích
          </Text>

          <InlineStack gap="200">
            <SkeletonThumbnail size="medium" />
            <SkeletonThumbnail size="medium" />
            <SkeletonThumbnail size="medium" />
            <SkeletonThumbnail size="medium" />
            <SkeletonThumbnail size="medium" />
          </InlineStack>
        </BlockStack>
      )}

      {userAchievementListCount < 1 && (
        <Card>
          <BlockStack gap="400">
            <InlineGrid columns={['twoThirds', 'oneThird']} alignItems="center">
              <BlockStack gap="200">
                <Text as="h3" tone="subdued" variant="headingMd">
                  Chưa có huy chương?
                </Text>
                <Text as="p" tone="subdued" variant="bodySm">
                  Đừng lo, chúng tôi ghi nhận mọi đóng góp của bạn, và trao thưởng rất kịp thời.
                </Text>
              </BlockStack>
              <Lottie animationData={achievement_background} loop />
            </InlineGrid>
          </BlockStack>
          <Link onClick={getMyFistAchievement}>Click vào đây</Link> để nhận một huy chương đầu tiên.
        </Card>
      )}
      {userAchievementListCount > 0 && (
        <Box padding="400">
          <Text as="h3" tone="subdued" variant="headingMd">
            Bạn có {userAchievementListCount} huy chương!
          </Text>

          <div className="user_achievement">
            {userAchievementList?.map((achievement, index) => {
              if (index > 6) return;
              const { achievement_badge, achievement_name } = achievement?.achievement;
              let i = achievement_badge ? __helpers.getMediaLink(achievement_badge) : crownICON;
              return (
                <div
                  key={'achievement_index_' + index}
                  className={`badge  orange user_achievement_element clickable`}
                  onClick={() => getAchievementDetail(achievement)}
                >
                  <div className="circle">
                    <img alt="" src={i} width="100%" height="100%" />
                  </div>
                  <div className="ribbon">{achievement_name}</div>
                </div>
              );
            })}
          </div>
        </Box>
      )}
    </div>
  );
}
