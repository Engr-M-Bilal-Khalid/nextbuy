"use client";

import { createContext, useEffect, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { getCookie, setCookie } from "@/lib/cookieHelpers";
import { successNotifier } from "@/lib/sonnerNotifications";

type GuestContextType = {
  guestId: string | null;
};

const GuestContext = createContext<GuestContextType>({ guestId: null });

export const GuestProvider = ({ children }: { children: React.ReactNode }) => {
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    let id = getCookie("guest-id");
    if (!id) {
      id = uuidv4();
      setCookie("guest-id", id, 7); // store for 7 days
    }
    setGuestId(id);
  }, []);

  return (
    <GuestContext.Provider value={{ guestId }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => useContext(GuestContext);
