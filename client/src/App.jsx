import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Chat from './pages/chat';
import Auth from './pages/auth';
import Profile from './pages/profile';
import HelpCenter from './pages/chat/help-center';
import ContactUs from './pages/chat/contact-page';
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';
import './App.css';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to='/auth' />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to='/chat' /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [minimumLoading, setMinimumLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data.id) {
          setUserInfo(res.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }

    // Set a timeout for the minimum loading duration (3s)
    const timer = setTimeout(() => {
      setMinimumLoading(false);
    }, 500);

    // Cleanup timer if the component unmounts
    return () => clearTimeout(timer);
  }, [userInfo, setUserInfo]);

  // Show loading screen if either data is still loading or the minimum duration hasn't passed
  if (loading || minimumLoading) {
    return (
      <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 text-white/80 flex items-center justify-center '>
        <h5 className='text-5xl animate-pulse'>Loading...</h5>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/auth'
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path='/chat'
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path='/help-center' element={<HelpCenter />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='*' element={<Navigate to='/auth' />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
