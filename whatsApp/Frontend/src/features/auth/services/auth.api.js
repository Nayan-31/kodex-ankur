import globalApi from "../../shared/global.api"


const authApi = globalApi.create({
    baseURL: "/api/auth",
})


/**
 * Registers a new user with the provided username, email, and password.Throw an error if the registration fails.
 * @param {Object} userData - The user data for registration.
 * @param {string} userData.username - The username of the new user.
 * @param {string} userData.email - The email of the new user.
 * @param {string} userData.password - The password of the new user.
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 */
export const registerUser = async ({ username, email, password }) => {
    const response = await authApi.post("/register", { username, email, password })
    return response.data
}


/**
 * Logs in a user with the provided email and password. Throw an error if the login fails.
 * @param {Object} userData - The user data for login.
 * @param {string} userData.email - The email of the user.
 * @param {string} userData.password - The password of the user.
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 */
export const loginUser = async ({ email, password }) => {
    const response = await authApi.post("/login", { email, password })
    return response.data
}