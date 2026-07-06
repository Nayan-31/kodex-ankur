import globalApi from "../../shared/global.api"



/**
 * Registers a new user with the provided username, email, and password.Throw an error if the registration fails.
 * @param {Object} userData - The user data for registration.
 * @param {string} userData.username - The username of the new user.
 * @param {string} userData.email - The email of the new user.
 * @param {string} userData.password - The password of the new user.
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 */
export const registerUser = async ({ username, email, password }) => {
    const response = await globalApi.post("/auth/register", { username, email, password })
    return response.data.data
}


/**
 * Logs in a user with the provided email and password. Throw an error if the login fails.
 * @param {Object} userData - The user data for login.
 * @param {string} userData.email - The email of the user.
 * @param {string} userData.password - The password of the user.
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 */
export const loginUser = async ({ email, password }) => {
    const response = await globalApi.post("/auth/login", { email, password })
    return response.data.data
}



/**
 * Gets the current authenticated user from backend. Throw an error if the request fails.
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 */
export const getCurrentUser = async () => {
    const response = await globalApi.get("/auth/current-user")
    return response.data.data
}


/**
 * Logs out the current user.
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 */
export const logoutUser = async () => {
    const response = await globalApi.post("/auth/logout")
    return response.data
}