import { store } from "../app/app.store";



export function attachInterceptors(apiInstance) {

    apiInstance.interceptors.request.use(
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

    apiInstance.interceptors.response.use(
        (response) => {
            return response
        },
        async (error) => {
            const originalRequest = error.config

            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true

                try {
                    const refreshResponse = await apiInstance.post("/auth/refresh-token")
                    const newAccessToken = refreshResponse.data.data.accessToken

                    store.dispatch({ type: "auth/setAccessToken", payload: newAccessToken })

                    originalRequest.headers[ "Authorization" ] = `Bearer ${newAccessToken}`
                    return apiInstance(originalRequest)
                } catch (refreshError) {
                    console.error("Refresh token failed:", refreshError)
                    return Promise.reject(refreshError)
                }
            }

            return Promise.reject(error)
        }
    )

}