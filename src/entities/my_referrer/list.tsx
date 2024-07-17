import { Avatar, Badge, Card, IndexTable, InlineGrid, InlineStack, Text } from '@shopify/polaris';
import SimpleFilter from 'components/simpleFilter';
import __helpers from 'helpers/index';
import { TypedMyReferrers, useMyReferrers } from 'queries/user_referrer.query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dateandtime from 'date-and-time';
import Pagination from 'components/pagination';

export default function MyReferrers() {
  /**
   * If user apply filter, it will add to URL, then parse URL back to initial state
   */
  let StringQuery: any = __helpers.ExtractUrl(window.location.search) || false;

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

  /**
   * Change page number
   */
  const onChangePagination = useCallback(
    (numPage: number, limit: number) => {
      setMainQuery({ ...mainQuery, page: numPage, limit: limit });
    },
    [mainQuery]
  );

  const { data: entities, isLoading: loadingMyReferrers, isFetched, refetch: getEntities } = useMyReferrers(mainQuery);
  const [totalItems, setTotalItems] = useState(0);
  const [records, setRecords] = useState<TypedMyReferrers[]>([]);
  useEffect(() => {
    if (entities) {
      let { body, totalItems } = entities;
      setRecords(body);
      setTotalItems(totalItems);
    }
  }, [entities]);

  const onChangeCallback = useMemo(() => __helpers.debounce((_value) => getEntities?.call(this, _value), 400), []);

  useEffect(() => {
    let buildURLSearch = __helpers.buildEndUrl(mainQuery);
    if (window.location.search !== buildURLSearch) {
      window.history.replaceState(null, 'Giới thiệu nhận hoa hồng', '/my_referrer' + buildURLSearch);
    }
    onChangeCallback();
  }, [mainQuery]);

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

  return (
    <>
      <Card padding="0">
        <SimpleFilter
          loading={loadingMyReferrers}
          onCallback={filterCallback}
          options={
            [
              // { label: 'Chưa duyệt', value: '0', field: 'verified_status' },
              // { label: 'Từ chối', value: '-1', field: 'verified_status' },
              // { label: 'Đã duyệt', value: '1', field: 'verified_status' },
            ]
          }
          sortField={[]}
        />
        <IndexTable
          resourceName={{
            singular: 'Người bạn giới thiệu',
            plural: 'Người bạn giới thiệu',
          }}
          itemCount={totalItems || 1}
          headings={[{ title: 'User' }, { title: 'Tình trạng' }, { title: 'Số đơn' }, { title: 'Số tiền tiêu' }, { title: 'Ngày gia nhập' }]}
          loading={loadingMyReferrers}
          selectable={false}
        >
          {records?.map(({ createdAt, user_avatar, display_name, user_status, customer_to_user }, index) => (
            <IndexTable.Row id={`user_verified_` + index} position={index} key={`user_verified_` + index}>
              <IndexTable.Cell className="table_app_cellMinWidth">
                <InlineStack gap={'200'} align="start" blockAlign="center">
                  <Avatar
                    size="lg"
                    customer
                    name={display_name}
                    initials={String(display_name || 'R').charAt(0)}
                    source={user_avatar ? process.env.REACT_APP_AJAX_UPLOAD_PERMALINK + user_avatar : 'https://placehold.co/100x100'}
                  />
                  <Text variant="bodyMd" fontWeight="bold" as="span">
                    {display_name}
                  </Text>
                </InlineStack>
              </IndexTable.Cell>
              <IndexTable.Cell>{user_status === 1 ? <Badge tone="success">Active</Badge> : <Badge>InActive</Badge>}</IndexTable.Cell>
              <IndexTable.Cell>{customer_to_user?.customer_order_count}</IndexTable.Cell>
              <IndexTable.Cell>{customer_to_user?.customer_moneyspent_count}</IndexTable.Cell>
              <IndexTable.Cell>{dateandtime.format(new Date(Number(createdAt)), 'DD-MM-YYYY HH:mm:ss')}</IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>
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
    </>
  );
}
