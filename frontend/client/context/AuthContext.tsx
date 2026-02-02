import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: number;
    documentId: string;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "https://heimish.ru/strapi-api";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // Save to localStorage when user/token changes
    useEffect(() => {
        if (token && user) {
            localStorage.setItem("authToken", token);
            localStorage.setItem("authUser", JSON.stringify(user));
        } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
        }
    }, [token, user]);

    const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { 
                    success: false, 
                    error: data.error?.message || "Неверный email или пароль" 
                };
            }

            setToken(data.jwt);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: "Ошибка подключения к серверу" };
        }
    };

    const register = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMessage = "Ошибка регистрации";
                if (data.error?.message) {
                    if (data.error.message.includes("Email")) {
                        errorMessage = "Этот email уже зарегистрирован";
                    } else if (data.error.message.includes("Username")) {
                        errorMessage = "Это имя пользователя уже занято";
                    } else {
                        errorMessage = data.error.message;
                    }
                }
                return { success: false, error: errorMessage };
            }

            setToken(data.jwt);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error("Register error:", error);
            return { success: false, error: "Ошибка подключения к серверу" };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
