import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DiscountBanner() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  return (
    <AnimatePresence>
        {isVisible && (
          <motion.div
            id="discountAlert"
            className="bg-gray-50 w-full h-12 xl:h-10 fontSatoshi text-gray-700 shine-effect xl:text-sm text-center flex justify-center items-center flex-col relative px-4 sm:h-11 sm:flex-row rounded-[10px] text-[12px]"
            initial={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -50,
              height: 0,
              transition: { duration: 1 },
            }}
          >
            <p className="shine-effect">Sign up and get 20% off to your first order.</p>
            <Link href="/sign-up" className="ml-3 link font-bold">
              Sign up Now
            </Link>
            <button
              className="absolute right-2 xl:right-2 rounded-full border-1 border-gray-700 p-0.75"
              onClick={() => setIsVisible(false)}
            >
              <X className="size-4 stroke-1 text-gray-700"/>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
