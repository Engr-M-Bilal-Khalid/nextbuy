"use client";

import { errorNotifier, successNotifier } from "@/lib/sonnerNotifications";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";


interface AuthContextType {
    userId: string | null;
    userRole: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    setAuth: (userId: string | null, userRole: string | null) => void;
    clearAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider = ({ children }: { children: ReactNode }) => {


    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const cookieStr = document.cookie;
        const cookiesArr = cookieStr.split(";");
        const sessionCookie = cookiesArr.find((cookie) =>
            cookie.trim().startsWith("signInToken=")
        );
        if (!sessionCookie) {
            setLoading(false);
            return;
        }
        try {
            const jsonStr = decodeURIComponent(sessionCookie.split("=")[1]);
            const parsed = JSON.parse(jsonStr);

            if (parsed.userId && parsed.userRole) {
                setUserId(parsed.userId);
                setUserRole(parsed.userRole);
                setIsAuthenticated(true);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error("Error parsing session cookie:", err);
            setLoading(false);
        }
    }, []);


    const setAuth = (newUserId: string | null, newUserRole: string | null) => {
        setUserId(newUserId);
        setUserRole(newUserRole);
        setIsAuthenticated(!!newUserId);
        console.log("Set Auth called")
    };

    const clearAuth = async () => {
        setUserId(null);
        setUserRole(null);
        setIsAuthenticated(false);

        try {
            const response = await fetch("/api/logOut", { method: "POST" });
            if (response.ok) {
                successNotifier.notify("Logged out successfully");
            } else {
                errorNotifier.notify("Logout failed");
            }
        } catch (err) {
            errorNotifier.notify("Logout error");
            console.error(err);
        }
    };



    return (
        <AuthContext.Provider
            value={{ userId, userRole, isAuthenticated, loading, setAuth, clearAuth }}
        >
            {children}
        </AuthContext.Provider>
    );

}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};