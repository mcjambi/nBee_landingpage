import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { TypedUser, useGetCurrentUserData } from "./query/user.query";
import { useLocation } from "react-router-dom";
import helpers from "./helpers";

interface AuthContextType {
  user: TypedUser | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TypedUser | null>(null);

  const { data, error, isLoading, refetch } = useGetCurrentUserData();

  useEffect(() => {
    if (data) {
      setUser(data);
    } else if (error) {
      setUser(null);
    }
  }, [data, error]);

  let hash = window.location.hash;

  useEffect(() => {
    if (hash) {
      let access_token = hash.replace("#oauth_access_token=", "");
      if (access_token) helpers.cookie_set("AT", access_token, 30);
      refetch();
    }
  }, [hash, refetch]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isAuthenticating: isLoading }}
    >
      {!isLoading && children}
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
