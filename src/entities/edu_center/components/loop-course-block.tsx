import { Avatar, Badge, BlockStack, InlineGrid, InlineStack, Link, Text } from '@shopify/polaris';
import React from 'react';
import placeholder_thumbnail_course from 'media/images/placeholder_thumbnail_course.svg';

export default function CourseLoopElement({ index }) {
  return (
    <div className="card card-bordered" key={index + '_course_item'}>
      <div className="card-pinned">
        <img className="card-img-top" src={placeholder_thumbnail_course} alt="A" />

        <div className="card-pinned-top-start">
          <Badge tone="enabled">Bestseller</Badge>
        </div>

        <div className="card-pinned-bottom-start">
          <div className="d-flex align-items-center flex-wrap">
            <span className="fw-semibold text-white me-1">4.91</span>
            <span className="text-white-70">(1.5k+ reviews)</span>
          </div>
        </div>
      </div>

      <div className="card-body">
        <BlockStack gap="200">
          <small className="card-subtitle">Code</small>
          <Text as="h3" variant="headingLg">
            <Link url="/edu/view/1" removeUnderline>
              Complete Python Bootcamp: Go from zero to hero in Python
            </Link>
          </Text>

          <InlineStack blockAlign="center" align="space-between">
            <Avatar source="" name="A" size="md" />
            <Text as="span" tone="subdued">
              12 bài học
            </Text>
          </InlineStack>
        </BlockStack>
      </div>

      <div className="card-footer">
        <InlineGrid columns={['twoThirds', 'oneThird']}>
          <BlockStack>
            <Text as="p" tone="subdued">
              <del>$114.99</del>
            </Text>
            <Text as="p">$99.99</Text>
          </BlockStack>
        </InlineGrid>
      </div>
    </div>
  );
}
