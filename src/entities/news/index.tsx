import React from 'react';
import { useParams } from 'react-router-dom';
import ListNews from './list';
import DetailNews from './detail';

export default function News() {
  let { slug } = useParams();

  if (!slug) return <ListNews />;
  return <DetailNews pageslug={slug} />;
}
