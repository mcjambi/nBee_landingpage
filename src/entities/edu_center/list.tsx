import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Avatar, Badge, BlockStack, Box, Button, Image, InlineGrid, InlineStack, Link, Page, Text, useBreakpoints } from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';
import learning_team_background from 'media/images/learning-team.jpg';
import Typed from 'typed.js';
import 'media/css/edu.scss';
import CourseLoopElement from './components/loop-course-block';

export default function EduList() {
  useEffect(() => {
    const typed = new Typed('#typingJS', {
      strings: ['Thành công', 'Thoải mái', 'Nhiều đơn', 'Tốt hơn'], // Strings to display
      startDelay: 300,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
      loop: true,
      cursorChar: '',
    });

    // Destropying
    return () => {
      typed.destroy();
    };
  }, []);

  const { smUp, mdUp, lgUp, xlUp } = useBreakpoints();

  return (
    <div id="edu_wrap">
      <Helmet>
        <title>Các khóa đào tạo</title>
      </Helmet>

      <Box padding={{ xs: '400' }} paddingBlock="2000" background="bg-fill">
        <Page>
          <InlineGrid columns={{ xs: 1, md: 2 }} gap="300" alignItems="center">
            <div>
              <Text as="h2" variant="heading2xl">
                Bạn muốn <span id="typingJS" style={{ color: 'green', borderBottom: '4px solid green' }}></span>
                <br />
                Mọi thứ ...
              </Text>

              <Text as="h4" variant="headingLg" tone="subdued" fontWeight="regular">
                Nhận được sự chia sẻ từ các chuyên gia hàng đầu trong lĩnh vực kinh doanh.
              </Text>
            </div>
            {mdUp && (
              <InlineStack align="end">
                <Image width={'auto'} height={'300px'} alt={''} source={learning_team_background} />
              </InlineStack>
            )}
          </InlineGrid>
        </Page>
      </Box>

      <Box padding={{ xs: '400' }} paddingBlock="400">
        <Page>
          <Text as="h3" variant="headingLg">
            Những bài học mới
          </Text>
          <br />
          <br />
          <div id="course_list_wrap">
            <InlineGrid gap="400" columns={{ md: 3, xs: 1 }}>
              {Array(3)
                .fill(2)
                .map((el, index) => {
                  return <CourseLoopElement index={index} />;
                })}
            </InlineGrid>
          </div>
        </Page>
      </Box>
    </div>
  );
}
