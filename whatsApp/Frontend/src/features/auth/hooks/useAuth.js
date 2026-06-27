import { setUser, setAccessToken, setLoading, setError } from "../state/auth.slice"
import { registerUser, loginUser } from "../services/auth.api"
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
        dispatch(setUser(data.user))
        dispatch(setAccessToken(data.accessToken))
    }



    return { register, login }
}

export default useAuth