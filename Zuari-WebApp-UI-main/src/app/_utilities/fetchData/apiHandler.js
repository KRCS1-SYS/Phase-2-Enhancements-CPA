import { eraseCookie } from "@jumbo/utilities/cookies";

export const handleApiResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401) {
            eraseCookie("auth-user");
            throw new Error("Unauthorized. Redirecting to login.");
        }
        const errordata = await response.json();
        throw new Error(errordata.detail);
    }
    const data = await response.json(); 
    return data;
};