import React, { useEffect, useState } from 'react';
import { BlockStack, Box, InlineGrid, InlineStack, Text, Image, SkeletonDisplayText, SkeletonThumbnail, Divider, Link } from '@shopify/polaris';
import { WalletIcon } from '@shopify/polaris-icons';
import { TypedWallet, useGetMyWallet } from 'queries/user_wallet.query';
import __helpers from 'helpers/index';
import 'media/css/user_wallet_card.scss';
import wallet_background from 'media/lottie_files/wallet_background.json';
import Lottie from 'lottie-react';

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
              <InlineStack gap={'400'} align="start">
                <Lottie className="wallet_background_icon" animationData={wallet_background} loop={false} />
                <div>
                  <Text as="p">Tài khoản chính</Text>
                  <Link url={`/my-wallet/${defaultWallet?.wallet_type?.wallet_unit}`}>
                    <Text as="h3" variant="heading2xl">
                      {__helpers.formatNumber(defaultWallet?.balance ?? 0)} <sup>{defaultWallet?.wallet_type?.wallet_sign}</sup>
                    </Text>
                  </Link>
                </div>
              </InlineStack>
              {Array.isArray(myWallet) && !__helpers.isEmpty(myWallet) && (
                <>
                  <Divider />
                  <InlineGrid alignItems="center" gap="400" columns={{ xs: 1, md: myWallet?.length ?? 0 }}>
                    {myWallet?.map((wallet, index) => {
                      return (
                        <Link url={`/my-wallet/${wallet.wallet_type.wallet_unit}`} removeUnderline key={`my_wallet_` + index}>
                          <Text as="p" tone="subdued">
                            {wallet?.wallet_type?.wallet_name}
                          </Text>
                          <Text as="h3" variant="headingLg" tone="subdued">
                            <small>{wallet.wallet_type.wallet_sign}</small> {__helpers.formatNumber(wallet.balance ?? 0)}
                          </Text>
                        </Link>
                      );
                    })}
                  </InlineGrid>
                </>
              )}
            </BlockStack>
          </Box>
        )}
      </div>
    </>
  );
}
