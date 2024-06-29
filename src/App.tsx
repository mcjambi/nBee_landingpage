import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.scss";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import helpers from "./helpers";
import { useAuth } from "./AuthContext";

export default function App() {
  let REACT_APP_CLIENT_PUBLIC_KEY = process.env.REACT_APP_CLIENT_PUBLIC_KEY;
  let REACT_APP_FRONT_END_URL = process.env.REACT_APP_FRONT_END_URL;

  let history = useNavigate();

  const { isAuthenticated, isAuthenticating } = useAuth();

  useEffect(() => {
    if (isAuthenticated) history("/home");
  }, [isAuthenticated]);

  return (
    <>
      <Helmet>
        <title>nBee Landing page</title>
      </Helmet>
      <div className="Homepage">
        <header className="Homepage-header">
          <img src={logo} className="Homepage-logo" alt="logo" />

          {isAuthenticating ? (
            <p>Đang tải nội dung ...</p>
          ) : isAuthenticated ? (
            <>Đăng nhập thành công, eiii </>
          ) : (
            <p>
              Xin chào bạn,{" "}
              <a
                href={`${REACT_APP_FRONT_END_URL}/login/sso?app_id=${REACT_APP_CLIENT_PUBLIC_KEY}`}
                target="_blank"
                rel="noreferrer"
                className="Homepage-link"
              >
                đăng nhập
              </a>
            </p>
          )}
        </header>
      </div>
    </>
  );
}
