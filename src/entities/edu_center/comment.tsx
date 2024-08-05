import React from 'react';
import { Avatar, BlockStack, Box, Divider, InlineGrid, InlineStack, Text } from '@shopify/polaris';
import StarRating from 'components/starRating';

export default function CommentCourse({ heading = 'Nhận xét' }: { heading?: string }) {
  return (
    <>
      <BlockStack gap="400">
        {heading && (
          <Text as="h2" variant="headingLg">
            {heading}
          </Text>
        )}
        <Box>
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack>
              <Text as="h3" variant="heading3xl">
                4.3
              </Text>
              <StarRating num={4} />
            </BlockStack>
            <Text as="h4" variant="bodyLg">
              23 người học, 400 nhận xét
            </Text>
          </InlineStack>
        </Box>

        <br />
        <Divider />
        <br />

        {Array(4)
          .fill('a')
          .map((commentData, index) => {
            return (
              <>
                <BlockStack gap={'400'} key={index + '_comment_element'}>
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap={'400'} blockAlign="center">
                      <Avatar />
                      <Text as="p" fontWeight="bold">
                        Nguyễn Văn Trỗi
                      </Text>
                    </InlineStack>
                    <div>
                      <StarRating num={5} />
                    </div>
                  </InlineStack>
                  <Text as="p" tone="subdued" variant="bodySm">
                    April 3, 2019
                  </Text>
                  <Text as="p">
                    Tuyệt lắm, bài học dễ học! This course helped me in learning python in a very simple and effective way & boosts up my confidence.
                    Concepts have been explained in a crystal clear way.
                  </Text>
                </BlockStack>
                <br />
                <Divider />
                <br />
              </>
            );
          })}
      </BlockStack>
    </>
  );
}
