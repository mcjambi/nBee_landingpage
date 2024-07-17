import { useAuth } from '../AuthContext';
import { Helmet } from 'react-helmet-async';
import AppFrame from 'layout/appFrame';
import MyProfile from './user-profile/profile';
import FloatingBanner from 'components/floatingBanner';
import { BlockStack, InlineGrid, Link, Thumbnail, Text } from '@shopify/polaris';
import { GiftCardFilledIcon } from '@shopify/polaris-icons';
import { useGetGame } from 'queries/game.query';

export default function Homepage() {
  const { isAuthenticated } = useAuth();

  const {
    data: gameData,
    isLoading: gameLoading,
    isSuccess,
  } = useGetGame({
    limit: 4,
  });

  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <FloatingBanner icon={GiftCardFilledIcon} title={'Thêm vận may của bạn'}>
        <BlockStack gap="400">
          {isSuccess &&
            gameData &&
            gameData.body.map((game) => {
              return (
                <InlineGrid columns={['oneThird', 'twoThirds']} gap="100">
                  <div>
                    <Thumbnail source={game.game_thumbnail} alt={''} />
                  </div>
                  <div>
                    <Link url={'/game/' + game.game_slug} removeUnderline>
                      <Text as="h4" variant="headingMd">
                        {game.game_title}
                      </Text>
                    </Link>
                    <Text as="p" variant="bodyMd">
                      {game.game_excerpt}
                    </Text>
                  </div>
                </InlineGrid>
              );
            })}
        </BlockStack>
      </FloatingBanner>

      <MyProfile />
    </>
  );
}
