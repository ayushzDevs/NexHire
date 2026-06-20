import api from "./axiosInstance";


const authApi = {
    async register(username, email, password){
        const {data} = await api.post("/api/auth/register",{
            username,
            email,
            password
        });

        return data; 
    },

    async login(email, password){
        const {data} = await api.post("/api/auth/login",{
            email,
            password
        });
        return data;
    },

    async logout() {
        const { data } = await api.post("/api/auth/logout");
        localStorage.removeItem("token");   // just clear storage, no redirect here
        return data;
    },


    async getMe(){
        const {data} = await api.get("/api/auth/get-me");
        return data;
    }


};


export default authApi;