import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../AuthContext";
import "media/css/welcomepage.scss";
import heroBG from "media/images/hero-bg.png";

export default function WelcomePage() {
  let REACT_APP_CLIENT_PUBLIC_KEY = process.env.REACT_APP_CLIENT_PUBLIC_KEY;
  let REACT_APP_FRONT_END_URL = process.env.REACT_APP_FRONT_END_URL;

  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <div className="welcomepage">
        <header className="header">
          <nav className="navbar">
            <h2 className="logo">
              <a href="/">TN MALL</a>
            </h2>
          </nav>
        </header>
        <section className="hero-section">
          <div className="hero">
            <h2>MỘT BƯỚC TIẾN VĨ ĐẠI</h2>
            <p>
              Nhiều ưu đãi cho những người tiên phong, bấm vào nút BẮT ĐẦU, và
              chúng tôi sẽ đưa bạn tới gần hơn với thành công.
            </p>
            <div className="buttons">
              <a
                href={`${REACT_APP_FRONT_END_URL}/login/sso?app_id=${REACT_APP_CLIENT_PUBLIC_KEY}`}
                className="join"
              >
                BẮT ĐẦU
              </a>
            </div>
          </div>
          <div className="img">
            <img src={heroBG} alt="hero background" />
          </div>
        </section>
      </div>
    </>
  );
}
