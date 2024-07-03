import { Helmet } from 'react-helmet-async';
import 'media/css/welcomepage.scss';
import heroBG from 'media/images/hero-bg.png';
import { useEffect } from 'react';

export default function WelcomePage() {
  useEffect(() => {
    document.getElementById('root').style.display = 'block';
    document.getElementById('before_load').style.display = 'none';
    document.getElementById('before_load').style.width = '0';
    document.getElementById('before_load').style.height = '0';
  }, []);

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
            <p>Nhiều ưu đãi cho những người tiên phong, bấm vào nút BẮT ĐẦU, và chúng tôi sẽ đưa bạn tới gần hơn với thành công.</p>
            <div className="buttons">
              <a href={`/login`} className="join">
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
