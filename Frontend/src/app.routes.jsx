import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/Login"
import RegisterPage from "./features/auth/pages/RegisterPage"

export const router = createBrowserRouter([
    {
        path : "/login",
        element : <Login/>
    },
    {
        path : "/register",
        element : <RegisterPage/>
    }

])

export default router