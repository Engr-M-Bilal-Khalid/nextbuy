"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Catalogue from "../components/products/Catalouge"
import LaunchNew from "../components/products/LaunchNew"

export default function Products() {
  return (
    <div className="flex w/full flex-col gap-10  px-5 py-2.5">
      <Tabs defaultValue="cataloug">
        {/* Tabs List */}
        <TabsList className="w-full rounded-[5px]! flex justify-between items-center h-12 px-4 space-x-4 py-2">
          <TabsTrigger value="cataloug" className="rounded-[2px]!">
            <h1>Cataloug</h1>
          </TabsTrigger>
          <TabsTrigger value="password" className="rounded-[2px]!">
            <h1>Launch new</h1>
          </TabsTrigger>
        </TabsList>
        {/* Catalogue */}
        <TabsContent
          value="cataloug"
          className="flex flex-col space-y-3 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 data-[state=inactive]:translate-y-0 data-[state=active]:translate-y-0"
        >
          <Catalogue />
        </TabsContent>
        {/* Launch new */}
        <TabsContent
          value="password"
          className="transition-opacity duration-500 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 ease-out translate-y-2 data-[state=inactive]:translate-y-0 data-[state=active]:translate-y-0">
          <LaunchNew />
        </TabsContent>
      </Tabs>
    </div>
  )
}




