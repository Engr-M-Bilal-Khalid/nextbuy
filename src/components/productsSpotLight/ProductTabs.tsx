"use client"
import { SpecificationItem } from "@/components/home/config";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
    specification: SpecificationItem[],
    detailDescription: string[],
    warrantyDetails: string[],
    returnPloicyDetails: string[],
    className?: string
}

export function ProductTabs({ specification, detailDescription, warrantyDetails, returnPloicyDetails, className }: ProductTabsProps) {
    return (
        <div className={cn("flex w-full flex-col lg:mb-4", className)} >
            <Tabs defaultValue="specifications" className="lg:flex lg:space-y-3" >
                <TabsList className="bg-gray-200 text-gray-700 py-2 h-auto px-1 space-x-[4.2px] lg:w-full lg:px-5 lg:rounded-[5px]">
                    <TabsTrigger value="specifications" className="text-gray-700 text-[11px] lg:text-xl lg:rounded-[2.5px] cursor-pointer font-sans">
                        Specifications
                    </TabsTrigger>
                    <TabsTrigger value="description" className="text-[11px]  lg:text-xl  lg:rounded-[2.5px] cursor-pointer">
                        Description
                    </TabsTrigger>
                    <TabsTrigger value="warranty" className="text-[11px]  lg:text-xl  lg:rounded-[2.5px] cursor-pointer">
                        Warranty
                    </TabsTrigger>
                    <TabsTrigger value="returnPolicy" className="text-[11px]  lg:text-xl  lg:rounded-[2.5px] cursor-pointer">
                        Return Policy
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="specifications">
                    <Card className="bg-gray-50 min-h-100">
                        <CardHeader className="space-y-3">
                            <CardTitle className="font-extrabold text-gray-700 shine-text tracking-wide lg:text-4xl prada lg:font-bold">Specifications</CardTitle>
                            <CardDescription className="lg:text-gray-600 lg:tracking-wide text-xl">
                                Technical specifications for Zero Gravity earbuds
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 text-[13px] font-medium text-gray-700 relative">
                            <img
                                src="/logo/logoWatch.png"
                                alt="background"
                                className="absolute top-1/2 left-1/2 w-40 max-w-full -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none"
                            />
                            {specification.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between space-x-5">
                                        <span>{item.label}</span>
                                        <span className="font-normal text-end">{item.value}</span>
                                    </div>
                                    <Separator />
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="description">
                    <Card className="bg-gray-50 min-h-100">
                        <CardHeader className="space-y-3">
                            <CardTitle className="font-extrabold text-gray-700 shine-text tracking-wide lg:text-4xl prada lg:font-bold">Description</CardTitle>
                            <CardDescription className="lg:text-gray-600 lg:tracking-wide text-xl">
                                Overview of the Zero Gravity earbuds
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-700 relative">
                            <img
                                src="/logo/logoWatch.png"
                                alt="background"
                                className="absolute top-1/2 left-1/2 w-40 max-w-full -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none"
                            />
                            {detailDescription.map((p, idx) => (
                                <div key={idx}>
                                    <p className={cn("lg:mb-2 lg:mt-2 lg:py-2", idx !== 0 && "lg:mt-0")}>
                                        {p}
                                    </p>
                                    <Separator className="hidden lg:block" />
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="warranty">
                    <Card className="bg-gray-50 min-h-100">
                        <CardHeader className="space-y-3">
                            <CardTitle className="font-extrabold text-gray-700 shine-text tracking-wide lg:text-4xl prada lg:font-bold">Warranty</CardTitle>
                            <CardDescription className="lg:text-gray-600 lg:tracking-wide text-xl">
                                Warranty coverage details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-700 relative">
                            <img
                                src="/logo/logoWatch.png"
                                alt="background"
                                className="absolute top-1/2 left-1/2 w-40 max-w-full -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none"
                            />
                            {warrantyDetails.map((p, idx) => (
                                <div key={idx}>
                                    <p className={cn("lg:mb-2 lg:mt-2 lg:py-2", idx !== 0 && "lg:mt-0")}>
                                        {p}
                                    </p>
                                    <Separator className="hidden lg:block" />
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="returnPolicy">
                    <Card className="bg-gray-50 min-h-100">
                        <CardHeader className="space-y-3">
                            <CardTitle className="font-extrabold text-gray-700 shine-text tracking-wide lg:text-4xl prada lg:font-bold">Return Policy</CardTitle>
                            <CardDescription className="lg:text-gray-600 lg:tracking-wide text-xl">
                                Easy and secure returns
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-700 relative">
                            <img
                                src="/logo/logoWatch.png"
                                alt="background"
                                className="absolute top-1/2 left-1/2 w-40 max-w-full -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none"
                            />
                            {returnPloicyDetails.map((p, idx) => (
                                <div key={idx}>
                                    <p className={cn("lg:mb-2 lg:mt-2 lg:py-2", idx !== 0 && "lg:mt-0")}>
                                        {p}
                                    </p>
                                    <Separator className="hidden lg:block" />
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}