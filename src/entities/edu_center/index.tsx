import React from 'react';
import { useParams } from 'react-router-dom';
import EduList from './list';
import EduView from './view';

export default function EDUCenter() {
  let { slug } = useParams(); //course_slug
  switch (slug) {
    case 'view':
      return <EduView />;
    default:
      return <EduList />;
  }
}
