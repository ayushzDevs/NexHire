// this is juts a prebuilt auth not sure gonna use this or not


/**
 * @name hookLayer
 * @description it will manage api layer and states layer by maintaining the flow
 * @author Ayush
 */

import { useContext } from "react";
import { AuthContext } from "../auth.context";
import authApi  from "../../../api/authApi"

export const useAuth = () =>{
    const context = useContext(AuthContext)

    const {user,setUser,loading,setLoading} = context


    /**
     * @description Login Flow:
    * 1. Show the loading screen when the Login button is clicked.
    * 2. Extract the user's email and password.
    * 3. Store the received user data in the `user` state using `setUser()`.
    * 4. Hide the loading screen and navigate the authenticated user to the dashboard.
    */
    const handleLoginHook = async({ email, password }) => {
        setLoading(true)
        try {
            const data = await authApi.login(email, password)  // ← fixed
            setUser(data.user)
        } catch(e) {
            throw e  // ← rethrow so LoginPage catch block receives it
        } finally {
            setLoading(false)
        }
        }

    /**
     * @description register Flow:
    * 1. Show the loading screen when the register button is clicked.
    * 2. Extract the user's username , email and password.
    * 3. Store the received user data in the `user` state using `setUser()`.
    * 4. Hide the loading screen and navigate the user to the login page to get a authenticated login. 
     */

    const handleRegisterHook = async({username , email , password}) =>{
        setLoading (true)
        try{const data = await authApi.register(username, email, password)  
        setUser(data.user)}
        catch(e){
            throw e
        }
        finally{setLoading(false)}
    }

    /**
     * @description just logs out users
     */

    const handleLogout = async() =>{
        setLoading(true)
        try{const data = await authApi.logout()
        setUser(null)}
        catch(e){

        }
        finally{setLoading(false)}
    }

    return {user , loading , handleRegisterHook , handleLoginHook , handleLogout}

}