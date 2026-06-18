import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/Login"
import RegisterPage from "./features/auth/pages/RegisterPage"
import Protected from "./features/auth/components/Protected"
import ProtectedRoute from "./ProtectedRoute"
import DashboardPage from "./features/auth/pages/DashboardPage"

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
        path:"/dashboard",
        element : <ProtectedRoute><DashboardPage/></ProtectedRoute>
    }

])

export default router