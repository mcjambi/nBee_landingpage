import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BlockStack, Text, Box, InlineGrid, Page, Icon, Link, InlineStack, DataTable } from '@shopify/polaris';
import { useLocation, useParams } from 'react-router-dom';
import __helpers from 'helpers/index';
import { TypedUserTransaction, useGetMyOneWallet, useGetMyTransaction } from 'queries/user_wallet.query';
import Pagination from 'components/pagination';
import dataandtime from 'date-and-time';

export default function MyWallet() {
  let { wallet_slug = 'cash' } = useParams();
  let { search } = useLocation();

  const initialQuery = {
    query: '',
    page: 1,
    limit: 20,
    sort: 'createdAt:desc',
  };
  let StringQuery = __helpers.ExtractUrl(search) || false;

  const [mainQuery, setMainQuery] = useState({
    ...initialQuery,
    ...StringQuery,
    // ...stateProp
  });

  /**
   * Change page number
   */
  const onChangePageNumber = useCallback(
    (numPage: number, Limit: number) => {
      setMainQuery({ ...mainQuery, page: numPage, limit: Limit });
    },
    [mainQuery]
  );

  const { refetch: getEntities, data: transactionData } = useGetMyTransaction(wallet_slug, mainQuery);
  const { refetch: getEntity, data: walletData } = useGetMyOneWallet(wallet_slug);

  useEffect(() => {
    getEntity();
  }, []);

  const reduceRequest = useCallback((mainQuery) => {
    getEntities();
    return mainQuery;
  }, []);

  const reduceRequestMemo = useMemo(() => {
    return __helpers.debounce((_value) => {
      reduceRequest?.call(this, _value);
    }, 500);
  }, []);

  useEffect(() => {
    let buildURLSearch = __helpers.buildEndUrl(mainQuery);
    if (window.location.search !== buildURLSearch) {
      window.history.replaceState(null, 'My Wallet', `/my-wallet/${wallet_slug}` + buildURLSearch);
    }
    reduceRequestMemo(mainQuery);
  }, [mainQuery]);

  const [defaultWallet, setDefaultWallet] = useState(null);
  const [transactions, setTransactions] = useState<TypedUserTransaction[] | null>([]);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (walletData) {
      let { body, totalItems } = walletData;
      setDefaultWallet(body);
    }
  }, [walletData]);

  useEffect(() => {
    if (transactionData) {
      let { body, totalItems } = transactionData;
      setTransactions(body);
      setTotalItems(totalItems);
    }
  }, [transactionData]);

  return (
    <Page narrowWidth>
      <Box padding="400" background="bg-fill-active">
        <BlockStack gap="400">
          <InlineGrid alignItems="center">
            <Text as="p">Tài khoản chính</Text>
            <Text as="h3" variant="heading2xl">
              {__helpers.formatNumber(defaultWallet?.balance ?? 0)} {defaultWallet?.wallet_type?.wallet_unit}
            </Text>
          </InlineGrid>
        </BlockStack>
      </Box>
      <br />

      <DataTable
        columnContentTypes={['text', 'numeric', 'text', 'text', 'numeric']}
        headings={['Loại', '', 'Phương thức', 'Ghi chú', 'Ngày']}
        rows={
          Array.isArray(transactions)
            ? transactions?.map((transaction) => {
                return [
                  transaction.transaction_type,
                  transaction.amount,
                  transaction.transaction_category,
                  transaction.transaction_note,
                  dataandtime.format(new Date(Number(transaction.createdAt)), 'HH:mm:ss DD-MM-YYYY'),
                ];
              })
            : []
        }
      />

      {totalItems > mainQuery.limit ? (
        <Pagination TotalRecord={totalItems} activeCurrentPage={Number(mainQuery?.page)} pageSize={mainQuery?.limit} onChange={onChangePageNumber} />
      ) : null}
    </Page>
  );
}
