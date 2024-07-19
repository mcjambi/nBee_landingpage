import React from 'react';
import 'media/css/ranking_by_wallet.scss';
import { Avatar, BlockStack, Box, InlineStack, Text } from '@shopify/polaris';
import diamond_icon from 'media/lottie_files/diamond-icon.json';
import Lottie from 'lottie-react';

export default function RankingByWallet() {
  return (
    <Box id="ranking_by_wallet">
      <Box>
        <Lottie className="ranking_diamond_icon" animationData={diamond_icon} />

        <Text as="h3" variant="headingLg" id="ranking_headline">
          TOP 5 KIM CƯƠNG
        </Text>

        <BlockStack>
          {Array(5)
            .fill('a')
            .map((element, index) => {
              return (
                <div className={'topwallet_element top' + (index + 1)}>
                  <InlineStack as="div" align="space-between" blockAlign="center">
                    <InlineStack gap="200">
                      <Avatar size={index === 0 ? 'xl' : 'sm'} initials="N" />
                      <Text as="span" fontWeight="bold">
                        Nguyen Ngoc ANh
                      </Text>
                    </InlineStack>
                    <Text as="span">0300</Text>
                  </InlineStack>
                </div>
              );
            })}
        </BlockStack>
      </Box>
    </Box>
  );
}
