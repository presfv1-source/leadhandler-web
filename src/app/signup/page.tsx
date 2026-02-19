import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "LeadHandler.ai — Start your free trial",
  description:
    "AI-powered SMS lead qualification and routing for real estate brokerages. 14 days free.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand (hidden on mobile) */}
      <div
        className={cn(
          "hidden lg:flex lg:w-1/2 flex-col justify-between p-10 xl:p-16",
          "bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500"
        )}
      >
        <Link
          href="/"
          className="font-display font-bold text-xl text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md"
        >
          LeadHandler.ai
        </Link>
        <div>
          <h2 className="font-display font-bold text-3xl xl:text-4xl text-white tracking-tight mb-6">
            Respond first. Close more.
          </h2>
          <ul className="space-y-4 font-sans text-white/95 text-sm">
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 shrink-0 text-white" aria-hidden />
              AI SMS qualification in seconds
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 shrink-0 text-white" aria-hidden />
              Smart routing to the right agent
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 shrink-0 text-white" aria-hidden />
              Full brokerage visibility
            </li>
          </ul>
          <blockquote className="mt-10 pl-4 border-l-4 border-white/40 font-sans text-white/90 text-sm italic">
            &ldquo;We went from missing leads to booking appointments automatically.&rdquo;
            <footer className="mt-2 not-italic text-white/80">
              — Sarah M., Houston Broker
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link
              href="/"
              className="font-display font-bold text-xl text-[#0A0A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
            >
              LeadHandler<span className="text-blue-600">.ai</span>
            </Link>
          </div>
          <SignUp
            redirectUrl="/app/dashboard"
            signInUrl="/login"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none rounded-2xl border-0 p-0",
                headerTitle: "font-display font-bold text-2xl text-[#0A0A0A]",
                headerSubtitle: "font-sans text-gray-500",
                socialButtonsBlockButton: "rounded-xl border border-gray-200 font-sans",
                formFieldInput: "rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                formButtonPrimary: "rounded-xl bg-[#2563EB] hover:opacity-90 font-sans font-semibold",
                footerActionLink: "text-blue-600 font-sans",
              },
              variables: {
                colorPrimary: "#2563EB",
                colorText: "#0A0A0A",
                colorTextSecondary: "#6B7280",
              },
            }}
          />
          <p className="text-center mt-6 font-sans text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in →
            </Link>
          </p>
          <p className="text-center mt-4 font-sans text-xs text-gray-400">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
