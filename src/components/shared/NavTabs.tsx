import { Dispatch, SetStateAction } from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";
import '../../app/style.css'

type Position = {
  left: number;
  width: number;
  opacity: number;
};

const Tab = ({
  children,
  setPosition,
  setActiveRef,
  href
}: {
  children: string;
  setPosition: Dispatch<SetStateAction<Position>>;
  setActiveRef: Dispatch<SetStateAction<HTMLLIElement | null>>;
  href: string;
}) => {
  const ref = React.useRef<HTMLLIElement | null>(null);

  const updatePosition = () => {
    if (!ref.current) return;
    const { width } = ref.current.getBoundingClientRect();
    setPosition({
      left: ref.current.offsetLeft,
      width,
      opacity: 1,
    });
  };

  return (
    <li
      ref={ref}
      onMouseEnter={updatePosition}
      onClick={() => {
        setActiveRef(ref.current); // remember active tab
        updatePosition(); // keep it highlighted
      }}
      className="relative z-10 block cursor-pointer px-3 py-3 text-white mix-blend-difference"
    >
      <Link href={href} className="fontSatoshiLi">
        {children}
      </Link>
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{ ...position }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="absolute z-0 h-12 rounded-full bg-[#f0f0f0] shadow shadow-gray-50 border border-gray-50"
    />
  );
};

const NavTabs = () => {
  const [position, setPosition] = React.useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [activeRef, setActiveRef] = React.useState<HTMLLIElement | null>(null);

  return (
    <ul
      onMouseLeave={() => {
        // When leaving, either return to active tab highlight or hide it
        if (activeRef) {
          const { width } = activeRef.getBoundingClientRect();
          setPosition({
            left: activeRef.offsetLeft,
            width,
            opacity: 1,
          });
        } else {
          setPosition((pv) => ({ ...pv, opacity: 0 }));
        }
      }}
      className="hidden xl:flex xl:space-x-1 w-full max-w-2xl xl:relative xl:left-10 text-gray-700"
    >
      <Tab setPosition={setPosition} href="/products" setActiveRef={setActiveRef}>Products</Tab>
      <Cursor position={position} />
    </ul>
  );
};

export default NavTabs




