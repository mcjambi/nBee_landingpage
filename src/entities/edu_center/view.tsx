import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  BlockStack,
  Box,
  Button,
  Collapsible,
  Divider,
  Icon,
  InlineGrid,
  InlineStack,
  Link,
  MediaCard,
  Page,
  Text,
  VideoThumbnail,
} from '@shopify/polaris';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Parser from 'html-react-parser';
import { SelectIcon } from '@shopify/polaris-icons';
import CommentCourse from './comment';

export default function EduView() {
  let { course_slug } = useParams(); //course_slug
  let history = useNavigate();

  const [openCollapse, setOpenCollapse] = useState(false);
  const handleToggleCollapse = useCallback(() => setOpenCollapse((open) => !open), []);

  const [openCourseCollapse, setOpenCourseCollapse] = useState({});
  const handleToggleCourseCollapse = useCallback(
    (index) => {
      let x = !openCourseCollapse[index];
      let a = { ...openCourseCollapse, ...{} };
      a[index] = x;
      return setOpenCourseCollapse(a);
    },
    [openCourseCollapse]
  );

  const allCourseData = useMemo(() => {
    return [
      {
        course: {
          name: 'Python Setup',
          course_id: '1',
          lectures: [
            {
              name: 'How to install Python',
              id: '3',
            },
            {
              name: 'How to Run Python',
              id: '4',
            },
          ],
        },
      },
      {
        course: {
          name: 'Python Statement',
          course_id: '2',
          lectures: [
            {
              name: 'WHAT IS Python',
              id: '5',
            },
            {
              name: 'Python is snake?',
              id: '6',
            },
          ],
        },
      },
    ];
  }, []);

  useEffect(() => {
    let all_collapse = {};
    for (let i of allCourseData) {
      all_collapse[i.course.course_id] = false;
    }
    setOpenCourseCollapse(all_collapse);
  }, [allCourseData]);

  return (
    <>
      <Helmet>
        <title>Xem khoá học</title>
      </Helmet>
      <Page backAction={{ content: 'Quay lại', onAction: () => history('/edu') }}>
        <InlineGrid columns={{ xs: 1, md: ['twoThirds', 'oneThird'] }} gap="400">
          {
            // main path ...
          }
          <div id="course_main">
            <Box padding="400">
              <BlockStack gap="400">
                <Text as="h1" variant="heading2xl">
                  Complete Python Bootcamp
                </Text>
                <Text as="p" variant="bodyLg" tone="subdued">
                  Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games!
                </Text>

                <InlineStack align="start" blockAlign="center" gap="200">
                  <Avatar />
                  <Text as="span" variant="bodyLg">
                    Nguyễn Ngọc Tú Anh
                  </Text>
                </InlineStack>
              </BlockStack>
              <br />
              <Divider />
              <br />
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">
                  Mô tả
                </Text>
                {Parser(
                  `<p>With over 100 lectures and more than 20 hours of video this comprehensive course leaves no stone unturned! This course includes quizzes, tests, and homework assignments as well as 3 major projects to create a Python project portfolio!</p>`
                )}
                <Collapsible
                  open={openCollapse}
                  id="basic-collapsible"
                  transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                  expandOnPrint
                >
                  <div>
                    {Parser(`
<p>This course will teach you Python in a practical manner, with every lecture comes a full coding screencast and a corresponding code notebook! Learn in whatever manner is best for you!</p>

<p>We will start by helping you get Python installed on your computer, regardless of your operating system, whether its Linux, MacOS, or Windows, we've got you covered!</p>

<p>We cover a wide variety of topics, including:</p>

<ul class="text-body pl-6">
  <li>Command Line Basics</li>
  <li>Installing Python</li>
  <li>Running Python Code</li>
  <li>Strings</li>
  <li>Lists&nbsp;</li>
  <li>Dictionaries</li>
  <li>Tuples</li>
  <li>Sets</li>
  <li>Number Data Types</li>
  <li>Print Formatting</li>
  <li>Functions</li>
  <li>Scope</li>
  <li>args/kwargs</li>
  <li>Built-in Functions</li>
  <li>Debugging and Error Handling</li>
  <li>Modules</li>
  <li>External Modules</li>
  <li>Object Oriented Programming</li>
  <li>Inheritance</li>
  <li>Polymorphism</li>
  <li>File I/O</li>
  <li>Advanced Methods</li>
  <li>Unit Tests</li>
  <li>and much more!</li>
</ul>
<p>This course comes with a 30 day money back guarantee! If you are not satisfied in any way, you'll get your money back. Plus you will keep access to the Notebooks as a thank you for trying out the course!</p>
              `)}
                  </div>
                </Collapsible>

                <Button onClick={handleToggleCollapse} ariaExpanded={openCollapse} ariaControls="basic-collapsible">
                  {openCollapse ? 'Thu gọn' : 'Xem thêm'}
                </Button>
              </BlockStack>
              <br />
              <Divider />
              <br />

              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">
                  Khóa học có gì?
                </Text>
                {allCourseData.map((courseData, index) => {
                  return (
                    <Box key={index + '_course_id'} padding={'400'} background="bg-fill">
                      <Link removeUnderline onClick={() => handleToggleCourseCollapse(courseData.course.course_id)}>
                        <InlineStack align="start" blockAlign="center" gap="400">
                          <span>
                            <Icon tone="textPrimary" source={SelectIcon} />
                          </span>
                          <Text as="h3" variant="headingMd">
                            {courseData.course.name}
                          </Text>
                        </InlineStack>
                      </Link>
                      <Collapsible
                        open={openCourseCollapse[courseData.course.course_id]}
                        id="basic-collapsible"
                        transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                        expandOnPrint
                      >
                        <br />
                        <BlockStack gap="400">
                          {courseData.course.lectures.map((lectureData, index) => {
                            return (
                              <Text as="h3" variant="headingMd" key={index + '_lecture_title'}>
                                <Link removeUnderline url="/">
                                  {lectureData.name}
                                </Link>
                              </Text>
                            );
                          })}
                        </BlockStack>
                      </Collapsible>
                    </Box>
                  );
                })}
              </BlockStack>

              <br />
              <Divider />
              <br />

              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">
                  Các khóa học khác
                </Text>
                {Array(2)
                  .fill(2)
                  .map((el, index) => {
                    return (
                      <MediaCard
                        key={index + '_index_'}
                        title="Getting Started"
                        primaryAction={{
                          content: 'Learn about getting started',
                          onAction: () => {},
                        }}
                        description="Discover how Shopify can power up your entrepreneurial journey."
                        popoverActions={[{ content: 'Dismiss', onAction: () => {} }]}
                      >
                        <img
                          alt=""
                          width="100%"
                          height="100%"
                          style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                          }}
                          src="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                        />
                      </MediaCard>
                    );
                  })}
              </BlockStack>

              <br />
              <Divider />
              <br />
              <CommentCourse />
            </Box>
          </div>
          {
            // sidebar ...
          }
          <div id="course_sidebar">
            <MediaCard
              portrait
              title="Turn your side-project into a business"
              primaryAction={{
                content: 'Learn more',
                onAction: () => {},
              }}
              description="In this course, you’ll learn how the Kular family turned their mom’s recipe book into a global business."
              popoverActions={[{ content: 'Dismiss', onAction: () => {} }]}
            >
              <VideoThumbnail
                videoLength={80}
                thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                onClick={() => console.log('clicked')}
              />
            </MediaCard>
          </div>
        </InlineGrid>
      </Page>
      <br />
      <br />
      <br />
    </>
  );
}
