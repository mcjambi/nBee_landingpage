import React, { useEffect, useState } from 'react';
import { Text, LegacyCard, DataTable, BlockStack, SkeletonBodyText, EmptyState, Card, Link, Badge } from '@shopify/polaris';
import product_placeholder from 'media/images/product_placeholder.svg';
import helpers from 'helpers/index';
import orderStatus from 'config/order.status.json';
import { useGetOrders } from 'queries/orders.query';
import { useAuth } from 'AuthContext';
import { useNavigate } from 'react-router-dom';

/** Lấy một số thông tin đơn hàng của người dùng */
export default function MyOrder() {
  const { user } = useAuth();
  const {
    data,
    refetch: getEntities,
    isLoading,
    isSuccess,
  } = useGetOrders({
    createdBy: user?.user_id,
    limit: 5,
  });

  useEffect(() => {
    getEntities();
  }, []);

  let history = useNavigate();

  let [entities, setEntities] = useState([]);
  useEffect(() => {
    if (data) {
      let { body, totalItems } = data;
      setEntities(body);
    }
  }, [data]);

  function getOrderBadge(orderStatus: number): any {
    switch (orderStatus) {
      case 0:
        return 'info';
      case 1:
      case 2:
      case 3:
      case 4:
        return 'incomplete';
      case 5:
        return 'complete';
      case 6:
      case 7:
        return 'critical';
      default:
        return 'info';
    }
  }

  const DataList = () => {
    return (
      <LegacyCard>
        <LegacyCard.Header title="Đơn hàng của tôi" actions={[{ content: 'xem tất cả', onAction: () => history('/order') }]}></LegacyCard.Header>
        <DataTable
          columnContentTypes={['text', 'text', 'text', 'text', 'text']}
          headings={['PNR', 'Tình trạng', 'Thanh toán', 'Giá trị', 'Ngày tạo']}
          rows={entities?.map((orderData) => {
            const { order_id, order_pnr, order_status, order_total_price, payment_status, createdAt } = orderData;
            return [
              <Link url={'/order/' + order_id}>{order_pnr}</Link>,
              <Badge tone={getOrderBadge(order_status)}>{orderStatus[order_status]}</Badge>,
              <Badge tone={payment_status === 0 ? 'new' : 'success'} progress={payment_status === 1 ? 'complete' : 'incomplete'}>
                {payment_status === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'}
              </Badge>,
              order_total_price,
              helpers.subtractDate(createdAt, ' ngày trước'),
            ];
          })}
          hideScrollIndicator
          hasZebraStripingOnData
          increasedTableDensity
        />
        {data?.totalItems > 5 && <LegacyCard.Section subdued>Bạn có {data.totalItems} đơn hàng</LegacyCard.Section>}
      </LegacyCard>
    );
  };
  return (
    <div>
      {isLoading && (
        <>
          <SkeletonBodyText />
          <SkeletonBodyText />
        </>
      )}
      {isSuccess && entities.length < 1 ? (
        <Card>
          <EmptyState image={product_placeholder} heading="Bạn chưa có đơn nào cả!">
            Mọi đơn hàng khi bạn mua sắm sẽ được liệt kê tại đây!
          </EmptyState>
        </Card>
      ) : (
        <DataList />
      )}
    </div>
  );
}
