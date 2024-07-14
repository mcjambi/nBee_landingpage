import GlobalProgressingBar from 'components/GlobalProgressingBar';
import UserSignComponent from 'components/userSign';
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

type GLobalNotificationElement = {
  id?: string;
  message: string;
  type: 'info' | 'error';
};

type TypedGlobalNotification = {
  addNotification: (type: 'info' | 'error', message: string) => any;
  clearNotification: (id: string) => void;
  notification: GLobalNotificationElement;
};
const NotificationContext = createContext<TypedGlobalNotification | undefined>(undefined);

/**
 * Add notification using: addNotification('error' | 'info, content: string);
 * @returns
 */
export const useNotification = (): TypedGlobalNotification => useContext(NotificationContext);

/**
 * GLobal Notification ...
 * @param param0
 * @returns
 */
export const NotificationProvider = ({
  children,
  axiosInterceptors,
}: {
  children: any;
  axiosInterceptors?: (onStatus: (status: number) => void, onError: (error: string) => void, onLoading: (loading: boolean) => void) => void;
}) => {
  const [notifications, setNotifications] = useState([]);
  const [notification, setNotification] = useState(null);

  const [showUserSignModal, setShowUserSignModal] = useState(false);

  useEffect(() => {
    if (notifications.length < 1) setNotification(null);
    setNotification(notifications.at(-1));
  }, [notifications]);

  const addNotification = (type: 'info' | 'error' = 'info', message: string) => {
    const id = new Date().getTime();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 5000); // Remove after 5 seconds
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInterceptors(
      (status) => {
        // console.log(status, '<<< AXIOS Status');
        if (status === 412) setShowUserSignModal(true);
      },
      (error: string) => {
        // console.log(error, 'AXIOS call ERROR');
        addNotification('error', error);
      },
      (loading: boolean) => {
        setLoading(loading);
      }
    );
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const hideSignModal = useCallback(() => {
    setShowUserSignModal(false);
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, clearNotification, notification }}>
      <GlobalProgressingBar show={loading} />
      <UserSignComponent show={showUserSignModal} onClose={hideSignModal} />
      {children}
    </NotificationContext.Provider>
  );
};
