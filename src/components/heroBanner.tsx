import { Box, InlineGrid, InlineStack, Page, Text, Image, useBreakpoints, BlockStack, Button } from '@shopify/polaris';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import 'media/css/hero_banner.scss';
import { DeliveryFilledIcon } from '@shopify/polaris-icons';
export default function HeroBanner() {
  const { smUp, mdUp, lgUp, xlUp } = useBreakpoints();

  return (
    <>
      <Helmet>
        <title>Trang sản phẩm</title>
      </Helmet>

      <Box padding={{ xs: '400' }} paddingBlock="2000" background="bg-fill" id="hero_banner_shop_page">
        <Page>
          <InlineGrid columns={{ xs: 1, md: 2 }} gap="300" alignItems="center">
            <BlockStack gap="400" id="hero_banner_shop_page_content">
              <Text as="h5" variant="headingSm" tone="subdued" fontWeight="regular">
                Mới về
              </Text>

              <Text as="h2" variant="heading3xl">
                Bobby big shark
              </Text>

              <Text as="h4" variant="headingLg" tone="subdued" fontWeight="regular">
                Trải nghiệm toàn bộ sản phẩm chất lượng cao với mức giá hợp lý.
              </Text>

              <Button icon={DeliveryFilledIcon} size="large" textAlign="start" variant="monochromePlain">
                Mua ngay
              </Button>
            </BlockStack>
            {mdUp && (
              <InlineStack align="end">{/* <Image width={'auto'} height={'300px'} alt={''} source={learning_team_background} /> */}</InlineStack>
            )}
          </InlineGrid>
        </Page>
      </Box>
    </>
  );
}
