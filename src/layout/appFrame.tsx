import {
  FooterHelp,
  Frame,
  Link,
  Loading,
  Navigation,
  Toast,
  Text,
  TopBar,
  Divider,
  BlockStack,
} from "@shopify/polaris";
import {
  HomeIcon,
  QuestionCircleIcon,
  EmailIcon,
} from "@shopify/polaris-icons";
import { useState, useCallback, useRef } from "react";
import { useAuth } from "../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ProfileIcon, ExitIcon } from "@shopify/polaris-icons";
import helpers from "../helpers";
import { useUserLogout } from "../queries/user.query";
import __, { ___ } from "languages/index";
import { default as packageInformation } from "../../package.json";

export default function AppFrame({ children }: any) {
  const skipToContentRef = useRef<HTMLAnchorElement>(null);

  const { user, isAuthenticated } = useAuth();
  const history = useNavigate();
  const { mutateAsync: logOut } = useUserLogout();

  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    []
  );
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );

  const logMeOutCallback = useCallback(async () => {
    helpers.cookie_delete("AT");
    await logOut();
  }, []);

  const userMenuActions = [
    {
      items: [
        {
          content: "Chỉnh sửa thông tin",
          onAction: () => history("/my_profile"),
          icon: ProfileIcon,
        },
        {
          content: "Trung tâm trợ giúp",
          onAction: () => history("/help_center"),
          icon: QuestionCircleIcon,
        },
        {
          content: "Đăng xuất",
          onAction: logMeOutCallback,
          icon: ExitIcon,
        },
      ],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={isAuthenticated ? userMenuActions : []}
      name={user?.display_name || "Khách truy cập"}
      detail={user?.user_role}
      initials={String(
        user?.display_name || user?.user_email || user?.user_login || "unknown"
      ).charAt(0)}
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  const version = packageInformation.version;
  const polarisVersion =
    packageInformation["dependencies"]["@shopify/polaris"] || "";

  const location = useLocation();

  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={[
          {
            url: "/",
            label: "Trang chủ",
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
            url: "/my_profile",
            label: "Thông tin của tôi",
            icon: EmailIcon,
            subNavigationItems: [
              {
                url: "/email_setting",
                label: "Tài khoản",
              },
              {
                url: "/email_template",
                label: "Biểu mẫu",
              },
            ],
          },
        ]}
      />

      <Navigation.Section fill items={[]} />

      <div style={{ padding: "10px" }}>
        <BlockStack align="center" inlineAlign="start" gap={"200"}>
          <Text as="p" variant="bodyXs" tone="subdued">
            NBEE CRM &copy;2022, version {version}
            <br />
            Polaris {polarisVersion}
          </Text>
          <Text as="p" variant="bodyXs" tone="subdued">
            {___("footer_text: need help? Go to {help_center_link}", {
              help_center_link: (
                <Link url="/help_center">{__("help_center_text")}</Link>
              ),
            })}
          </Text>
          <div style={{ marginBottom: 5, marginTop: 5 }}></div>
        </BlockStack>
      </div>
    </Navigation>
  );

  const logo = {
    width: 86,
    topBarSource:
      "https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png",
    contextualSaveBarSource:
      "https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png",
    accessibilityLabel: "Shopify",
  };

  return (
    <Frame
      logo={logo}
      topBar={topBarMarkup}
      navigation={isAuthenticated ? navigationMarkup : []}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef}
    >
      {children}
    </Frame>
  );
}
