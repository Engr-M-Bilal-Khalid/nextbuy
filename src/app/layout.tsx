import { AppProviders } from "@/Providers";
import "@/app/globals.css";
import Footer from "@/components/home/Footer";
import { InnerWidthWrapper, OuterWidthWrapper } from "@/components/wrappers/WidthWrappers";
import WrapLayout from "@/components/wrappers/conditionalLayout";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Zero Store",
    template: "%s | Zero Store",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`antialiased overflow-auto scrollbar-hide`}>
        <OuterWidthWrapper>
          <AppProviders>
            <WrapLayout />
            <Toaster position="top-right" richColors closeButton theme="dark" />
            <InnerWidthWrapper>{children}</InnerWidthWrapper>
            <Footer />
          </AppProviders>
        </OuterWidthWrapper>
      </body>
    </html>
  );
}
