import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Spinner } from "@app/_shared";
import React from "react";
import { Navigate } from "react-router-dom";
import {
  eraseCookie,
  getCookie,
  setCookie,
  getCookieValue,
} from "@jumbo/utilities/cookies";

const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated, loading, setIsAuthenticated } = useAuth();
    let authUserSr = getCookieValue("auth-user");

    if (loading) {
      return <Spinner />;
    }

    if (!authUserSr) {
      setIsAuthenticated(false);
    }

    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
