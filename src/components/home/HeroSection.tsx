import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="flex lg:px-8 xl:px-6 xl:space-x-30 lg:space-x-5 bg-[#f2f0f1] flex-col lg:flex-row space-x-0 space-y-10 w-full mt-5 lg:mt-0 xl:pt-10">
            {/* Text content with headline, description, and shop button */}
            <div className="flex flex-col lg:space-y-6 space-y-6 lg:py-15 pt-10 xl:p-0 px-5">
              <h1 className="fontIntegral text-4xl xl:text-6xl">
                Find clothes that matches your style
              </h1>
              <p className="text-[#5d5c5c] fontSatoshi">
                Browse through our diverse range of meticulously crafted garments,<br /> designed to bring out your individuality and cater to your sense of style
              </p>
              <Button className="md:w-[30%] rounded-[20px] font-light w-[90%]">Shop now</Button>
              {/* Statistics of brands, quality products, and happy customers */}
              <div className="flex space-x-10 xl:space-x-15 lg:space-x-5 sm:space-x-30">
                <div className="border-r-1 border-gray-400 xl:pr-15 flex flex-col pr-5 lg:pr-4 sm:pr-10">
                  <h1 className="fontIntegral lg:text-2xl text-xl">200 +</h1>
                  <p className="text-[#5d5c5c] fontSatoshi">Brands</p>
                </div>
                <div className="border-r-1 border-gray-400 xl:pr-15 flex flex-col pr-5 lg:pr-4 sm:pr-10">
                  <h1 className="fontIntegral lg:text-2xl text-xl">20000 +</h1>
                  <p className="text-[#5d5c5c] fontSatoshi">Quality Products</p>
                </div>
                <div className="lg:border-r-1 lg:border-gray-400 xl:pr-15 flex flex-col lg:pr-4">
                  <h1 className="fontIntegral lg:text-2xl text-xl">30000 +</h1>
                  <p className="text-[#5d5c5c] fontSatoshi">Happy Customers</p>
                </div>
              </div>
            </div>
    
            {/* Decorative SVGs and banner image */}
            <div className="relative xl:right-5 lg:top-1 top-0 xl:top-0 left-10 right-0 lg:left-0 lg:right-10 w-[88%] xl:w-full lg:w-[80%] sm:left-50 sm:w-[55%]">
              {/* SVG decorations positioned differently based on screen size */}
              <div className="absolute lg:top-10 lg:right-20 right-30 top-20 hidden lg:block xl:top-20 xl:right-50">
                <svg viewBox="0 0 100 100" width="10" height="10">
                  <path d="M50,0 Q65,25 100,50 Q75,65 50,100 Q35,75 0,50 Q25,35 50,0 Z" fill="black" />
                </svg>
              </div>
              <div className="absolute lg:top-35 xl:left-125 top-30 left-0 sm:left-100 lg:hidden lg:right-0  xl:top-0">
                <svg viewBox="0 0 100 100" width="40" height="40">
                  <path d="M50,0 Q65,25 100,50 Q75,65 50,100 Q35,75 0,50 Q25,35 50,0 Z" fill="black" />
                </svg>
              </div>
              <div className="absolute lg:left-10 lg:top-40 right-5 top-10 sm:left-[-180] lg:block">
                <svg viewBox="0 0 100 100" width="30" height="30">
                  <path d="M50,0 Q65,25 100,50 Q75,65 50,100 Q35,75 0,50 Q25,35 50,0 Z" fill="black" />
                </svg>
              </div>
              {/* Main banner image */}
              <img src="/assets/banner-img.png" alt="Banner img" className="lg:size-110 size-90" />
            </div>
          </div>
  );
}
