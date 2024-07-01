import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useGetCurrentUserData, TypedUser } from "./queries/user.query";
import __helpers from "./helpers";
import helpers from "./helpers";

interface AuthContextType {
  user: TypedUser | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TypedUser | null>(null);
  const [start_display_children, setStart_display_children] = useState(false);

  const {
    data,
    error,
    refetch: recheckUserLoginornot,
    isLoading,
    isFetched,
  } = useGetCurrentUserData();

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
    if (hash && hash.includes("oauth_access_token=")) {
      let access_token = hash.replace("#oauth_access_token=", "");
      if (access_token) helpers.cookie_set("AT", access_token, 30);
      window.location.hash = "sso_success";
      recheckUserLoginornot();
    }
  }, [hash, recheckUserLoginornot]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isAuthenticating: isLoading }}
    >
      {start_display_children && children}
    </AuthContext.Provider>
  );
};

/** return {user: TypedUser | null, isAuthenticated: boolean, isAuthenticating: boolean} */
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
