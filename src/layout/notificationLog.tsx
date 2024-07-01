import helpers from "helpers/index";
import { Avatar, Text } from "@shopify/polaris";
import dateandtime from "date-and-time";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "AuthContext";
import { useGetNotifications } from "queries/notification.query";
import "media/css/notificationCenter.scss";

export default function NotificationLog({ show }: { show: boolean }) {
  const { user: account } = useAuth();

  const {
    data: entities,
    isLoading: loading,
    refetch: loadData,
  } = useGetNotifications({
    sort: "createdAt:desc",
    notification_user: account.user_id,
    limit: 100,
  });

  useEffect(() => {
    if (!show) return;
    loadData();
  }, [show]);

  const [todayNotification, setTodayNotification] = useState([]);
  const [otherdayNotification, setOtherdayNotification] = useState([]);

  useEffect(() => {
    if (!entities) return;
    let t = dateandtime.format(new Date(), "YYYYMMDD");
    let td = [];
    let tmr = [];
    for (let el of entities) {
      let n = dateandtime.format(new Date(Number(el.createdAt)), "YYYYMMDD");
      if (n === t) {
        td.push(el);
      } else {
        tmr.push(el);
      }
    }

    setTodayNotification(td);
    setOtherdayNotification(tmr);
  }, [entities]);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          Loading...
        </div>
      ) : (
        <div className="notification_wrap">
          <div className="notification_heading">Hôm nay</div>
          {todayNotification.length < 1 ? (
            <div style={{ padding: "15px", textAlign: "center" }}>
              <Text as="p">Không có thông báo nào...</Text>
            </div>
          ) : (
            todayNotification?.map((el, index) => {
              let url = "javascript:void(0)";
              try {
                url = JSON.parse(el.notification_data).click_action;
              } catch (e) {}
              return (
                <a
                  href={url}
                  className="notification_element"
                  key={index + "_notification"}
                >
                  <div className="notification_avatar">
                    <Avatar
                      source={null}
                      size="sm"
                      name="Avatar"
                      initials="H"
                    />
                  </div>
                  <div className="notification_body">
                    <div className="l1">
                      <strong>{el.notification_title}</strong>:{" "}
                      {el.notification_content}
                    </div>
                    <div className="l2">
                      {helpers.subtractTimeHistory(el.createdAt)}
                    </div>
                  </div>
                </a>
              );
            })
          )}

          <div className="notification_heading">Trước đó</div>
          {otherdayNotification.length < 1 ? (
            <div style={{ padding: "15px", textAlign: "center" }}>
              <Text as="p">Không có thông báo nào...</Text>
            </div>
          ) : (
            otherdayNotification?.map((el, index) => {
              let url = "javascript:void(0)";
              try {
                url = JSON.parse(el.notification_data).click_action;
              } catch (e) {}
              return (
                <a
                  href={url}
                  className="notification_element"
                  key={index + "_notification"}
                >
                  <div className="notification_avatar">
                    <Avatar
                      source={null}
                      size="sm"
                      name="Avatar"
                      initials="H"
                    />
                  </div>
                  <div className="notification_body">
                    <div className="l1">
                      <strong>{el.notification_title}</strong>:{" "}
                      {el.notification_content}
                    </div>
                    <div className="l2">
                      {helpers.subtractTimeHistory(el.createdAt)}
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>
      )}
    </>
  );
}
