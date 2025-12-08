import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dog Tinder - Find Your Perfect Pup",
  description: "Swipe to find and adopt your perfect furry companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mobile-container">{children}</div>
      </body>
    </html>
  );
}
