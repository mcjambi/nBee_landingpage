import { useAuth } from '../AuthContext';
import { Helmet } from 'react-helmet-async';
import WelcomePage from './welcomepage';
import AppFrame from 'layout/appFrame';
import MyProfile from './user-profile/profile';

export default function Index() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      {isAuthenticated ? (
        <AppFrame>
          <MyProfile />
        </AppFrame>
      ) : (
        <WelcomePage />
      )}
    </>
  );
}
