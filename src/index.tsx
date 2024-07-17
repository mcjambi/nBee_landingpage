import React from 'react';
import ReactDOM from 'react-dom/client';
import './media/css/App.scss';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import '@shopify/polaris/build/esm/styles.css';
import viTranslations from '@shopify/polaris/locales/vi.json';
import { AppProvider } from '@shopify/polaris';

import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Link as ReactRouterLink } from 'react-router-dom';
import Homepage from './entities';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Template404 from './layout/404';
import AppFrame from './layout/appFrame';
import queryClient from './queries';
import HelpCenter from 'entities/help_center/help_center';
import { NotificationProvider } from 'NotificationContext';
import { AxiosInterceptor } from 'config/axios.config';
import Profile from 'entities/user-profile/profile';
import EditMyProfile from 'entities/user-profile/edit-my-profile';
import Login from 'layout/login';
import QuickLogin from 'layout/quick.login';
import AddReferrer from 'layout/add_referrer.account';
import ActiveAccount from 'layout/active.account';
import Register from 'layout/register';
import RecoverPasswordComponent from 'layout/recover-password';
import Orders from 'entities/order';
import MyReferrer from 'entities/my_referrer';
import MyWallet from 'entities/my_wallet';
import MyHelpCenter from 'entities/my_help_center';
import EDUCenter from 'entities/edu_center';
import Gamification from 'entities/game';
import News from 'entities/news';

const baseHref = document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '');

const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;
function NtsLink({ children, url, external, ...rest }) {
  if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
    rest.rel = 'noopener noreferrer nofollow';
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <ReactRouterLink to={url} {...rest}>
      {children}
    </ReactRouterLink>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <AppProvider i18n={viTranslations} linkComponent={NtsLink}>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider axiosInterceptors={AxiosInterceptor}>
        <HelmetProvider>
          <React.StrictMode>
            <AuthProvider>
              <BrowserRouter basename={baseHref}>
                <Routes>
                  <Route
                    key={'home'}
                    path={'/'}
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <Homepage />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    key={'news'}
                    path={'/news'}
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <News />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    key={'news_view'}
                    path={'/news/:slug'}
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <News />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    key={'my_referrer'}
                    path="/my_referrer"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <MyReferrer />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    key={'profile_user_id'}
                    path="/profile/:user_id"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <Profile />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    key={'my_order'}
                    path="/order"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <Orders />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    key={'my_order_detail'}
                    path="/order/view/:slug"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <Orders />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    key={'my_wallet'}
                    path="/my-wallet"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <MyWallet />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    key={'my_wallet_in_detail'}
                    path="/my-wallet/:wallet_slug"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <MyWallet />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    key={'edit-my-profile'}
                    path="/edit-my-profile"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <EditMyProfile />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    key={'my_help_center_view'}
                    path="/my_help_center/:slug/:contactform_id"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <MyHelpCenter />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    key={'my_help_center'}
                    path="/my_help_center"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <MyHelpCenter />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    key={'edu_view_detail'}
                    path="/edu/:slug/:course_slug"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <EDUCenter />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    key={'edu_view'}
                    path="/edu/:slug"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <EDUCenter />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    key={'edu'}
                    path="/edu"
                    element={
                      <ProtectedRoute>
                        <AppFrame>
                          <EDUCenter />
                        </AppFrame>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    key={'gamification'}
                    path="/game"
                    element={
                      <ProtectedRoute>
                        <Gamification />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    key={'gamification_detail'}
                    path="/game/:slug"
                    element={
                      <ProtectedRoute>
                        <Gamification />
                      </ProtectedRoute>
                    }
                  />

                  <Route key={'login'} path="/login" element={<Login />} />
                  <Route key={'login_sso'} path="/login/sso" element={<Login />} />
                  <Route key={'login_facebook'} path="/login/facebook" element={<Login />} />
                  <Route key={'quick_login'} path="/quick-login/:token" element={<QuickLogin />} />
                  <Route key={'active_account'} path="/active-account" element={<ActiveAccount />} />
                  <Route key={'add_referrer'} path="/add-referrer" element={<AddReferrer />} />
                  <Route key={'register'} path="/register" element={<Register />} />
                  <Route key={'recover_password'} path="/recover_password" element={<RecoverPasswordComponent />} />

                  <Route key={'help_center_slug'} path="/help_center/:slug" element={<HelpCenter />} />

                  <Route key={'help_center'} path="/help_center" element={<HelpCenter />} />

                  <Route key={'all_at_end'} path="*" element={<Template404 />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </React.StrictMode>
        </HelmetProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </AppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
