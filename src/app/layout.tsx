import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Sora, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeadHandler.ai — SMS lead response and routing for brokerages",
  description: "Automatically engage, qualify, and route every new lead. Instant SMS follow-up and routing for real estate teams.",
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!clerkPublishableKey && process.env.NODE_ENV === "production") {
  throw new Error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY – required in production.");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <TooltipProvider>
          {children}
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </body>
    </html>
  );

  if (clerkPublishableKey) {
    return <ClerkProvider publishableKey={clerkPublishableKey}>{content}</ClerkProvider>;
  }
  return content;
}
