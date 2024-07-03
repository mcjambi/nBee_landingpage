import { BlockStack, Box, Card, InlineGrid, Page, SkeletonBodyText, SkeletonTabs, Tabs } from '@shopify/polaris';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import __ from 'languages/index';
import UserLoginHistory from './components/user.login.history';
import EditMyInformation from './components/EditMyInformation';
import ChangeMyPassword from './components/ChangeMyPassword';
import { Helmet } from 'react-helmet-async';
import { useAuth } from 'AuthContext';
import UserFinance from './components/UserFinance';

export default function EditMyProfile() {
  const { user: entity } = useAuth();
  const history = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  let { hash } = useLocation();
  const [tabselected, setTabselected] = useState(0);

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    window.location.hash = '#tab-' + selectedTabIndex;
  }, []);

  const tabs = useMemo(
    () => [
      {
        id: 'tab_0',
        content: 'Chỉnh sửa tài khoản',
        panelID: 'edit_user_account',
      },
      {
        id: 'tab_1',
        content: 'Thông tin thanh toán',
        panelID: 'user_finance',
      },
      {
        id: 'tab_2',
        content: 'Bảo mật',
        panelID: 'user_password',
      },
      {
        id: 'tab_3',
        content: 'Lịch sử đăng nhập',
        panelID: 'user_login_history',
      },
    ],
    []
  ); // Empty dependency array means this will only run once on mount

  useEffect(() => {
    if (hash && hash.includes('tab-')) {
      let tabb = Number(String(hash || ' ').replace('#tab-', ''));
      setTabselected(tabb);
    } else {
      setTabselected(0);
    }
  }, [hash, tabs]);

  return (
    <>
      <Helmet>
        <title>Cài đặt tài khoản của bạn</title>
      </Helmet>
      <Page
        backAction={{
          onAction: () => history('/'),
          content: 'Back to Homepage',
        }}
        title="Chỉnh sửa tài khoản"
      >
        <BlockStack gap="400">
          {loading ? (
            <>
              <Card padding={'0'}>
                <SkeletonTabs />
              </Card>
              <br />
              <BlockStack gap={{ xs: '800', sm: '400' }}>
                <InlineGrid columns={{ xs: '1fr', md: '2fr 5fr' }} gap="400">
                  <Box as="section" paddingInlineStart={{ xs: '400', sm: '0' }} paddingInlineEnd={{ xs: '400', sm: '0' }}>
                    <SkeletonBodyText />
                  </Box>
                  <Card roundedAbove="sm">
                    <BlockStack gap="400">
                      <SkeletonBodyText />
                    </BlockStack>
                  </Card>
                </InlineGrid>
              </BlockStack>
            </>
          ) : (
            <div className="custom_tabs" style={{ margin: '0 -15px' }}>
              <Tabs tabs={tabs} selected={tabselected} onSelect={handleTabChange}></Tabs>
              <div style={{ margin: '15px' }}>
                {tabs[tabselected].panelID === 'edit_user_account' && <EditMyInformation />}
                {tabs[tabselected].panelID === 'user_finance' && <UserFinance />}
                {tabs[tabselected].panelID === 'user_password' && <ChangeMyPassword />}
                {tabs[tabselected].panelID === 'user_login_history' && <UserLoginHistory user_id={entity?.user_id} />}
              </div>
            </div>
          )}
        </BlockStack>
      </Page>
    </>
  );
}
