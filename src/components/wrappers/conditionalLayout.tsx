"use client"

import { usePathname } from "next/navigation"
import LayoutWrapperz from "./layoutWrapper"

export default function WrapLayout() {
  const pathname = usePathname()

  const singleExcludes = new Set<string>([
    "/chkProdu",
    "/signIn",
    "/signUp",
    "/forgotPassword",
    "/resetPassword",
    "/verifyEmail",
    "/profile",
    "/checkout"
  ])

  const excludedPrefixes = ["/dashboard"]

  const isExcluded =
    singleExcludes.has(pathname) ||
    excludedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  if (!isExcluded) {
    return <LayoutWrapperz />
  }
  return null
}
