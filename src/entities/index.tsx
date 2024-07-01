import { useAuth } from "../AuthContext";
import { Helmet } from "react-helmet-async";
import WelcomePage from "./welcomepage";
import Homepage from "./homepage";
import AppFrame from "layout/appFrame";

export default function Index() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      {isAuthenticated ? (
        <AppFrame>
          <Homepage />
        </AppFrame>
      ) : (
        <WelcomePage />
      )}
    </>
  );
}
