import React, { useEffect } from 'react';
import { Badge, BlockStack, Card, DescriptionList, Divider, InlineGrid, InlineStack, Link, Page, Tag, Text } from '@shopify/polaris';
import { useGetContactform } from 'queries/contactform.query';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import dateandtime from 'date-and-time';
import __helpers from 'helpers/index';

export default function MyHelpCenterView() {
  let { contactform_id } = useParams();
  const { mutateAsync: getEntity, isPending, data: entity } = useGetContactform();
  const history = useNavigate();
  useEffect(() => {
    getEntity(contactform_id);
  }, [contactform_id]);

  function contactformCondition(_status: number) {
    switch (_status) {
      case 9:
        return <Badge progress="incomplete">Hủy</Badge>;
      case 8:
        return (
          <Badge progress="incomplete" tone="attention">
            Đang xử lý
          </Badge>
        );
      case 7:
        return (
          <Badge tone="success" progress="complete">
            Đã xử lý xong
          </Badge>
        );
      default:
        return <Badge>Chờ xử lý</Badge>;
    }
  }
  return (
    <>
      <Helmet>
        <title>{`[${entity?.contactform_category}] - ${entity?.contactform_title}`}</title>
      </Helmet>
      <Page
        backAction={{
          content: 'Back',
          onAction: () => history('/my_help_center'),
        }}
      >
        <InlineGrid columns={{ xs: '1', sm: '1', md: '1', lg: ['twoThirds', 'oneThird'] }} gap={'400'}>
          <Card>
            <BlockStack gap={'400'}>
              <Text as="h1" variant="headingMd">
                [{entity?.contactform_category}] - {entity?.contactform_title}
              </Text>
              {entity?.updatedAt && (
                <Text as="span" tone="subdued" variant="bodySm">
                  Cập nhật lần cuối bởi {entity?.updater?.display_name} lúc{' '}
                  {dateandtime.format(new Date(Number(entity?.updatedAt)), 'DD-MM-YYYY, HH:mm')}
                </Text>
              )}
              <Divider />
              <Text as="p">{entity?.contactform_content}</Text>
              <Divider />

              <InlineStack gap={'200'} align="start" blockAlign="center">
                {Array.isArray(entity?.user_to_contactform) && entity?.user_to_contactform.length > 0 ? (
                  <>
                    <Text as="p" tone="subdued">
                      Người xử lý:
                    </Text>
                    {entity?.user_to_contactform.map((e, index) => {
                      return <Tag key={index + 'taglist'}>{e?.assignee?.display_name}</Tag>;
                    })}
                  </>
                ) : (
                  <Text as="p" tone="subdued">
                    Chưa có ai xử lý.
                  </Text>
                )}
              </InlineStack>
            </BlockStack>
            <br />
            <Divider />
            <br />
          </Card>
          <Card>
            {contactformCondition(entity?.contactform_status)}
            <br />
            <br />
            <Text as="span">Được gửi bởi chính bạn</Text>
            <br />
            <br />
            <Divider />
            <br />
            <DescriptionList
              gap="tight"
              items={[
                {
                  term: 'Đã gửi',
                  description: __helpers.subtractTimeHistory(entity?.createdAt),
                },
                {
                  term: 'Từ IP',
                  description: entity?.contactform_ip,
                },
                {
                  term: 'UUID',
                  description: entity?.device_uuid,
                },
              ]}
            />
            <br />
          </Card>
        </InlineGrid>
      </Page>
      ;
    </>
  );
}
