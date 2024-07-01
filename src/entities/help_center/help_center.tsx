import {
  ActionList,
  BlockStack,
  Box,
  Button,
  Divider,
  Image,
  InlineGrid,
  InlineStack,
  Page,
  Popover,
  Text,
} from "@shopify/polaris";
import __, { ___ } from "languages/index";
import {
  PlusIcon,
  LanguageTranslateIcon,
  LanguageIcon,
} from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import "media/css/vertical-menu.scss";
import "media/css/help.scss";
import QuickContactForm from "./quick.contact";
import PageLoader from "./page.loader";

const helpBanner = require("media/images/help-banner.png");

export default function HelpCenter() {
  const [languagePopoverStatus, setLanguagePopoverStatus] = useState(false);
  const toggleLanguagePopoverActive = useCallback(
    () => setLanguagePopoverStatus((active) => !active),
    []
  );
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    localStorage.getItem("language") || "vi"
  );

  const setDefaultLanguage = useCallback((lang_code: string) => {
    localStorage.setItem("language", lang_code);
    setLanguagePopoverStatus(false);
    setCurrentLanguage(lang_code);
  }, []);
  const { search } = useLocation();
  useEffect(() => {
    setTimeout(() => {
      if (search) {
        let u = new URLSearchParams(search);
        if (u.get("lang")) {
          setDefaultLanguage(u.get("lang"));
        }
      }
    }, 500);
  }, [search]);

  const { slug = "home" } = useParams();

  return (
    <div id="help-wrap">
      <Page>
        <h3
          style={{ fontSize: "2em", marginBottom: "15px" }}
          key={"help_main_title"}
        >
          {__("help_center_title")}
        </h3>
        <InlineStack blockAlign="center" gap="200" key={"help_change_language"}>
          <Text as="span" key={"iuytiu"}>
            {___("This page displaying in {current_language}", {
              current_language: <Text as="span">{__(currentLanguage)}</Text>,
            })}
          </Text>
          <Popover
            active={languagePopoverStatus}
            activator={
              <Button
                onClick={toggleLanguagePopoverActive}
                disclosure
                variant="plain"
                icon={LanguageTranslateIcon}
              >
                {__("switch_language_button")}
              </Button>
            }
            autofocusTarget="first-node"
            onClose={toggleLanguagePopoverActive}
          >
            <ActionList
              actionRole="menuitem"
              items={[
                {
                  content: "Vietnamese",
                  onAction: () => setDefaultLanguage("vi"),
                  icon: LanguageIcon,
                },
                {
                  content: "English",
                  onAction: () => setDefaultLanguage("en"),
                  icon: LanguageIcon,
                },
              ]}
            />
          </Popover>
        </InlineStack>

        <br />
        <br />

        <InlineGrid columns={{ md: ["oneThird", "twoThirds"] }}>
          <Box>
            <div id="vertical-menu">
              <BlockStack
                gap="500"
                role="menu"
                // id="vertical-menu"
              >
                <NavLink
                  to={"/help_center"}
                  className={({ isActive, isPending }) => {
                    return (
                      "nav-item " +
                      (isPending ? "pending" : isActive ? "active" : "")
                    );
                  }}
                >
                  <Text as="span">{__("Home page")}</Text>
                </NavLink>
                <Divider />
                <NavLink
                  to={`/help_center/about-us?lang=${currentLanguage}`}
                  className={({ isActive, isPending }) => {
                    return (
                      "nav-item " +
                      (isPending ? "pending" : isActive ? "active" : "")
                    );
                  }}
                >
                  <Text as="span">{__("about_us_menu_title")}</Text>
                </NavLink>
                <Divider />
                <NavLink
                  to={`/help_center/tos?lang=${currentLanguage}`}
                  className={({ isActive, isPending }) => {
                    return (
                      "nav-item " +
                      (isPending ? "pending" : isActive ? "active" : "")
                    );
                  }}
                >
                  <Text as="span">{__("service_tos_menu_title")}</Text>
                </NavLink>
                <Divider />

                <NavLink
                  to={`/help_center/privacy-policy?lang=${currentLanguage}`}
                  className={({ isActive, isPending }) => {
                    return (
                      "nav-item " +
                      (isPending ? "pending" : isActive ? "active" : "")
                    );
                  }}
                >
                  <Text as="span">{__("security_tos_menu_title")}</Text>
                </NavLink>
                <Divider />

                <NavLink
                  to={`/help_center/delete-my-account?lang=${currentLanguage}`}
                  className={({ isActive, isPending }) => {
                    return (
                      "nav-item " +
                      (isPending ? "pending" : isActive ? "active" : "")
                    );
                  }}
                >
                  <Text as="span">{__("delete_my_account_menu_title")}</Text>
                </NavLink>
                <Divider />

                <NavLink
                  to={`/help_center/quick-contact?lang=${currentLanguage}`}
                  className={({ isActive, isPending }) => {
                    return (
                      "nav-item " +
                      (isPending ? "pending" : isActive ? "active" : "")
                    );
                  }}
                >
                  <Text as="span">{__("quick_contact_menu_title")}</Text>
                </NavLink>
                <Divider />
              </BlockStack>
            </div>
          </Box>

          <div className="help-wrap">
            {slug === "home" && (
              <>
                <div className="help-header">
                  <Image alt={""} source={helpBanner} />
                  <h1>{__(slug)}</h1>
                </div>
                <p>{__("welcome_to_help_desk_title")}</p>
                <p>
                  {___("Go back to {homepage_link}", {
                    homepage_link: <Link to="/">{__("homepage")}</Link>,
                  })}
                </p>
              </>
            )}
            <div className="help-content">
              {slug === "quick-contact" && <QuickContactForm />}
              {slug === "about-us" && <PageLoader slug="about-us" />}
              {slug === "tos" && <PageLoader slug="tos" />}
              {slug === "privacy-policy" && (
                <PageLoader slug="privacy-policy" />
              )}
              {slug === "delete-my-account" && (
                <PageLoader slug="delete-my-account" />
              )}
            </div>
          </div>
        </InlineGrid>
      </Page>
    </div>
  );
}
