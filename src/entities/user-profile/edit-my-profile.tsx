import { BlockStack, LegacyCard, Page, SkeletonTabs, Tabs, Text } from '@shopify/polaris';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import __ from 'languages/index';
import UserLoginHistory from './components/user.login.history';
import EditMyInformation from './components/EditMyInformation';
import ChangeMyPassword from './components/ChangeMyPassword';
import { Helmet } from 'react-helmet-async';
import { useAuth } from 'AuthContext';

export default function EditMyProfile() {
  const { user: entity } = useAuth();
  const history = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    history(`/edit-my-profile`);
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
        content: 'Bảo mật',
        panelID: 'user_password',
      },
      {
        id: 'tab_2',
        content: 'Lịch sử đăng nhập',
        panelID: 'user_login_history',
      },
    ],
    []
  ); // Empty dependency array means this will only run once on mount

  useEffect(() => {
    if (hash) {
      let tabb = Number(String(hash || ' ').replace('#tab-', ''));
      if (tabs[tabb] === undefined) tabb = 0;
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
          {/* <UserGeneralInformation /> */}

          {loading ? (
            <LegacyCard>
              <SkeletonTabs />
            </LegacyCard>
          ) : (
            <div className="custom_tabs" style={{ margin: '0 -15px' }}>
              <Tabs tabs={tabs} selected={tabselected} onSelect={handleTabChange}></Tabs>
              <div style={{ margin: '15px' }}>
                {tabs[tabselected].panelID === 'edit_user_account' && <EditMyInformation />}
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
