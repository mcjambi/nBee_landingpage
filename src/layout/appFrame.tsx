import { FooterHelp, Frame, Link, Loading, Navigation, Toast, Text, TopBar, Divider, BlockStack, Icon } from '@shopify/polaris';
import { HomeIcon, QuestionCircleIcon, EmailIcon, NotificationIcon, FlowerIcon, MoneyIcon, OrderIcon } from '@shopify/polaris-icons';
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
import { useIsFetching } from '@tanstack/react-query';
import { useNotification } from 'NotificationContext';
import useRefreshTokenHelper from 'components/useRefreshTokenHelper';

// How many queries are fetching?
export default function AppFrame({ children }: any) {
  const skipToContentRef = useRef<HTMLAnchorElement>(null);

  /** refresh outdate token */
  useRefreshTokenHelper();

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
          content: 'Profile của tôi',
          onAction: () => history('/profile'),
          icon: ProfileIcon,
        },
        {
          content: 'Trung tâm trợ giúp',
          onAction: () => history('/help_center'),
          icon: QuestionCircleIcon,
        },
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
      actions={isAuthenticated ? userMenuActions : []}
      name={user?.display_name || 'Khách truy cập'}
      detail={user?.user_role}
      initials={String(user?.display_name || user?.user_email || user?.user_login || 'unknown').charAt(0)}
      open={userMenuActive}
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
          },
        ]}
      />
      <Navigation.Section
        separator
        title="Công cụ"
        items={[
          {
            url: '/profile',
            label: 'Thông tin của tôi',
            icon: ProfileIcon,
          },
          {
            url: '/my_order',
            label: 'Các đơn hàng',
            icon: OrderIcon,
          },
          {
            url: '/my_finance',
            label: 'Tài chính',
            icon: MoneyIcon,
          },
          {
            url: '/my_help_center',
            label: 'Trung tâm trợ giúp',
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
    topBarSource: 'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
    contextualSaveBarSource: 'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
    accessibilityLabel: 'Shopify',
  };

  /** GLobal Loading */
  const isFetching = useIsFetching();
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

      {isFetching > 0 && <Loading />}
      {isAuthenticated && (
        <SidebarPopup title="Thông báo" show={showNotification} onClose={() => setShowNotification(false)}>
          <NotificationLog show={showNotification} />
        </SidebarPopup>
      )}
      {children}
    </Frame>
  );
}
