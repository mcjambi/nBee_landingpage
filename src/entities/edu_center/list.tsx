import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Image, InlineGrid, InlineStack, Page, Text } from '@shopify/polaris';

import learning_team_background from 'media/images/learning-team.jpg';
import Typed from 'typed.js';

export default function EduList() {
  useEffect(() => {
    const typed = new Typed('#typingJS', {
      strings: ['Handy', 'Mandy', 'Candy', 'More Strings'], // Strings to display
      // Speed settings, try diffrent values untill you get good results
      startDelay: 300,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
      loop: true,
      cursorChar: '_',
    });

    // Destropying
    return () => {
      typed.destroy();
    };
  }, []);
  return (
    <>
      <Helmet>
        <title>Các khóa đào tạo</title>
      </Helmet>

      <Page>
        <InlineGrid columns={{ xs: 1, md: 2 }} gap="300" alignItems="center">
          <div>
            <Text as="h2" variant="heading3xl">
              Trở lên <span id="typingJS"></span>
              <br />
              Khi bạn ...
            </Text>
            <Text as="p" variant="bodyMd">
              Front's feature-rich designed demo pages help you create the best possible product.
            </Text>
          </div>
          <div>
            <Image width={'400px'} height={'auto'} alt={''} source={learning_team_background} />
          </div>
        </InlineGrid>
      </Page>
    </>
  );
}
