import { createContext, useState, type ReactNode } from "react"

type AuthContextType = {
    token: string | undefined;
    setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
};

type AuthProviderProp = {
    children : ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}:AuthProviderProp){
    const [token,setToken] = useState<string>()

    

    return(
        <AuthContext.Provider value={{token,setToken}}>
            {children}
        </AuthContext.Provider>
    )
}