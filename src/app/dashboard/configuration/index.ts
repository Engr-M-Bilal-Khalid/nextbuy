import {
  Package,
  ShoppingCart,
  LayoutDashboard,
  Users,
  Percent,
  LineChart,
  Settings,
  FileText,
  Gauge,
  Activity
} from "lucide-react";


export type NavItem = {
  name: string;
  icon: string | any; // path to svg
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};


export const navItems: NavItem[] = [
  {
    icon: Activity,
    name: "Overview",
    path: "/dashboard",
  },
  {
    icon: Package,
    name: "Products",
    subItems: [
      { name: "All Products", path: "/dashboard/products" }
    ],
  },
  {
    icon: ShoppingCart,
    name: "Orders",
    subItems: [
      { name: "All Orders", path: "/dashboard/orders" }
    ],
  },
  {
    icon: Users,
    name: "Customers",
    path: "/dashboard/customers",
  },
  {
    icon: Percent,
    name: "Promotions",
    subItems: [
      { name: "Coupons", path: "/dashboard/promotions/coupons" },
    ],
  },
  {
    icon: LineChart,
    name: "Analytics",
    path: "#",
  },
  {
    icon: Settings,
    name: "Settings",
    subItems: [
      { name: "Store Settings", path: "#" },
      { name: "Shipping & Tax", path: "#" },
    ],
  },
];


export const othersItems: NavItem[] = [
  {
    icon: FileText,
    name: "Content",
    subItems: [
      { name: "Pages", path: "#" },
    ],
  },
];