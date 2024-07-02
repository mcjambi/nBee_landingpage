import React, { useState, useCallback, useEffect } from 'react';
import { LegacyCard, EmptyState, Card, InlineGrid, Icon, Text, Divider, Button } from '@shopify/polaris';
import { PersonExitIcon, UnknownDeviceIcon, MobileIcon, DesktopIcon } from '@shopify/polaris-icons';
import SkeletonLoading from 'components/skeletonPageLoading';
import { TypedSession, useDeleteSession, useGetSessions } from 'queries/session.query';
import __ from 'languages/index';
import __helpers from 'helpers/index';

export default function UserLoginHistory({ user_id }) {
  // const entities = useAppSelector((state) => state.session.entities);
  // const sessionLoading = useAppSelector((state) => state.session.loading);

  const { mutateAsync: deleteEntity } = useDeleteSession();

  const {
    data,
    refetch: getSessionList,
    isLoading,
  } = useGetSessions({
    user_id: user_id,
    limit: 40,
    page: 1,
  });

  const [sessions, setSessions] = useState(null);
  useEffect(() => {
    if (data) {
      let { body, totalItems } = data;
      setSessions(body);
    }
  }, [data]);

  useEffect(() => {
    getSessionList();
  }, []);

  const logOutMe = useCallback(
    (session_id: bigint | string | number) => {
      deleteEntity(session_id);
      let n = sessions.filter((el) => {
        return el.session_id !== session_id;
      });
      setSessions(n);
    },
    [sessions]
  );

  const emptyData = (
    <EmptyState heading="Người này chưa đăng nhập bao giờ!" image={null}>
      <p>Check it back!</p>
    </EmptyState>
  );

  function getICON(n: string) {
    n = String(n || 'unknown').toLowerCase();
    switch (n) {
      case 'website':
      case 'desktop':
        return DesktopIcon;
      case 'mobile':
      case 'app':
      case 'ios':
      case 'android':
        return MobileIcon;
      default:
        return UnknownDeviceIcon;
    }
  }

  const showListElement = (sessions: TypedSession[]) => {
    return sessions.map((s, index) => {
      const { session_id, session_active, session_ip, updatedAt, device } = s;

      return (
        <React.Fragment key={session_id}>
          <InlineGrid columns="auto 1fr auto" alignItems="center">
            <div className="big-icon">
              <Icon source={getICON(device?.system_type)} />
            </div>
            <div>
              <Text as="h2" variant="headingSm">
                {device?.system_type} - {__helpers.subtractTimeHistory(updatedAt)} - {session_ip}
              </Text>
              <Text as="p" variant="bodyMd">
                {device?.user_agent}
              </Text>
            </div>
            {session_active ? (
              <Button onClick={() => logOutMe(session_id)} accessibilityLabel={__('logout')} icon={PersonExitIcon}>
                {__('logout')}
              </Button>
            ) : (
              'Deactive'
            )}
          </InlineGrid>

          {index < sessions.length - 1 && (
            <>
              <Divider borderColor="transparent" borderWidth="100" />
              <Divider borderColor="transparent" borderWidth="100" />
              <Divider borderColor="border-disabled" borderWidth="0165" />
              <Divider borderColor="transparent" borderWidth="100" />
              <Divider borderColor="transparent" borderWidth="100" />
            </>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <LegacyCard>{sessions && sessions.length > 0 ? <Card roundedAbove="sm">{showListElement(sessions)}</Card> : emptyData}</LegacyCard>
      )}
    </>
  );
}
