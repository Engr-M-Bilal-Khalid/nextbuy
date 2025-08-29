"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { CircleArrowRight } from "lucide-react"
import { useState } from "react"
import LaunchNewProductForm from "./LaunchNewProductForm"



export default function LaunchNew() {
    const [open, setOpen] = useState(false);
    let a:number = 1
    return (
        <>
            <Card className="h-[73vh] min-h-[70vh] lg:h-[76vh] overflow-y-auto scrollbar-hide">
                <CardHeader className="">
                    <CardTitle className="shine-effect">Launch New</CardTitle>
                    <CardDescription className="flex flex-col items-center justify-center text-center  overflow-y-auto scrollbar-hide">
                        <div className="flex items-center justify-center flex-col space-y-5 my-6">
                            <h3 className="text-2xl uppercase font-extrabold text-gray-700 dark:text-gray-100 shine-effect underline underline-offset-4 tracking-wider zara">
                                Welcome back!
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Ready to grow the catalog? Create a new product to reach more customers and keep your store fresh.
                            </p>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left mx-auto max-w-md flex flex-col">
                                <li className="flex items-start gap-2">
                                    <CircleArrowRight className="text-gray-700 stroke-1 size-7 fill-gray-200" />
                                    Publish detailed listings with images, variants, and pricing.
                                </li>
                                <li className="flex items-start gap-2">
                                    <CircleArrowRight className="text-gray-700 stroke-1 size-7 fill-gray-200" />
                                    Organize inventory efficiently with real‑time stock tracking.
                                </li>
                                <li className="flex items-start gap-2">
                                    <CircleArrowRight className="text-gray-700 stroke-1 size-7 fill-gray-200" />
                                    Improve discovery with categories, tags, and SEO‑friendly content.
                                </li>
                                <li className="flex items-start gap-2">
                                    <CircleArrowRight className="text-gray-700 stroke-1 size-7 fill-gray-200" />
                                    Launch faster with reusable templates and variant presets.
                                </li>
                            </ul>
                            <div className="pt-2">
                                <Button
                                    onClick={() => setOpen(true)}
                                    className="rounded-[6px] px-6 py-3  hover:bg-gray-700 text-white shine-effect-skeleton bg-gray-600!"
                                >
                                    Launch New Product
                                </Button>
                                <Modal
                                    isOpen={open}
                                    onClose={() => setOpen(false)}
                                    isFullscreen={false}
                                    showCloseButton={true}
                                    className="h-[70vh] w-[50vw] lg:max-w-[90vh] lg:my-auto mt-2 max-w-none overflow-y-auto scrollbar-hide m-5 rounded-[5px]!  border-1 border-gray-400"
                                >
                                    <LaunchNewProductForm className="px-5 py-5 overflow-y-auto scrollbar-hide" key={Math.random()}/>
                                </Modal>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                You can edit details, add images, and adjust stock anytime after publishing.
                            </p>
                        </div>
                    </CardDescription>
                </CardHeader>
            </Card>
        </>
    )
}


