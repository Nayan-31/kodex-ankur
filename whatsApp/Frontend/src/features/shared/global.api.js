import axios from "axios"
import { attachInterceptors } from "../../utils/axios.interceptor"

const globalApi = axios.create({
    baseURL: "/api",
    withCredentials: true,
})

attachInterceptors(globalApi)

/**
 * Searches users from the database based on username.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} A promise that resolves to the matching users.
 */
export const searchUsers = async (query) => {
    const response = await globalApi.get(`/users/search?query=${encodeURIComponent(query)}`)
    return response.data.data.users
}


export default globalApi