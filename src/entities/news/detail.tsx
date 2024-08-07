import { Avatar, BlockStack, Box, Divider, InlineGrid, InlineStack, Page, Text, Thumbnail } from '@shopify/polaris';
import SkeletonPageLoading from 'components/skeletonPageLoading';
import __helpers from 'helpers/index';
import Template404 from 'layout/404';
import { useGetPost } from 'queries/posts.query';
import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Parser from 'html-react-parser';

export default function DetailNews({ pageslug = 'error_404' }: { pageslug: string }) {
  const { data: entity, isLoading, isError } = useGetPost(pageslug);
  console.log(entity, 'post___entity');
  const history = useNavigate();

  const ActualPage = useCallback(() => {
    return (
      <Page narrowWidth backAction={{ content: 'back to list', onAction: () => history('/news') }} title={entity?.post_title}>
        <BlockStack gap="400">
          <Text as="span" tone="subdued">
            <Text as="span">{entity?.author?.display_name}</Text> - {__helpers.subtractTimeHistory(entity?.createdAt)}
          </Text>

          <div className="ck-content">{Parser(entity?.post_content ?? ' empty')}</div>

          <br />
          <Divider />
          <br />
          <Text as="h3" variant="headingLg">
            Tác giả
          </Text>
          <InlineStack blockAlign="center" align="space-between">
            <InlineStack align="start" blockAlign="center" gap="400">
              <Thumbnail source={entity?.author?.user_avatar} alt={''} size="medium" />
              <BlockStack>
                <Text as="h3" variant="headingMd">
                  {entity?.author?.display_name}
                </Text>
                <Text as="span" tone="subdued">
                  {entity?.author.bio ?? 'Chưa có giới thiệu'}
                </Text>
              </BlockStack>
            </InlineStack>
          </InlineStack>
        </BlockStack>
      </Page>
    );
  }, [entity]);

  return (
    <>
      <Helmet>
        <title>{entity?.post_title ?? 'Not found!'}</title>
      </Helmet>

      {isLoading ? <SkeletonPageLoading /> : isError ? <Template404 /> : <ActualPage />}

      <br />
      <br />
      <br />
      <br />
    </>
  );
}
