"use client"
import { Copyright } from "lucide-react"
import { Separator } from "../ui/separator"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Footer() {
  const pathname = usePathname()

  // Paths that only affect top margin styling
  const marginPaths = new Set<string>(["/"])
  const hasMargin = marginPaths.has(pathname)

  // Single routes to hide footer entirely
  const singleHidden = new Set<string>([
    "/signIn",
    "/signUp",
    "/forgotPassword",
    "/resetPassword",
    "/verifyEmail",
    "/checkout"
  ])

  // Hide on any /dashboard route ("/dashboard" and any child like "/dashboard/...").
  const isDashboardSection = pathname === "/dashboard" || pathname.startsWith("/dashboard/")

  // Final rule: do not render on any of the single hidden routes OR any dashboard prefixed route
  const shouldHide = singleHidden.has(pathname) || isDashboardSection

  if (shouldHide) return null

  return (
    <>
      <Separator className={cn(hasMargin ? "mt-5" : "mt-10")} />
      <div className="flex items-center justify-between p-1 text-[12px] lg:text-xl lg:p-4 bg-white text-gray-700 lg:font-semibold py-5">
        <img src="/logo/logoWatch.png" className="size-8 lg:size-10" alt="Logo" />
        <div className="flex space-x-1 lg:space-x-4 items-center">
          <Copyright className="size-4 stroke-2 text-gray-700" />
          <span>{new Date().getFullYear()} MyEcommerce. All rights reserved.</span>
        </div>
      </div>
    </>
  )
}
