"use client"

import { AppWindowIcon, CodeIcon, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Navbar from "@/components/home/Navbar"
import { ProfileNav } from "@/components/wrappers/layoutWrapper"

export default function TabsDemo() {
    return (
        <>
            <ProfileNav/>
            <div className="flex w-full max-w-sm flex-col gap-6 lg:hidden p-5">
                <Tabs defaultValue="account">
                    <TabsList>
                        <TabsTrigger value="account" className="rounded-full">
                            <UserPlus className="size-5" />
                        </TabsTrigger>
                        <TabsTrigger value="password">
                            <UserPlus className="size-5" />
                        </TabsTrigger>
                        <TabsTrigger value="a">
                            <UserPlus className="size-5" />
                        </TabsTrigger>
                        <TabsTrigger value="b">
                            <UserPlus className="size-5" />
                        </TabsTrigger>
                        <TabsTrigger value="c">
                            <UserPlus className="size-5" />
                        </TabsTrigger>
                        <TabsTrigger value="d">
                            <UserPlus className="size-5" />
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                                <CardDescription>
                                    Make changes to your account here. Click save when you&apos;re
                                    done.
                                </CardDescription>
                            </CardHeader>

                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you&apos;ll be logged
                                    out.
                                </CardDescription>
                            </CardHeader>

                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
