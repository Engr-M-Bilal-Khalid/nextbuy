"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import { cn } from "@/lib/utils";
import '@/app/style.css'
import { NavItem, navItems, othersItems } from "../configuration";
import { ChevronDown } from "lucide-react";



const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const isMobile = typeof window !== "undefined" ? window.matchMedia("(max-width: 1023px)").matches : false;
  const showTextDesktop = isExpanded || isHovered || isMobileOpen;
  const showText = isMobile ? true : showTextDesktop;

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ([
      { type: "main" as const, items: navItems },
      { type: "others" as const, items: othersItems },
    ] as const).forEach(({ type, items }) => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type, index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];
      if (el) {
        setSubMenuHeight((prev) => ({ ...prev, [key]: el.scrollHeight || 0 }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => {
        const active =
          nav.path ? isActive(nav.path) : openSubmenu?.type === menuType && openSubmenu?.index === index;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => showText && handleSubmenuToggle(index, menuType)}
                className={`
    group flex items-center w-full rounded-lg transition-colors
    ${showText ? "px-4 py-2" : "justify-center p-2"}
    ${active
                    ? "bg-indigo-100 text-indigo-500"
                    : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }
  `}
                title={!showText ? nav.name : undefined}
              >
                <nav.icon
                  className={`
      size-5 stroke-1 mb-0.25 transition-colors
      ${active ? "text-indigo-700" : "text-gray-700 group-hover:text-indigo-600"}
    `}
                />

                {showText && (
                  <span
                    className={`
        px-4 text-base font-medium transition-colors
        ${active ? "" : "group-hover:text-indigo-600"}
      `}
                  >
                    {nav.name}
                  </span>
                )}

                {showText && (
                  <ChevronDown
                    className={`
        ml-auto size-4 stroke-1 transition-transform duration-300
        ${active
                        ? "rotate-180 text-indigo-700"
                        : "text-gray-700 group-hover:text-indigo-600"
                      }
      `}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`
                    flex items-center rounded-lg transition-colors font-medium
                    ${showText ? "px-4 py-2" : "justify-center p-2"}
                    ${active ? "bg-indigo-100 text-indigo-500" : "text-gray-700 hover:bg-gray-50 hover:text-gray-600"}
                  `}
                  title={!showText ? nav.name : undefined}
                >
                  <nav.icon className={cn(`size-5 text-gray-700 mb-0.25 stroke-1`, active ? "text-indigo-700" : null)} />
                  {showText && <span className="text-base px-4">{nav.name}</span>}
                </Link>
              )
            )}

            {/* Submenu only when labels visible (desktop expanded) or on mobile */}
            {nav.subItems && showText && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-8">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`
                          flex items-center px-3 py-1.5 rounded-md text-gray-600
                          hover:bg-indigo-200 hover:text-indigo-500 transition-colors
                          ${isActive(subItem.path) ? "bg-indigo-100 text-indigo-500 font-semibold" : ""}
                        `}
                      >
                        <span className="text-sm">{subItem.name}</span>
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] rounded font-bold">
                              NEW
                            </span>
                          )}
                          {subItem.pro && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 text-[10px] rounded font-bold">
                              PRO
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`
        fixed mt-1 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800
        text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${showText ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      {
        !isMobile
          ?
          <div
            className={`py-8 flex items-center ${showText ? "justify-start" : "justify-center"}`}
          >
            <Link href="/">


              <Image
                src="/logo/logoWatch.png"
                alt="Logo"
                width={showText ? 40 : 32}
                height={showText ? 50 : 32}
              />


            </Link>

            {
              isExpanded
              ?
              <h1 className={cn("ml-4 text-gray-700 font-extrabold shine-effect text-2xl zara uppercase tracking-wide")}>Store name</h1>
              :
              null
            }

          </div>
          :
          null
      }


      {/* Scrollable nav */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear scrollbar-hide mt-18 lg:mt-0">
        <nav className="mb-6">
          <div className="flex flex-col gap-4 ">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-700 tracking-widest underline underline-offset-3`}>
                {showText ? "Dashboard" : <img src="/icons/horizontal-dots.svg" className="size-5 ml-4" alt="Menu" />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-700 tracking-widest  underline underline-offset-3`}>
                {showText ? "C-M-S" : <img src="/icons/horizontal-dots.svg" className="size-5 ml-4" alt="Others" />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
