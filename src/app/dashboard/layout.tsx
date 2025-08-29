"use client"
import '@/app/globals.css';
import { Toaster } from "sonner";
import { useSidebar } from "./context/SidebarContext";
import AppHeader from "./sidebar/AppHeader";
import AppSidebar from "./sidebar/AppSidebar";
import Backdrop from "./sidebar/Backdrop";
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const { isAuthenticated , userRole} = useAuth();
    const router = useRouter();
    const [countdown, setCountdown] = useState(5); // start at 5 seconds


    // Dynamic class for main content margin based on sidebar state
    const mainContentMargin = isMobileOpen
        ? "ml-0"
        : isExpanded || isHovered
            ? "lg:ml-[290px]"
            : "lg:ml-[90px]";


    useEffect(() => {
        if (!isAuthenticated && userRole !== 'admin') {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        router.replace("/signIn"); // 👈 your sign-in route
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600 text-lg text-center px-4">
                    You are not signed in. Redirecting to login in{" "}
                    <span className="font-semibold">{countdown}</span> seconds...
                </p>
            </div>
        );
    }


    return (
        <>
            <Toaster position="top-right" richColors closeButton theme="dark" />
            <div className="flex flex-col space-y-8">
                <AppSidebar />
                <Backdrop />
                <div
                    className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
                >
                    <AppHeader />
                    {children}
                </div>
            </div>
        </>
    );
}
