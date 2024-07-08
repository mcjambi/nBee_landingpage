import React, { useEffect, useState } from 'react';
import { BlockStack, Box, InlineGrid, InlineStack, Text, Icon, SkeletonDisplayText, SkeletonThumbnail, Divider, Link } from '@shopify/polaris';
import { WalletIcon } from '@shopify/polaris-icons';
import { TypedWallet, useGetMyWallet } from 'queries/user_wallet.query';
import __helpers from 'helpers/index';
import 'media/css/user_wallet_card.scss';

export default function UserWalletCard() {
  const { refetch: getAllMyWallet, data, isLoading } = useGetMyWallet();
  useEffect(() => {
    getAllMyWallet();
  }, []);

  const [myWallet, setMyWallet] = useState<TypedWallet[]>([]);
  const [defaultWallet, setDefaultWallet] = useState<TypedWallet>(null);

  useEffect(() => {
    if (data) {
      let { body, totalItems } = data;
      if (!Array.isArray(body)) return;
      let myDefaultWallet = body?.filter((el) => el.wallet_type.is_default === 1);
      let myOtherWallet = body?.filter((el) => el.wallet_type.is_default === 0);
      setDefaultWallet(myDefaultWallet?.pop());
      setMyWallet(myOtherWallet);
    }
  }, [data]);

  const LoadingTemplate = () => {
    return (
      <Box padding="400" background="bg-fill-active">
        <BlockStack gap="400">
          <InlineGrid gap={'400'} alignItems="center" columns={{ xs: '', md: 2, lg: 2 }}>
            <InlineGrid alignItems="center" columns={['oneThird', 'twoThirds']}>
              <SkeletonThumbnail />
              <div>
                <Text as="h3" variant="heading2xl">
                  <SkeletonDisplayText />
                </Text>
              </div>
            </InlineGrid>
          </InlineGrid>
          <Divider />
          <InlineGrid alignItems="center" gap="200" columns={3}>
            <div>
              <Text as="h3" variant="headingLg" tone="subdued">
                <SkeletonDisplayText />
              </Text>
            </div>
            <div>
              <Text as="h3" variant="headingLg" tone="subdued">
                <SkeletonDisplayText />
              </Text>
            </div>
            <div>
              <Text as="h3" variant="headingLg" tone="subdued">
                <SkeletonDisplayText />
              </Text>
            </div>
          </InlineGrid>
        </BlockStack>
      </Box>
    );
  };

  return (
    <>
      <div id="user_wallet_card_profile">
        {isLoading ? (
          <LoadingTemplate />
        ) : (
          <Box padding="400" background="bg-fill-active">
            <BlockStack gap="400">
              <InlineGrid gap={'400'} alignItems="center" columns={{ xs: '', md: 2, lg: 2 }}>
                <InlineGrid alignItems="center" columns={['oneThird', 'twoThirds']}>
                  <Icon source={WalletIcon} />
                  <div>
                    <Text as="p">Tài khoản chính</Text>
                    <Link url={`/my-wallet/${defaultWallet?.wallet_type?.wallet_unit}`}>
                      <Text as="h3" variant="heading2xl">
                        {__helpers.formatNumber(defaultWallet?.balance ?? 0)} {defaultWallet?.wallet_type?.wallet_unit}
                      </Text>
                    </Link>
                  </div>
                </InlineGrid>
                <InlineStack gap="200" align="start" blockAlign="center"></InlineStack>
              </InlineGrid>
              <Divider />
              <InlineGrid alignItems="center" gap="200" columns={{ xs: 1, md: myWallet?.length ?? 0 }}>
                {myWallet?.map((wallet, index) => {
                  return (
                    <Link url={`/my-wallet/${wallet.wallet_type.wallet_unit}`} removeUnderline key={`my_wallet_` + index}>
                      <Text as="p">{wallet?.wallet_type?.wallet_name}</Text>
                      <Text as="h3" variant="headingLg" tone="subdued">
                        {__helpers.formatNumber(wallet.balance ?? 0)} {wallet.wallet_type.wallet_unit}
                      </Text>
                    </Link>
                  );
                })}
              </InlineGrid>
            </BlockStack>
          </Box>
        )}
      </div>
    </>
  );
}
