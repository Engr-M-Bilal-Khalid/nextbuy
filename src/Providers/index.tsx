import React, { JSX, ReactNode } from "react";
import { SidebarProvider } from "@/app/dashboard/context/SidebarContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { AllProductProvider } from "@/context/AllProducts";
import { ProductProviderAdmin } from "@/context/ProductContextAdmin";
import { AllProductAdminProvider } from "@/context/AllProductsAdmin";
import { GuestProvider } from "@/context/GuestContext";
import { CartProvider } from "@/context/CartContext";

type Props = { children: ReactNode };
type Provider = React.ComponentType<Props>;

export const composeProviders = (...providers: Provider[]) =>
providers.reduceRight<React.ComponentType<Props>>(
(Accumulated, Provider) =>
function Combined({ children }: Props): JSX.Element {
return (
<Provider>
<Accumulated>{children}</Accumulated>
</Provider>
);
},
function Base({ children }: Props): JSX.Element {
return <>{children}</>;
}
);

export const AppProviders = composeProviders(
AuthProvider,
GuestProvider,
SidebarProvider,
AllProductProvider,
ProductProvider,
CartProvider,
ProductProviderAdmin,
AllProductAdminProvider
);