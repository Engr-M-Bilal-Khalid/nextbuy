"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Catalogue from "../components/products/Catalouge"
import LaunchNew from "../components/products/LaunchNew"
import AllOrders from "../components/orders/allOrders"

export default function Products() {
  return (
    <div className="flex w/full flex-col gap-10  px-5 py-2.5">
      <Tabs defaultValue="cataloug">
        {/* Tabs List */}
        <TabsList className="w-full rounded-[5px]! flex justify-between items-center h-12 px-4 space-x-4 py-2">
          <TabsTrigger value="allOrders" className="rounded-[2px]!">
            <h1>All orders</h1>
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-[2px]!">
            <h1>Pending</h1>
          </TabsTrigger>
        </TabsList>
        {/* Catalogue */}
        <TabsContent
          value="allOrders"
          className="flex flex-col space-y-3 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 data-[state=inactive]:translate-y-0 data-[state=active]:translate-y-0"
        >
            <AllOrders/>
        </TabsContent>
        {/* Launch new */}
        <TabsContent
          value="pending"
          className="transition-opacity duration-500 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 ease-out translate-y-2 data-[state=inactive]:translate-y-0 data-[state=active]:translate-y-0">
         
        </TabsContent>
      </Tabs>
    </div>
  )
}




