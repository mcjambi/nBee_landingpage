import React, { useEffect } from 'react';
import 'media/css/ranking_by_wallet.scss';
import { Avatar, BlockStack, Box, InlineStack, SkeletonBodyText, Text } from '@shopify/polaris';
import diamond_icon from 'media/lottie_files/diamond-icon.json';
import Lottie from 'lottie-react';
import { useGetWalletRank } from 'queries/user_wallet.query';
import __helpers from 'helpers/index';

export default function RankingByWallet({ wallet_unit = 'cash' }: { wallet_unit: string }) {
  const { mutateAsync: getWalletRank, data: rankData, isPending, isSuccess, isError } = useGetWalletRank();
  useEffect(() => {
    getWalletRank(wallet_unit).catch((e) => {});
  }, [wallet_unit]);

  return (
    <Box id="ranking_by_wallet">
      <Box>
        <Lottie className="ranking_diamond_icon" animationData={diamond_icon} />

        <Text as="h3" variant="headingLg" id="ranking_headline">
          TOP 10 KIM CƯƠNG
        </Text>

        {(__helpers.isEmpty(rankData) || isError) && <div style={{ padding: '15px' }}>Chưa có xếp hạng nào</div>}

        <BlockStack>
          {isPending ? (
            <>
              <SkeletonBodyText />
              <SkeletonBodyText />
            </>
          ) : (
            rankData?.map((element, index) => {
              return (
                <div className={'topwallet_element top' + (index + 1)}>
                  <InlineStack as="div" align="space-between" blockAlign="center">
                    <InlineStack gap="200">
                      <Avatar source={element?.user?.user_avatar} size={index === 0 ? 'xl' : 'sm'} initials="N" />
                      <Text as="span" fontWeight="bold">
                        {element?.user?.display_name}
                      </Text>
                    </InlineStack>
                    <Text as="span">{__helpers.formatNumber(Number(element?.balance ?? 0))}</Text>
                  </InlineStack>
                </div>
              );
            })
          )}
        </BlockStack>
      </Box>
    </Box>
  );
}
