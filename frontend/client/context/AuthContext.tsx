import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL || "https://heimish.ru/directus";

interface User {
    id: string;
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
            const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: identifier, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                const msg = data.errors?.[0]?.message || "";
                let error = "Неверный email или пароль";
                if (msg.includes("Invalid user credentials")) {
                    error = "Неверный email или пароль";
                } else if (msg) {
                    error = msg;
                }
                return { success: false, error };
            }

            const accessToken = data.data.access_token;

            // Fetch user profile
            let userName = identifier.split("@")[0];
            let userEmail = identifier;
            let userId = "";
            try {
                const meResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
                    headers: { "Authorization": `Bearer ${accessToken}` },
                });
                const meData = await meResponse.json();
                userId = meData.data?.id || "";
                userName = meData.data?.first_name || meData.data?.email?.split("@")[0] || userName;
                userEmail = meData.data?.email || userEmail;
            } catch {}

            setToken(accessToken);
            setUser({
                id: userId,
                username: userName,
                email: userEmail,
            });
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: "Ошибка подключения к серверу" };
        }
    };

    const register = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${DIRECTUS_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: username,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                let errorMessage = "Ошибка регистрации";
                const msg = data.errors?.[0]?.message || "";
                if (msg.includes("unique") || msg.includes("email")) {
                    errorMessage = "Этот email уже зарегистрирован";
                } else if (msg) {
                    errorMessage = msg;
                }
                return { success: false, error: errorMessage };
            }

            // Auto-login after registration
            const loginResult = await login(email, password);
            if (!loginResult.success) {
                // Registration returned 204 but login failed = email already registered with different password
                return { success: false, error: "Этот email уже зарегистрирован. Попробуйте войти." };
            }
            return loginResult;
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
