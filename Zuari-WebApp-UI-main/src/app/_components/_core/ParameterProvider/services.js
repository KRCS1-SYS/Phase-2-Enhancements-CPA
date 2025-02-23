import { getCookieValue, eraseCookie } from "@jumbo/utilities/cookies";
// import { handleApiResponse, handleApiError } from "";
import { handleApiResponse } from "@app/_utilities/fetchData/apiHandler";

export const getStateWebSocketUrl = (dashboard, state) => {
    const apiWSUrl = import.meta.env.VITE_API_WS_URL;
    return `${apiWSUrl}/${dashboard}/state/${state}`;
};

export const getWebSocketUrl = (dashboard) => {
    const apiWSUrl = import.meta.env.VITE_API_WS_URL;
    return dashboard === "sugar"
        ? `${apiWSUrl}/sugar/realtime`
        : `${apiWSUrl}/power/realtime`;
};

export const sugarAreasService = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/sugar/area`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });
        const data = await handleApiResponse(response);
        return data;
    } catch (err) {
        console.error("Error from sugarAreasService service:", err.message);
        throw err;
    }
};

export const powerEquipmentsService = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/power/equipments`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });
        const data = await handleApiResponse(response);
        return data;
    } catch (err) {
        console.error("Error from powerEquipmentsService service:", err.message);
        throw err;
    }
};

export const parameterHistoricalDataService = async (parameterId) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/opc/history/${parameterId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });
        const data = await handleApiResponse(response);
        return data;
    } catch (err) {
        throw err;
    }
};

export const getTagsService = async (dashboard) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/${dashboard}/all/tags`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });
        const data = await handleApiResponse(response);
        return data;
    }
    catch (err) {
        console.error("Error from getTags service:", err.message);
        throw err;
    }
};

export const editTagsService = async (tagBody, tagId, dashboard) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/${dashboard}/tags/${tagId}`, {
            method: "PUT",
            body: JSON.stringify(tagBody),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });
        const data = await handleApiResponse(response);
        return data;
    } catch (err) {
        console.error("Error from editTags service:", err.message);
        throw err;
    }
};

export const getPowerParametersService = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/power/all/tags`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });

        const data = await handleApiResponse(response);
        return data;
    } catch (err) {
        console.error("Error from getTags service:", err.message);
        throw err;
    }
};

export const getSugarParametersService = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/sugar/all/tags`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${getCookieValue("auth-user").token}`,
            },
        });

        const data = await handleApiResponse(response);
        return data;
    } catch (err) {
        console.error("Error from getTags service:", err.message);
        throw err;
    }
};
