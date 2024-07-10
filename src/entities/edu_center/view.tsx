import React from 'react';
import { useParams } from 'react-router-dom';

export default function EduView() {
  let { course_slug } = useParams(); //course_slug

  return <>EDU VIEW</>;
}
