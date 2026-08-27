/**
 * Safely retrieves and parses user data from localStorage
 * @returns {Object|null} Parsed user data or null if not found/invalid
 */
export const getSafeUserData = () => {
    try {
        const data = localStorage.getItem("userData");
        if (data && data !== "undefined" && data !== "null") {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
        localStorage.removeItem("userData");
        return null;
    }
};

/**
 * Safely saves user data to localStorage
 * @param {Object} userData - User data to save
 */
export const setSafeUserData = (userData) => {
    try {
        if (userData) {
            localStorage.setItem("userData", JSON.stringify(userData));
        } else {
            localStorage.removeItem("userData");
        }
    } catch (error) {
        console.error("Error saving userData to localStorage:", error);
    }
};
