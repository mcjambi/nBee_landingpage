import React from 'react';
import ReactDOM from 'react-dom/client';
import './media/css/App.scss';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import '@shopify/polaris/build/esm/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
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
  <AppProvider i18n={enTranslations} linkComponent={NtsLink}>
    <NotificationProvider axiosInterceptors={AxiosInterceptor}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <React.StrictMode>
            <AuthProvider>
              <BrowserRouter basename={baseHref}>
                <Routes>
                  <Route key={'home'} path={'/'} element={<Homepage />} />

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

                  <Route key={'help_center_slug'} path="/help_center/:slug" element={<HelpCenter />} />

                  <Route key={'help_center'} path="/help_center" element={<HelpCenter />} />

                  <Route key={'all_at_end'} path="*" element={<Template404 />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </React.StrictMode>
        </HelmetProvider>
      </QueryClientProvider>
    </NotificationProvider>
  </AppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
