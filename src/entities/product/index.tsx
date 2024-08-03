import React from 'react';
import { useParams } from 'react-router-dom';
import HomeProduct from './home';
import ViewProduct from './view';
import Template404 from 'layout/404';
import CategoryProduct from './category';

export default function Product() {
  let { slug = 'index' } = useParams();

  switch (slug) {
    case 'index':
      return <HomeProduct />;
    case 'category':
      return <CategoryProduct />;
    case 'view':
      return <ViewProduct />;
    default:
      return <Template404 />;
  }
}
