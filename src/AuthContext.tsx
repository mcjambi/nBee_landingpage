import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useGetCurrentUserData, TypedUser } from './queries/user.query';
import __helpers from './helpers';
import useRefreshTokenHelper from 'components/useRefreshTokenHelper';
import { useGetSetting } from 'queries/setting.query';
import ActiveMyAccount from 'components/activeAccountModal';

interface AuthContextType {
  user: TypedUser | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TypedUser | null>(null);
  const [start_display_children, setStart_display_children] = useState(false);

  /** refresh outdate token */
  useRefreshTokenHelper();

  const { mutateAsync: getSetting } = useGetSetting();
  const { data, error, refetch: recheckUserLoginornot, isLoading, isFetched } = useGetCurrentUserData();

  const startSetData = useCallback(async () => {
    if (data) {
      setUser(data);
    }
    if (error) {
      setUser(null);
    }
    await __helpers.sleep(1000);
    setStart_display_children(true);
  }, [data, error]);

  useEffect(() => {
    if (isFetched) startSetData();
  }, [isFetched, startSetData]);

  /** SSO Module  */
  const hash = window.location.hash;
  useEffect(() => {
    if (hash && hash.includes('oauth_access_token=')) {
      let access_token = hash.replace('#oauth_access_token=', '');
      if (access_token) __helpers.cookie_set('AT', access_token, 30);
      window.location.hash = 'sso_success';
      recheckUserLoginornot();
    }
  }, []);

  const [showActiveMyAccount, setShowActiveMyAccount] = useState(false);
  useEffect(() => {
    if (user && user.user_verified_email === 0 && user.user_verified_phone === 0) {
      getSetting('must_validated_account')
        .then(({ setting_value }) => {
          setTimeout(() => {
            if (setting_value === '1') setShowActiveMyAccount(true);
          }, 4000);
        })
        .catch((e) => {});
    }
  }, [getSetting, user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAuthenticating: isLoading }}>
      <ActiveMyAccount show={showActiveMyAccount} />
      {start_display_children && children}
    </AuthContext.Provider>
  );
};

/** return {user: TypedUser | null, isAuthenticated: boolean, isAuthenticating: boolean} */
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
