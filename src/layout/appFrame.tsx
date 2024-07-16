import { Frame, Link, Navigation, Toast, Text, TopBar, BlockStack, Icon } from '@shopify/polaris';
import { HomeIcon, QuestionCircleIcon, NotificationIcon, FlowerIcon, CollectionReferenceIcon, OrderIcon } from '@shopify/polaris-icons';
import main_logo from 'media/images/logo.svg';
import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileIcon, ExitIcon } from '@shopify/polaris-icons';
import helpers from '../helpers';
import { useUserLogout } from '../queries/user.query';
import __, { ___ } from 'languages/index';
import { default as packageInformation } from '../../package.json';
import SidebarPopup from './sidebarPopup';
import NotificationLog from './notificationLog';
// import { useIsFetching } from '@tanstack/react-query';
import { useNotification } from 'NotificationContext';

// How many queries are fetching?
export default function AppFrame({ children }: any) {
  const skipToContentRef = useRef<HTMLAnchorElement>(null);

  const { user, isAuthenticated } = useAuth();
  const history = useNavigate();
  const { mutateAsync: logOut } = useUserLogout();

  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const toggleUserMenuActive = useCallback(() => setUserMenuActive((userMenuActive) => !userMenuActive), []);
  const toggleMobileNavigationActive = useCallback(() => setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive), []);

  const logMeOutCallback = useCallback(async () => {
    helpers.cookie_delete('AT');
    await logOut();
  }, []);

  const userMenuActions = [
    {
      items: [
        {
          content: 'Chỉnh sửa thông tin',
          onAction: () => history('/edit-my-profile'),
          icon: ProfileIcon,
        },
        {
          content: 'Trung tâm trợ giúp',
          onAction: () => history('/help_center'),
          icon: QuestionCircleIcon,
        },
      ],
    },
    {
      items: [
        {
          content: 'Đăng xuất',
          onAction: logMeOutCallback,
          icon: ExitIcon,
        },
      ],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      customWidth="250px"
      actions={isAuthenticated ? userMenuActions : []}
      name={user?.display_name || 'Khách truy cập'}
      detail={user?.user_role}
      initials={String(user?.display_name || user?.user_email || user?.user_login || 'unknown').charAt(0)}
      open={userMenuActive}
      avatar={user?.user_avatar ?? null}
      onToggle={toggleUserMenuActive}
    />
  );
  const [showNotification, setShowNotification] = useState(false);

  const notificationSidebarMenuActivator = (
    <TopBar.Menu
      key="OpenNotification"
      activatorContent={
        <span>
          <Icon source={NotificationIcon} />
        </span>
      }
      open={false}
      actions={[]}
      onOpen={() => setShowNotification(true)}
      onClose={() => alert('close notification')}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={toggleMobileNavigationActive}
      secondaryMenu={isAuthenticated ? notificationSidebarMenuActivator : []}
    />
  );

  const version = packageInformation.version;
  const polarisVersion = packageInformation['dependencies']['@shopify/polaris'] || '';

  const location = useLocation();

  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={[
          {
            url: '/',
            label: 'Trang chủ',
            icon: HomeIcon,
            exactMatch: true,
            subNavigationItems: [
              {
                url: '/edit-my-profile',
                label: 'Chỉnh sửa tài khoản',
              },
              {
                url: '/my-wallet',
                label: 'Quản lý ví',
              },
            ],
          },
        ]}
      />
      <Navigation.Section
        separator
        title="Công cụ"
        items={[
          {
            url: '/my_referrer',
            label: 'Đội nhóm của bạn',
            icon: CollectionReferenceIcon,
          },
          {
            url: '/order',
            label: 'Các đơn hàng',
            icon: OrderIcon,
          },
          {
            url: '/my_help_center',
            label: 'Trung tâm liên hệ',
            icon: QuestionCircleIcon,
          },
          {
            url: '/edu',
            label: 'Trung tâm giáo dục',
            icon: FlowerIcon,
          },
        ]}
      />

      <Navigation.Section fill items={[]} />

      <div style={{ padding: '10px' }}>
        <BlockStack align="center" inlineAlign="start" gap={'200'}>
          <Text as="p" variant="bodyXs" tone="subdued">
            NBEE CRM &copy;2022, version {version}
            <br />
            Polaris {polarisVersion}
          </Text>
          <Text as="p" variant="bodyXs" tone="subdued">
            {___('footer_text: need help? Go to {help_center_link}', {
              help_center_link: <Link url="/help_center">{__('help_center_text')}</Link>,
            })}
          </Text>
          <div style={{ marginBottom: 5, marginTop: 5 }}></div>
        </BlockStack>
      </div>
    </Navigation>
  );

  const logo = {
    width: 86,
    topBarSource: main_logo,
    contextualSaveBarSource: main_logo,
    accessibilityLabel: 'Customer Care',
  };

  /** Global notification */
  const { notification, clearNotification } = useNotification();

  return (
    <Frame
      logo={logo}
      topBar={topBarMarkup}
      navigation={isAuthenticated ? navigationMarkup : []}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef}
    >
      {notification && (
        <Toast
          content={notification.message}
          duration={5000}
          onDismiss={() => clearNotification(notification.id)}
          error={notification.type === 'error'}
        />
      )}

      {isAuthenticated && (
        <SidebarPopup title="Thông báo" show={showNotification} onClose={() => setShowNotification(false)}>
          <NotificationLog show={showNotification} />
        </SidebarPopup>
      )}
      {children}
    </Frame>
  );
}
