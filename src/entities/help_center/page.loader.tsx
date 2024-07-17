import { BlockStack, Card, SkeletonBodyText, Text, Image } from '@shopify/polaris';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import Parser from 'html-react-parser';
import dateandtime from 'date-and-time';
import __, { ___ } from 'languages/index';
import { TypedPost, TypedPosts } from 'queries/posts.query';
const helpBanner = require('media/images/help-banner.png');

export default function PageLoader({ slug }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TypedPost>(null);
  let language = localStorage.getItem('language') || 'en';

  const loadPage = useCallback(
    async (slug: string) => {
      try {
        let post = await axios.get<TypedPost>('/posts/' + slug, {
          params: { lang: language },
        });
        setData(post.data);
      } catch (e) {
        console.log('POST NOT FOUNDDD E_987');
      }
      setLoading(false);
    },
    [language]
  );

  useEffect(() => {
    if (!slug) return;
    loadPage(slug);
  }, [slug, language]);

  const pageMeta = data
    ? ___('Post by {author_name} - last update at {update_time}', {
        author_name: <span>{data?.author?.display_name}</span>,
        update_time: <span>{data?.createdAt && dateandtime.format(new Date(Number(data?.createdAt)), 'DD/MM/YYYY HH:mm:ss')}</span>,
      })
    : null;

  return (
    <>
      {loading ? (
        <SkeletonBodyText />
      ) : data ? (
        <>
          <div className="help-header">
            <Image alt={''} source={helpBanner} />
            <h1 className="post_title">{data?.post_to_content?.post_title ?? ''}</h1>
          </div>
          <div id="post_wrap">
            <BlockStack gap="500">
              <div id="post_excerpt">{data?.post_to_content?.post_excerpt ?? ''}</div>
              <div id="post_meta">{pageMeta}</div>
              <div id="post_content">{Parser(data?.post_to_content?.post_content ?? ' ')}</div>
            </BlockStack>
          </div>
        </>
      ) : (
        <>
          <h1>{__('post_not_found')}</h1>
        </>
      )}
    </>
  );
}
