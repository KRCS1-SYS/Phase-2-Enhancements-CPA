import {
    eraseCookie,
    getCookie,
    setCookie,
    getCookieValue,
} from "@jumbo/utilities/cookies";
import { handleApiResponse } from "@app/_utilities/fetchData/apiHandler";

export const getMe = async (token) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/users/me`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`,
            },
        });
       const data = await handleApiResponse(response);
        return {
            name: data.Name, // Extract token from response
            email: data.Email,
            role: data.Role,
        };
    } catch (err) {
        console.error("Error from getme service:", err.message);
        throw err;
    }
};

export const getUsersService = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/users/list`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });
        const data = handleApiResponse(response); // Wait for the JSON parsing
        return data;
    } catch (err) {
        console.error("Error from getme service:", err.message);
        throw err;
    }
};

export const addUserService = async (userBody) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/users/`, {
            method: "POST",
            body: JSON.stringify(userBody),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });
        const data = handleApiResponse(response); // Wait for the JSON parsing
        return data;
    } catch (err) {
        console.error("Error from add user service:", err.message);
        throw err;
    }
};

export const deleteUserService = async (userId) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });
        const data = await handleApiResponse(response); // Wait for the JSON parsing
        return data;
    } catch (err) {
        console.error("Error from getme service:", err.message);
        throw err;
    }
};

export const loginService = async (loginBody) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify(loginBody),
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });

        const data = await handleApiResponse(response); // Wait for the JSON parsing
        return {
            token: data.token,
            email: loginBody.email,
        };
    } catch (err) {
        throw err;
    }
};

export const logoutService = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });

        const data = await handleApiResponse(response);// Wait for the JSON parsing
        eraseCookie("auth-user");
    } catch (err) {
        throw err;
    }
};

export const ChangePasswordService = async (ChangePasswordBody) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/users/change-password`, {
            method: "PUT",
            body: JSON.stringify(ChangePasswordBody),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });

        const data = await handleApiResponse(response); // Wait for the JSON parsing
        return data;
    } catch (err) {
        throw err;
    }
};