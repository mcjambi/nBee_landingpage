import React from "react";
import "../media/css/404.scss";

export default function Template404() {
  return (
    <div id="wrap_404">
      <h1>404</h1>
      <div className="cloak__wrapper">
        <div className="cloak__container">
          <div className="cloak"></div>
        </div>
      </div>
      <div className="info">
        <h2>Không tìm thấy thông tin</h2>
        <p>Chúng tôi đã tìm thông tin bạn yêu cầu, nhưng nó không có ở đây.</p>
        <a href="/" rel="noreferrer noopener">
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
}
