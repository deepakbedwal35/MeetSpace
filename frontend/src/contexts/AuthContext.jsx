import { createContext, useContext, useEffect, useState } from "react";
import {authApi} from "../services/api.js"
import { toast } from "react-hot-toast";

export const AuthContext = createContext(null);
export const AuthProvider = ({children})=>{
   
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // check during refresh
    useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await authApi.get("/me");
        toast.success("Succesfully Login");
        setUser(res.data.user);
      } catch (error) {
        // toast.error("Please login ");
        setUser(null); 
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
        const res = await authApi.post("/login", { email, password });
        setUser(res.data.user);
        return { success: true };
        } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || "Login failed" 
        };
        } finally {
        setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        try {
        const res = await authApi.post("/register", { username, email, password });
        setUser(res.data.user);
        return { success: true };
        } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || "Registration failed" 
        };
        } finally {
        setLoading(false);
        }
    };

    const logout = async () => {
        try {
        await authApi.post("/logout");
        } catch (error) {
        console.error("Logout failed", error);
        } finally {
        setUser(null);
        }
    };

    return(
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>

    );
}

export const useAuth = () => useContext(AuthContext);