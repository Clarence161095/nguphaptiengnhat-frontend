/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useCheckRole } from '../hooks/checkRole.hook';
import Loading from '../pages/common/Loading.component';

function RequireAuth({ children }: { children: JSX.Element }) {
  const [checkRole] = useCheckRole();

  if (!checkRole('general')) {
    if (localStorage.getItem('access-token')) {
      return <Home />;
    } else {
      return <Login />;
    }
  }

  return <React.Suspense fallback={<Loading />}>{children}</React.Suspense>;
}

const Login = React.lazy(() => import('../pages/auth/Login.component'));
const Home = React.lazy(() => import('../pages/home/Home.component'));

function RootRouter() {
  return (
    <Routes>
      <Route
        path="/home/#/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route
        path="*"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route path="/login/#/" element={<Login />} />
    </Routes>
  );
}

export default RootRouter;
