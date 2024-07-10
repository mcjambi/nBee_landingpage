import React from 'react';
import MyHelpCenterList from './list';
import MyHelpCenterView from './view';
import { useParams } from 'react-router-dom';

export default function MyHelpCenter() {
  let { slug } = useParams();

  switch (slug) {
    case 'view':
      return <MyHelpCenterView />;
    default:
      return <MyHelpCenterList />;
  }
}
