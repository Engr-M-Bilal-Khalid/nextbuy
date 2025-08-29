
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import { brandConfig } from "./brandconfig";
import Autoplay from 'embla-carousel-autoplay';
import { cn } from "@/lib/utils";
import '@/app/style.css'

export function BrandStripMobile() {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            plugins={[
                Autoplay({
                    delay: 3000, // Customize delay in milliseconds (e.g., 2000ms = 2 seconds)
                    stopOnInteraction: true, // Stop autoplay when user interacts with carousel
                }),
            ]}

            className="w-full max-w-sm bg-gray-200 rounded-[10px] lg:hidden"
        >
            <CarouselContent>
                {brandConfig.map((cv, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <Card className="border-0 shadow-none bg-gray-200">
                                <CardContent className="flex items-center justify-center p-0">
                                    <span className={cn("text-lg font-semibold font-sans",cv[0] === "A" && `gucci`,cv[0] === `Z` && `versace`,cv[0] === `R` && `zara`,cv[0] === `D` && `prada`)}>{cv}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}
