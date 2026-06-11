import { createContext , useState , useEffect} from "react";



export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [ loading , setLoading] = useState(false);

      useEffect(() => {
        async function fetchUser() {
                try {
                    const data = await getMe();
                    setUser(data.user);
                } catch (e) {
                    setUser(null);
                } finally {
                    setLoading(false); // ← done checking
                }
                }
                fetchUser();
            }, []);

         return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

