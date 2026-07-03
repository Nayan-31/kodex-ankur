import { setUser, setAccessToken, setLoading } from "../state/auth.slice"
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../services/auth.api"
import { useDispatch } from "react-redux"


const useAuth = () => {

    const dispatch = useDispatch()



    /**
     * Registers a new user by dispatching actions to update the Redux store with the user's information and access token.
     * @param {Object} userData - The user data for registration.
     * @param {string} userData.username - The username of the new user.
     * @param {string} userData.email - The email of the new user.
     * @param {string} userData.password - The password of the new user.
     * @returns {Promise<void>} A promise that resolves when the registration is complete.
     */
    const register = async ({
        username, email, password
    }) => {
        const data = await registerUser({ username, email, password })
        dispatch(setUser(data.user))
        dispatch(setAccessToken(data.accessToken))
    }


    /**
     * Logs in a user by dispatching actions to update the Redux store with the user's information and access token.
     * @param {Object} userData - The user data for login.
     * @param {string} userData.email - The email of the user.
     * @param {string} userData.password - The password of the user.
     * @returns {Promise<void>} A promise that resolves when the login is complete.
     */
    const login = async ({ email, password }) => {
        const data = await loginUser({ email, password })

        console.log("Login data:", data)

        dispatch(setUser(data.user))
        dispatch(setAccessToken(data.accessToken))
    }


    /**
     * Gets the current authenticated user from backend and updates the Redux store with the user's information.
     * @returns {Promise<void>} A promise that resolves when the user data is fetched and the Redux store is updated.
     */
    const handleGetCurrentUser = async () => {

        try {
            const data = await getCurrentUser()
            dispatch(setUser(data.user))
        }
        catch (error) {
            console.error("Error fetching current user:", error)
        } finally {
            dispatch(setLoading(false))
        }

    }


    /**
     * Logs out the user by making the API call and clearing local state/auth keys.
     * @returns {Promise<void>}
     */
    const logout = async () => {
        try {
            await logoutUser()
        } catch (error) {
            console.error("Logout error in hook:", error)
        } finally {
            dispatch(setUser(null))
            dispatch(setAccessToken(null))
        }
    }


    return { register, login, handleGetCurrentUser, logout }
}

export default useAuth