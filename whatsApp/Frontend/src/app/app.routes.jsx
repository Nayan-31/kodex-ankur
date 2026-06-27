import { createBrowserRouter } from "react-router"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"


const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/",
        element: <h1>Home</h1>
    },
    {
        path: "/login",
        element: <Login />
    }
])

export default router