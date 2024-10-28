import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { isLoggedIn, authStateLoading, user } = useAuth();

  if (authStateLoading) {
    return <Loader isLoading={authStateLoading} />; // Show a loading indicator while auth state is being determined
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default ProtectedRoute;
