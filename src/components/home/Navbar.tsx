"use client"
import '@/app/style.css';
import { PlaceholdersAndVanishInput as AcertinityInput } from "@/components/acertinityUI/input";
import NavTabs from "@/components/shared/NavTabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { LogIn, MenuIcon, Pencil, Percent, ShoppingCartIcon, Ticket, TruckElectric, UserRoundPen, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import QuantityCounter from '../productsSpotLight/QuantityCounter';
import { successNotifier } from '@/lib/sonnerNotifications';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from '../ui/separator';
import { motion } from "framer-motion"
import { FaTiktok } from "react-icons/fa";
import { FaFacebookF, FaLinkedinIn, FaSquareInstagram, FaSquareWhatsapp } from "react-icons/fa6";
import { cn } from '@/lib/utils';




interface Props {
  placeholders: any,
  onChange: any,
  onSubmit: any,
}

export default function Navbar({ placeholders, onChange, onSubmit }: Props) {

  const { isAuthenticated, clearAuth } = useAuth();
  const { fullCart, fetchCart, removeFromCart, updateQuantity } = useCart();
  const isUserLoggedIn: Boolean = isAuthenticated;
  const [openSection, setOpenSection] = useState<null | "note" | "shipping" | "coupon">(null);
  const [postalCode, setPostalCode] = useState("");
  const [shippingRate, setShippingRate] = useState<number | null>(null);




  function LogOut() {
    clearAuth();
  }

  // 🔹 Load cart when Navbar mounts
  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (variantId: string, productName: string) => {
    try {
      await removeFromCart(variantId);
      successNotifier.notify(`Removed ${productName}`);
      fetchCart()
    } catch (error) {
      // Handle error or show failure notification here
      console.error("Failed to remove item", error);
    }
  };

  const cartTotal = fullCart?.items.reduce((total, item) => {
    const discountedPrice = parseFloat(item.price_without_discount) * (1 - Number(item.discount) / 100);
    const qty = item.quantity || 1; // 👈 use actual quantity state if you have it
    return total + discountedPrice * qty;
  }, 0);


  const phoneNumber = "923703041266" // 👈 replace with your number
  const message = "Hello! I want to place an order." // 👈 custom message

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank") // open WhatsApp in new tab/app
  }



  return (
    <nav className="w-full h-18 flex items-center justify-between">
      <Sheet>
        <SheetTrigger className="block xl:hidden">
          <MenuIcon className="size-8 stroke-1" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[200px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle className="px-4">

              <img src="/logo/logoWatch.png" className="size-20 lg:h-12 lg:w-30 rounded-[10px]" />
            </SheetTitle>
            <ul className="flex flex-col py-2 px-4 space-y-5">
              <li>
                <Link href="products">Products</Link>
              </li>
            </ul>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <img src="/logo/logoWatch.png" className="size-10 lg:h-12 lg:w-30 rounded-[10px] ml-4 xl:ml-0" />
      <NavTabs />
      <AcertinityInput
        className="hidden lg:flex lg:w-[50%] xl:w-[60%] xl:mr-10"
        placeholders={placeholders}
        onChange={onChange}
        onSubmit={onSubmit}
      />
      <div className="flex text-black space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <ShoppingCartIcon className="size-8 stroke-1" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[450px] max-w-[700px]">
            <SheetHeader>
              <SheetTitle className="">
                <p className='text-3xl text-gray-800 font-extrabold font-mono underline underline-offset-8'>Shoping Cart</p>
              </SheetTitle>
            </SheetHeader>
            {
              !fullCart
                ? <div>Loading cart...</div>
                : fullCart.items.length === 0
                  ?
                  <div className="flex items-center justify-center h-full min-h-[200px]">
                    <img
                      src="/assets/emptycart.png"
                      alt="Empty cart"
                      width={290}
                      height={290}
                      className=""
                    />
                  </div>

                  : (
                    <ul className="flex flex-col space-y-5 p-4 overflow-y-auto scrollbar-hide">
                      {fullCart.items.map(item => (
                        <>
                          <li
                            key={item.item_id}
                            className="relative border-1 flex flex-row space-x-3 border-gray-400 rounded-[3px] py-2 px-2 items-center"
                          >
                            <div
                              className="
                  cursor-pointer absolute -right-6 -top-3 bg-red-50 w-6 h-6 rounded-full border border-red-600 
                  flex justify-center items-center transition-color duration-300 ease-in-out 
                  hover:bg-red-600 hover:text-white hover:border-red-600 
                  active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 
                "
                              title="Remove from cart"
                              onClick={() => handleRemove(item.variant_id, item.product_name)}
                            >
                              <X className="stroke-1 size-4" />
                            </div>

                            <div className="flex  rounded-[2px] border-1  border-gray-200 shadow-accent w-[100px] h-[100px] p-1">
                              <img src={item.firstimage} alt={item.product_name} width={100} className="object-cover" />
                            </div>
                            <div className="flex flex-col space-y-0.25">
                              <p className="prada text-sm lg:text-[16px] font-bold text-gray-700 shine-text tracking-wide">{item.product_name}</p>
                              <p className="text-gray-800 text-sm lg:text-[16px] prada tracking-wide">Color : {item.name}</p>
                              <p className="text-gray-700 flex flex-row space-x-3 text-sm lg:text-[16px]">
                                <del>Rs: {item.price_without_discount}</del>
                                <span className='text-gray-900  font-bold'>
                                  Rs: {(parseFloat(item.price_without_discount) * (1 - Number(item.discount) / 100)).toFixed(2)}
                                </span>
                              </p>
                              <QuantityCounter
                                stock={10}
                                initialQuantity={item.quantity}
                                onChange={(qty) => updateQuantity(item.variant_id, qty)}
                                className="ml-0"
                                inputClassName="w-10 text-center placeholder:text-red-900 border rounded text-gray-900 font-normal"
                              />
                            </div>
                          </li>
                        </>
                      ))}
                    </ul>
                  )
            }

            <SheetFooter className="flex flex-col space-y-1 bg-gray-100">
              {/* Buttons */}
              <div className="flex flex-row space-x-3">
                <button
                  onClick={() => setOpenSection(openSection === "note" ? null : "note")}
                  className="bg-white text-gray-800 text-[12px] xl:text-sm border border-gray-800 rounded-[5px] p-2 w-full
          transition-all duration-300 ease-in-out cursor-pointer
          hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5 flex flex-row space-x-1 items-center justify-center"
                >
                  <Pencil className="size-3 xl:size-4 stroke-1 text-emerald-600 fill-emerald-50" />
                  <span>Note</span>
                </button>

                <button
                  onClick={() => setOpenSection(openSection === "shipping" ? null : "shipping")}
                  className="bg-white text-gray-800 text-[12px] xl:text-sm border border-gray-800 rounded-[5px] p-2 w-full
          transition-all duration-300 ease-in-out cursor-pointer
          hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5 flex flex-row space-x-1 items-center justify-center"
                >
                  <TruckElectric className="size-3 xl:size-4 stroke-1 text-emerald-600 fill-emerald-50" />
                  <span>Shipping</span>
                </button>

                <button
                  onClick={() => setOpenSection(openSection === "coupon" ? null : "coupon")}
                  className="bg-white text-gray-800 text-[12px] xl:text-sm border border-gray-800 rounded-[5px] p-2 w-full
          transition-all duration-300 ease-in-out cursor-pointer
          hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5 flex flex-row space-x-1 items-center justify-center"
                >
                  <Ticket className="size-3 xl:size-4 stroke-1 text-gray-800 fill-emerald-50" />
                  <span>Coupon</span>
                </button>
              </div>

              {/* Sliding div */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden  ${openSection ? "h-auto max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="relative w-full bg-white rounded-md shadow-md p-4">
                  {/* Remove (X) button */}
                  <button
                    onClick={() => setOpenSection(null)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-700 transition-colors rounded-full size-6 bg-red-100 flex justify-center items-center"
                  >
                    <X className="size-4 stroke-2" />
                  </button>

                  {/* Section Content */}
                  {openSection === "note" && (
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-gray-800">
                        <Pencil className="size-3 xl:size-4 stroke-1 text-emerald-600 fill-emerald-50" />
                        <span>Add note for seller</span>
                      </h3>
                      <textarea
                        placeholder="Special instructions for seller"
                        className="w-full mt-2 p-2 border rounded-md resize-none text-sm"
                      />
                      <button className="w-full mt-3 py-2 rounded-md bg-gray-700 text-white font-semibold hover:bg-gray-600 transition">
                        SAVE
                      </button>
                    </div>
                  )}

                  {openSection === "shipping" && (
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-gray-800">
                        <TruckElectric className="size-3 xl:size-4 stroke-1 text-emerald-600 fill-emerald-50" />
                        <span>Estimate shipping rates</span>
                      </h3>

                      {/* Country Select */}
                      <Select>
                        <SelectTrigger className="w-full mt-2">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Countries</SelectLabel>
                            <SelectItem value="pakistan">Pakistan</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {/* Postal Code + State */}
                      <input
                        type="text"
                        maxLength={5}
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Postal/Zip Code"
                        className="w-full mt-2 p-2 border rounded-md text-sm"
                      />

                      {/* Calculate Button */}
                      <button
                        onClick={() => setShippingRate(0)}
                        disabled={postalCode.length !== 6}
                        className={`w-full mt-3 py-2 rounded-md font-semibold transition ${postalCode.length === 6
                          ? "bg-gray-700 text-white hover:bg-gray-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        CALCULATE
                      </button>

                      {/* Show Result */}
                      {shippingRate !== null && (
                        <p className="mt-2 text-gray-700 font-medium">
                          Shipping Rate: <span className="text-green-600">0</span>
                        </p>
                      )}
                    </div>
                  )}


                  {openSection === "coupon" && (
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-gray-800">
                        <Ticket className="size-3 xl:size-4 stroke-1 text-gray-800 fill-emerald-50" />
                        <span>Add a discount code</span>
                      </h3>
                      <input
                        type="text"
                        placeholder="Enter discount code here"
                        className="w-full mt-2 p-2 border rounded-md text-sm"
                      />
                      <button
                        className="w-full tracking-wider cursor-pointer flex items-center justify-center mt-3 lg:mt-3 py-2 bg-gray-700 text-white rounded-[2px]"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>


              {/* Subtotal */}
              <div className="flex flex-row justify-between text-gray-800 text-sm lg:text-2xl font-medium tracking-wider">
                <p>Subtotal</p>
                <span>Rs: {cartTotal?.toFixed(2)}</span>
              </div>

              <Separator className='my-1' />

              <div className='flex flex-col'>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 800, damping: 20 }}
                >
                  <Button
                    className="w-full tracking-widest p-2 py-4 cursor-pointer flex items-center justify-center mt-3 lg:mt-0 uppercase
                   bg-gray-700 hover:bg-gray-50 hover:text-gray-800 border border-gray-700 text-white rounded-[2px] transtion duration-500 ease-in-out"
                  >
                    <Link href="/checkout">Go to Checkout</Link>
                  </Button>
                </motion.div>

                <Button
                  variant="link"
                  className="w-full tracking-wider p-2 py-4 cursor-pointer  text-gray-800 rounded-[2px] mt-1"
                  onClick={() => alert(`Add`)}
                >
                  <Link href='/viewCart'>View cart</Link>
                </Button>
                <div className='absolute size-auto right-5 bottom-2'>
                  <button
                    type="button"
                    className={cn(`cursor-pointer transition-all duration-500 ease-in-out hover:scale-120`, "text-white ")}
                    title='Order on whatsapp'
                    onClick={handleWhatsAppClick}
                  >
                    <FaSquareWhatsapp className="size-10 fill-emerald-500 z-10 text-white bg-transparent" />
                  </button>
                </div>
              </div>


            </SheetFooter>

          </SheetContent>

        </Sheet>

        {/* Cart Drawer */}


        {
          isUserLoggedIn
            ?
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <UserRoundPen className="size-8 stroke-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-3 mt-1 w-[7rem] tracking-wide  shine-effect text-gray-700 text-center">
                <DropdownMenuItem >
                  <span><Link href="/profile" className="underline font-bold">Go to Profile</Link></span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem >
                  <span className="underline font-bold text-red-500" onClick={LogOut}>LogOut</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            :
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <LogIn className="size-8 stroke-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-3 mt-1 w-[10rem] tracking-wide  shine-effect text-gray-700 text-center">
                <DropdownMenuItem >
                  <span><Link href="/signIn" className="underline font-bold">Sign in</Link></span>
                  or
                  <span><Link href="/signUp" className="underline font-bold">Sign up</Link></span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        }
      </div>
    </nav>
  )

}










