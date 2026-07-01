import { createBrowserRouter } from "react-router"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"
import Protected from "../features/shared/components/Protected"


const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/",
        element: <Protected>
            <h1>Home</h1>
        </Protected>
    },
    {
        path: "/login",
        element: <Login />
    }
])

export default router