import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Avatar, Badge, BlockStack, Box, Button, Image, InlineGrid, InlineStack, Link, Page, Text, useBreakpoints } from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';
import learning_team_background from 'media/images/learning-team.jpg';
import Typed from 'typed.js';
import placeholder_thumbnail_course from 'media/images/placeholder_thumbnail_course.svg';
import 'media/css/edu.scss';

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
              <Text as="h2" variant="heading3xl">
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
                  return (
                    <div className="card card-bordered" key={index + '_course_item'}>
                      <div className="card-pinned">
                        <img className="card-img-top" src={placeholder_thumbnail_course} alt="A" />

                        <div className="card-pinned-top-start">
                          <Badge tone="enabled">Bestseller</Badge>
                        </div>

                        <div className="card-pinned-bottom-start">
                          <div className="d-flex align-items-center flex-wrap">
                            <span className="fw-semibold text-white me-1">4.91</span>
                            <span className="text-white-70">(1.5k+ reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <BlockStack gap="200">
                          <small className="card-subtitle">Code</small>
                          <Text as="h3" variant="headingLg">
                            <Link url="/edu/view/1" removeUnderline>
                              Complete Python Bootcamp: Go from zero to hero in Python
                            </Link>
                          </Text>

                          <InlineStack blockAlign="center" align="space-between">
                            <Avatar source="" name="A" size="md" />
                            <Text as="span" tone="subdued">
                              12 bài học
                            </Text>
                          </InlineStack>
                        </BlockStack>
                      </div>

                      <div className="card-footer">
                        <InlineGrid columns={['twoThirds', 'oneThird']}>
                          <BlockStack>
                            <Text as="p" tone="subdued">
                              <del>$114.99</del>
                            </Text>
                            <Text as="p">$99.99</Text>
                          </BlockStack>
                        </InlineGrid>
                      </div>
                    </div>
                  );
                })}
            </InlineGrid>
          </div>
        </Page>
      </Box>
    </div>
  );
}
