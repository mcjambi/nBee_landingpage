import React from 'react';
import { useParams } from 'react-router-dom';
import LuckyWheel from './lucky_wheel';
import CheckIn from './checkin';

export default function Gamification() {
  const { slug } = useParams();
  switch (slug) {
    case 'lucky_wheel':
      return <LuckyWheel />;
    default:
      return <CheckIn />;
  }
}
