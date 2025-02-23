import React from "react";
import { AuthContext } from "./AuthContext";
import {
  eraseCookie,
  getCookie,
  setCookie,
  getCookieValue,
} from "@jumbo/utilities/cookies";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";

import {
  loginService,
  logoutService,
  getMe,
  ChangePasswordService,
  getUsersService,
  addUserService,
  deleteUserService,
} from "./services";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [authError, setAuthError] = React.useState();
  const [accessToken, setAccessToken] = React.useState();
  const [users, setUsers] = React.useState();

  const Swal = useSwalWrapper();
  const sweetAlerts = (variant, message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: variant,
      title: message,
    });
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const loginBody = {
        email: email,
        password: password,
      };
      const response = await loginService(loginBody);

      if (response.token) {
        const user = await getMe(response.token);
        const stringify = {
          token: response.token,
          email: response.email,
          user: user,
        };
        const authUserSr = encodeURIComponent(JSON.stringify(stringify));
        setCookie("auth-user", authUserSr, 1);
        setIsAuthenticated(true);
        sweetAlerts("success", "Login successfully!");
        setAuthError();
        setAccessToken(stringify.token);
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
      sweetAlerts("success", "Logout successfully!");
      setIsAuthenticated(false);
    } catch (error) {
      sweetAlerts("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (ChangePasswordBody) => {
    setLoading(true);
    try {
      await ChangePasswordService(ChangePasswordBody);
      sweetAlerts("success", "Password changed successfully");
      setIsAuthenticated(false);
    } catch (error) {
      sweetAlerts("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsersService();
      if (response) {
        setUsers(response);
      }
    } catch (error) {
      sweetAlerts("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userBody) => {
    setLoading(true);
    try {
      await addUserService(userBody);
      setUsers();
    } catch (error) {
      sweetAlerts("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      await deleteUserService(userId);
      setUsers();
    } catch (error) {
      sweetAlerts("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let authUserSr = getCookie("auth-user");
    if (authUserSr) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        setAuthError,
        isAuthenticated,
        loading,
        authError,
        accessToken,
        users,
        setIsAuthenticated,
        setLoading,
        login,
        logout,
        changePassword,
        getUsers,
        addUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
