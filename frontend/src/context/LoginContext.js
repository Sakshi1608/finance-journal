import {createContext, useState, useEffect } from "react";
export const LoginContext = createContext();

export const LoginProvider = ({children}) => {
    const [user,setUser] = useState({userName:"", name:""});
    const [token, setToken] = useState(null);
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if(storedUser) setUser(JSON.parse(storedUser));
        if(storedToken) setToken(storedToken);
    },[]);

    const login =(userData) => {
        setUser({userName:userData.userName,name:userData.name});
         setToken(userData.token);
        localStorage.setItem("user",JSON.stringify({ userName: userData.userName, name: userData.name }));
         localStorage.setItem("token",userData.token);
    };

    const logout =()=>{
        setUser({userName:"", name:""});
        setToken(null);
        localStorage.removeItem("user");
          localStorage.removeItem("token");
    };

    return(
        <LoginContext.Provider value={{user,token,login,logout}}>
            {children}
        </LoginContext.Provider>
    );
}