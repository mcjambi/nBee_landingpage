import React from 'react';
import { BlockStack, Box, Button, Card, InlineGrid, InlineStack, Text } from '@shopify/polaris';
import { ExportIcon } from '@shopify/polaris-icons';
import BankCard from 'components/bankCard';
import user_wallet_background from 'media/lottie_files/user_wallet_background.json';
import Lottie from 'lottie-react';

export default function UserWalletCard() {
  return (
    <div id="user_wallet_card_profile">
      <Box padding="400" background="bg-fill-active">
        <InlineGrid gap={'400'} alignItems="center" columns={{ xs: '', md: 2, lg: 2 }}>
          <InlineGrid alignItems="center" columns={['oneThird', 'twoThirds']}>
            <Lottie
              className="user_wallet_background_animation"
              style={{ width: '70px', height: '70px' }}
              animationData={user_wallet_background}
              loop={false}
            />
            <div>
              <Text as="p">Tài khoản chính</Text>
              <Text as="h3" variant="heading2xl">
                120.000 vnd
              </Text>
            </div>
          </InlineGrid>
          <InlineStack align="start" blockAlign="center" gap={'400'}>
            <div>
              <Text as="p">Kim cương</Text>
              <Text as="h3" variant="headingLg" tone="subdued">
                45
              </Text>
            </div>
            <div>
              <Text as="p">Điểm</Text>
              <Text as="h3" variant="headingLg" tone="subdued">
                23.150
              </Text>
            </div>
          </InlineStack>
        </InlineGrid>
      </Box>
    </div>
  );
}
