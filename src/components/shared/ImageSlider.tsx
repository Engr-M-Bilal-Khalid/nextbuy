"use client";

import { FC, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronLeftCircle, ChevronRight, ChevronRightCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselAndSpotlightProps {
    urls: string[];
    iconsSmall?: Boolean;
    adminView?:Boolean
}

export default function Carousel({ urls, iconsSmall,adminView }: CarouselAndSpotlightProps) {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    return (
        <div className="w-full relative">
            <Swiper
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }

                }}
                spaceBetween={20}
                slidesPerView={1}
                loop
                className="default-carousel custom-swiper-pagination"
            >
                {urls.map((url, idx) => (
                    <SwiperSlide key={idx}>
                        <div className={cn("flex items-center justify-center h-full w-full", iconsSmall && "w-[80%] lg:w-full")}>
                            <div className={cn("overflow-hidden rounded-xl p-4", iconsSmall && "p-1 flex justify-center lg:p-4")}>
                                <img
                                    src={url}
                                    alt={`Slide ${idx + 1}`}
                                    className={cn("object-cover h-full w-full rounded-2xl", iconsSmall && "ml-6 w-[80%] h-[80%] rounded-none lg:size-full lg:ml-0 lg:-mt-3",adminView && "mx-auto w-[40%] h-[30%]")}
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                {/* Navigation Buttons */}
                <div className="flex items-center gap-8 justify-between absolute w-full top-1/2 transform z-10">
                    <button
                        ref={prevRef}
                        className=" group"
                    >
                        {
                            !iconsSmall
                                ?
                                <ChevronLeftCircle className="size-5 text-gray-600" />
                                :
                                <ChevronLeft className="size-4 text-gray-900 stroke-1" />
                        }
                    </button>

                    <button
                        ref={nextRef}
                        className="group "
                    >
                        {
                            !iconsSmall
                                ?
                                <ChevronRightCircle className="size-5 text-gray-600" />
                                :
                                <ChevronRight className="size-4 text-gray-900 stroke-1" />
                        }
                    </button>
                </div>
            </Swiper>
        </div>
    );
};

interface SpotlightProps extends CarouselAndSpotlightProps {
    custReview?: Boolean;
    desktopView?: Boolean;
}

export function Spotlight({ urls, custReview, desktopView }: SpotlightProps) {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    const [swiper, setSwiper] = useState<any>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="w-full relative">
            <Swiper
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    if (
                        swiper.params.navigation &&
                        typeof swiper.params.navigation !== "boolean"
                    ) {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }
                }}
                onSwiper={setSwiper}
                onSlideChange={(s) => {
                    setActiveIndex(s.realIndex); // update current index for highlight
                }}
                spaceBetween={20}
                slidesPerView={1}
                loop
                className="default-carousel custom-swiper-pagination"
            >
                {urls.map((url, idx) => (
                    <SwiperSlide key={idx}>
                        <div className="flex items-center justify-center w-full h-full">
                            <div className={cn("overflow-hidden rounded-xl p-0")}>
                                <img
                                    src={url}
                                    alt={`Slide ${idx + 1}`}
                                    className={cn("object-cover size-44 rounded-2xl", custReview && `w-18 h-18`, desktopView && `w-full h-full`)}
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                {/* Navigation Buttons */}
                <div className="flex items-center gap-8 justify-between absolute w-full top-1/2 transform z-10">
                    <button ref={prevRef} className="group">
                        <ChevronLeftCircle className="size-5 text-gray-600" />
                    </button>
                    <button ref={nextRef} className="group">
                        <ChevronRightCircle className="size-5 text-gray-600" />
                    </button>
                </div>
            </Swiper>

            {/* Thumbnails below */}
            <div className="flex justify-center gap-5">
                {urls.map((url, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            swiper && swiper.slideToLoop(idx); // slideToLoop for support with loop mode
                        }}
                        className={cn(
                            "border-2 rounded-[5px] overflow-hidden w-16 h-16 p-1 transition",
                            activeIndex === idx
                                ? "border-gray-700 bg-gradient-to-b from-gray-300 to-gray-400"
                                : "border-transparent",
                            custReview && `w-9 h-9`,
                            desktopView && `size-20  flex items-center justify-center`,
                            desktopView && activeIndex === idx
                                ? " border-gray-500 bg-gradient-to-b from-gray-100 to-gray-200"
                                : "border-transparent",
                        )}
                        style={{ outline: "none" }}
                    >
                        <img
                            src={url}
                            alt={`Thumbnail ${idx + 1}`}
                            className={cn("object-cover w-full h-full rounded-md", desktopView && `size-15`)}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};


