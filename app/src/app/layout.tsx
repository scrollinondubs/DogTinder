import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dog Tinder - Find Your Perfect Pup",
  description: "Swipe to find and adopt your perfect furry companion",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="mobile-container">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
