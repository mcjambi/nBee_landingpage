import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Card, DataTable, InlineStack, Link, Page, Tag } from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';
import { Helmet } from 'react-helmet-async';
import SimpleFilter from 'components/simpleFilter';
import dateandtime from 'date-and-time';

import { useGetContactforms } from 'queries/contactform.query';
import helpers from 'helpers/index';
import Pagination from 'components/pagination';
import CreateHelpModal from './create';

export default function MyHelpCenterList() {
  const rootSearchPath = window.location.search;
  /**
   * If user apply filter, it will add to URL, then parse URL back to initial state
   */
  let StringQuery: any = helpers.ExtractUrl(rootSearchPath) || false;
  const initialQuery = {
    query: '',
    page: 1,
    limit: 50,
    sort: 'createdAt:desc',
  };
  const [mainQuery, setMainQuery] = useState<any>({
    ...initialQuery,
    ...StringQuery,
  });
  const { refetch: getEntities, data, isFetching: loading } = useGetContactforms(mainQuery);

  const [entities, setEntities] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    if (data) {
      let { body, totalItems } = data;
      setEntities(body);
      setTotalItems(totalItems);
    }
  }, [data]);
  /**
   * Change page number
   * Must be mainQuery or it will reset mainQuery. BUG!
   */
  const onChangePagination = useCallback((page: number, limit: number) => {
    setMainQuery({ ...mainQuery, ...{ page, limit } });
  }, []);

  const reduceRequest = useCallback((mainQuery) => {
    getEntities();
    return mainQuery;
  }, []);

  const reduceRequestMemo = useMemo(() => {
    return helpers.debounce((_value) => {
      reduceRequest?.call(this, _value);
    }, 500);
  }, []);

  /**
   * I do not know ...
   * Bug: In React, do NOT remove this code
   */
  const filterCallback = useCallback((_value: any) => {
    if (_value === false) {
      return setMainQuery(initialQuery);
    } else {
      setMainQuery((oldValue) => {
        return { ...oldValue, ..._value };
      });
    }
  }, []);

  useEffect(() => {
    let buildURLSearch = helpers.buildEndUrl(mainQuery);
    if (window.location.search !== buildURLSearch) {
      window.history.replaceState(null, 'My help center', '/my_help_center' + buildURLSearch);
    }
    reduceRequestMemo(mainQuery);
  }, [mainQuery]);

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
        return (
          <>
            <Badge></Badge>
            <Badge></Badge>
          </>
        );
    }
  }

  const [showModal, setShowModal] = useState(false);
  const closeModalCallback = useCallback(() => {
    setShowModal((old) => !old);
  }, []);

  return (
    <>
      <Helmet>
        <title>Liên hệ và yêu cầu</title>
      </Helmet>
      <CreateHelpModal show={showModal} onClose={closeModalCallback} />

      <Page
        title="Trung tâm liên hệ"
        subtitle="Quản lý các ticket bạn yêu cầu"
        primaryAction={{ content: 'Tạo yêu cầu', onAction: () => setShowModal(true), icon: PlusIcon }}
      >
        <Card padding="0">
          <SimpleFilter
            loading={loading}
            options={[
              {
                label: 'Ban chung',
                value: 'general',
                field: 'contactform_category',
              },
              {
                label: 'Kế toán',
                value: 'accountant',
                field: 'contactform_category',
              },
              {
                label: 'Giám đốc',
                value: 'manager',
                field: 'contactform_category',
              },
              {
                label: 'Phòng sale',
                value: 'sale',
                field: 'contactform_category',
              },
            ]}
            onCallback={filterCallback}
            sortField={[
              {
                label: 'Tình trạng xử lý',
                field: 'contactform_status',
              },
            ]}
          />
          <DataTable
            increasedTableDensity
            columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text']}
            headings={['Phòng ban', 'Tựa đề', 'Nhân viên xử lý', 'Tình trạng xử lý', 'Ngày tạo']}
            rows={
              entities?.map((x) => {
                return [
                  x.contactform_category,

                  <Link url={'/my_help_center/view/' + x.contactform_id}>{helpers.trimMiddleString(x.contactform_title, 30, 10)}</Link>,
                  <InlineStack gap={'200'} align="start" blockAlign="center">
                    {Array.isArray(x.user_to_contactform) && x.user_to_contactform.length > 0
                      ? x.user_to_contactform.map((e, index) => {
                          return <Tag key={index + 'taglist'}>{e?.assignee?.display_name}</Tag>;
                        })
                      : null}
                  </InlineStack>,
                  contactformCondition(x.contactform_status),
                  dateandtime.format(new Date(Number(x?.createdAt)), 'DD/MM/YYYY HH:mm'),
                ];
              }) || []
            }
          />
        </Card>

        <br />
        {totalItems > 0 ? (
          <Pagination
            TotalRecord={totalItems}
            onChange={onChangePagination}
            pageSize={Number(mainQuery?.limit)}
            activeCurrentPage={Number(mainQuery?.page)}
          />
        ) : null}
      </Page>
    </>
  );
}
