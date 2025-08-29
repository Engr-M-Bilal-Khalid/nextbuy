"use client"

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export const OuterWidthWrapper = ({
    className,
    children,
}: {
    className?: string
    children: ReactNode
}) => {
    const pathname = usePathname()

    // Treat any /dashboard path (root or nested) as "no padding/no vertical spacing"
    const isDashboardSection =
        pathname === "/dashboard" || pathname.startsWith("/dashboard/")
    return (
        <div
            className={cn(
                isDashboardSection ? "px-0" : "px-5 lg:px-15",
                className
            )}>
            {children}
        </div>
    )
}


export const InnerWidthWrapper = ({
    children,
}: {
    children: ReactNode
}) => {
    const pathname = usePathname()

    // Treat any /dashboard path (root or nested) as "no padding/no vertical spacing"
    const isDashboardSection =
        pathname === "/dashboard" || pathname.startsWith("/dashboard/")
    return (
        <div className={cn("flex flex-col space-y-8", isDashboardSection && "space-y-0 p-0")}>
            {children}
        </div>
    )
}
