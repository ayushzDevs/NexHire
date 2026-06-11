import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/Login"
import RegisterPage from "./features/auth/pages/RegisterPage"
import Protected from "./features/auth/components/Protected"

export const router = createBrowserRouter([
    {
        path : "/login",
        element : <Login/>
    },
    {
        path : "/register",
        element : <RegisterPage/>
    },
    {
        path:"/",
        element : <Protected><h1>Dashboard</h1></Protected>
    }

])

export default router