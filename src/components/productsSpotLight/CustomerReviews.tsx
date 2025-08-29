"use client"
import { Review } from "@/components/home/config";
import { Spotlight } from "@/components/shared/ImageSlider";
import { BadgeCheck, Star, UserCheck } from "lucide-react";
import { useState } from "react";

interface CustomerReviewsProps {
    reviews: Review[]
}

export default function CustomerReviews({ reviews }: CustomerReviewsProps) {
    const [visibleCount, setVisibleCount] = useState(3);

    const loadMore = () => {
        setVisibleCount((count) => Math.min(count + 3, reviews.length));
    };

    const visibleReviews = reviews.slice(0, visibleCount);

    const getFormattedDate = (date: Date | string): string => {
        // If the input is already a Date object, use it directly.
        const dateObject = typeof date === 'string' ? new Date(date) : date;

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return dateObject.toLocaleDateString('en-US', options);
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-2 mt-5">
                {visibleReviews.map((review) => (
                    <div
                        key={review.id}
                        className="w-full p-2 border border-gray-300 rounded-[4px] flex flex-col space-y-1"
                    >
                        <div className="flex justify-between w-full px-2 py-1 rounded-t-md">
                            <div className="flex space-x-1">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <Star
                                        key={idx}
                                        className={`size-4 mt-0.25 ${idx < Math.floor(review.rating)
                                            ? "text-yellow-800 fill-yellow-300"
                                            : "text-gray-300 fill-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-[13px] text-gray-700">
                                {review.rating} out of 5.0
                            </span>
                        </div>
                        <div className="flex justify-between items-center space-x-2 px-2 py-1">
                            <div className="flex space-x-2 items-center">
                                <div className="rounded-full p-2 bg-gray-300">
                                    <UserCheck className="size-5 text-gray-700 stroke-1" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="prada text-sm font-medium text-gray-700 shine-text">
                                        {review.name}
                                    </h1>
                                    <BadgeCheck className="size-3 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-900 zara">
                                {getFormattedDate(review.date)}
                                {/* {formatDate(review.date)} */}
                            </p>
                        </div>
                        {review.images.length > 0 && (
                            <div className="w-full">
                                <Spotlight urls={review.images} custReview={true} />
                            </div>
                        )}
                        <div className="flex flex-col px-2">
                            <h1 className="prada font-medium text-gray-700 shine-text">Review</h1>
                            <p className="text-[#878d97] text-[12px]">{review.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex mt-5 w-full justify-end lg:justify-center">
                <button
                    onClick={loadMore}
                    disabled={visibleCount >= reviews.length}
                    className={`p-2 rounded-[2px] bg-gray-700  text-gray-200 disabled:cursor-not-allowed transition cursor-pointer`}
                >
                    {visibleCount >= reviews.length ? "No More Reviews" : "Load More"}
                </button>
            </div>
        </>
    );
}