import globalApi from "../../shared/global.api"
import { store } from "../../../app/app.store"


const authApi = globalApi.create({
    baseURL: "/api/auth",
})


authApi.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().auth.accessToken

        console.log("Access Token from store:", accessToken)

        if (accessToken) {
            config.headers[ "Authorization" ] = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

authApi.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshResponse = await authApi.post("/refresh-token")
                const newAccessToken = refreshResponse.data.data.accessToken

                store.dispatch({ type: "auth/setAccessToken", payload: newAccessToken })

                originalRequest.headers[ "Authorization" ] = `Bearer ${newAccessToken}`
                return authApi(originalRequest)
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError)
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)




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
    const response = await authApi.post("/login", { email, password })
    return response.data.data
}



/**
 * Gets the current authenticated user from backend. Throw an error if the request fails.
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 */
export const getCurrentUser = async () => {
    const response = await authApi.get("/current-user")
    return response.data.data
}