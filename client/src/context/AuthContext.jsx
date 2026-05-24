import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";


export const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);          
  const [isLoading, setIsLoading] = useState(true); 
 
  
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("travelgen_token");
 
      if (token) {
        try {
          
          const { data } = await api.get("/auth/me");
          setUser(data.data);
        } catch {
          
          localStorage.removeItem("travelgen_token");
          localStorage.removeItem("travelgen_user");
          setUser(null);
        }
      }
 
      setIsLoading(false);
    };
 
    initAuth();
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
 
    
    localStorage.setItem("travelgen_token", data.data.token);
    localStorage.setItem("travelgen_user", JSON.stringify(data.data));
 
    setUser(data.data);
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
 
    localStorage.setItem("travelgen_token", data.data.token);
    localStorage.setItem("travelgen_user", JSON.stringify(data.data));
 
    setUser(data.data);
    return data;
  }, []);

    const logout = useCallback(() => {
    
    localStorage.removeItem("travelgen_token");
    localStorage.removeItem("travelgen_user");
    setUser(null);
  }, []);


  const updateUser = useCallback((updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user, 
    signup,
    login,
    logout,
    updateUser,
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }
 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};





