import { Avatar, BlockStack, Box, EmptyState, InlineGrid, InlineStack, Link, Page, Text } from '@shopify/polaris';
import Pagination from 'components/pagination';
import SkeletonPageLoading from 'components/skeletonPageLoading';
import helpers from 'helpers/index';
import { TypedPosts, useGetPosts } from 'queries/posts.query';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import page_empty_placeholder from 'media/lottie_files/page_empty_placeholder.json';
import Lottie from 'lottie-react';
import placeholder_thumbnail_course from 'media/images/placeholder_thumbnail_course.svg';
import { Helmet } from 'react-helmet-async';
import __helpers from 'helpers/index';

export default function ListNews() {
  const history = useNavigate();
  /**
   * If user apply filter, it will add to URL, then parse URL back to initial state
   */
  let useParam = {} as any;
  useParam = useLocation();
  let StringQuery: any = helpers.ExtractUrl(useParam.search) || false;

  const initialQuery = {
    query: '',
    page: 1,
    limit: 18,
    post_type: 'post',
    'post_to_content.lang': 'vi',
    lang: 'vi',
    sort: 'createdAt:desc',
  };
  const [mainQuery, setMainQuery] = useState({ ...initialQuery, ...StringQuery });

  const { refetch: getEntities, data, isLoading } = useGetPosts(mainQuery);

  /**
   * Change page number
   */
  const onChangePagination = useCallback(
    (numPage: number, limit: number) => {
      setMainQuery({ ...mainQuery, page: numPage, limit: limit });
    },
    [mainQuery]
  );

  useEffect(() => {
    let buildURLSearch = helpers.buildEndUrl(mainQuery);
    if (useParam.search !== buildURLSearch) history('/news' + buildURLSearch);
    getEntities();
  }, [mainQuery]);

  const [totalItems, setTotalItems] = useState(0);
  const [entities, setEntities] = useState<TypedPosts[] | null>(null);

  useEffect(() => {
    if (data) {
      let { body, totalItems } = data;
      setEntities(body);
      setTotalItems(totalItems);
    }
  }, [data]);

  return (
    <div id="news_list_wrapper">
      <Helmet>
        <title>Tin tức</title>
      </Helmet>
      <Page title="">
        {isLoading && <SkeletonPageLoading />}
        {entities !== null && helpers.isEmpty(entities) && (
          <EmptyState image={''}>
            <BlockStack inlineAlign="center">
              <Lottie animationData={page_empty_placeholder} />
              <Text as="h3" variant="headingMd">
                Chưa có một tin tức nào!
              </Text>
              <Text as="p">Mời bạn ghé lại sau nhé!</Text>
            </BlockStack>
          </EmptyState>
        )}
        <InlineGrid columns={{ md: 3, xs: 1 }} gap="400">
          {entities?.map((entity, index) => {
            return (
              <div className="new_list_loop">
                <Box key={'news_loop_' + index} background="bg-fill">
                  <BlockStack gap="400">
                    <img className="post_thumbnail" src={helpers.getMediaLink(entity.post_thumbnail, placeholder_thumbnail_course)} alt="A" />
                    <Box padding={'400'}>
                      <BlockStack gap="400">
                        <Link url={`/news/` + entity.post_name} removeUnderline>
                          <Text as="h2" variant="headingLg">
                            {entity?.post_to_content[0]?.post_title ?? 'Chưa đặt tên'}
                          </Text>
                        </Link>
                        <Text as="p">{helpers.trimContentString(entity?.post_to_content[0]?.post_excerpt ?? '', 100)}</Text>
                        <InlineStack blockAlign="center" align="space-between">
                          <InlineStack align="start" blockAlign="center" gap="100">
                            <Avatar source={entity?.author?.user_avatar} name="A" size="md" />
                            <Text as="span">{entity?.author?.display_name}</Text>
                          </InlineStack>
                          <Text as="span" tone="subdued">
                            {__helpers.subtractTimeHistory(entity?.createdAt)}
                          </Text>
                        </InlineStack>
                      </BlockStack>
                    </Box>
                  </BlockStack>
                </Box>
              </div>
            );
          })}
        </InlineGrid>
        <br />
        <br />
        {totalItems > mainQuery.limit ? (
          <Pagination TotalRecord={totalItems} activeCurrentPage={mainQuery.page} pageSize={mainQuery.limit} onChange={onChangePagination} />
        ) : null}
        <br />
        <br />
      </Page>
    </div>
  );
}
