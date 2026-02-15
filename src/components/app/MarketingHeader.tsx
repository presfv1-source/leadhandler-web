import Link from "next/link";
import { Building2 } from "lucide-react";
import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
  { href: "/contact", label: "Contact" },
] as const;

export function MarketingHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className={cn(CONTAINER, PAGE_PADDING, "flex h-14 sm:h-16 items-center justify-between gap-4")}>
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-bold text-primary sm:text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
        >
          <Building2 className="size-5 sm:size-6" aria-hidden />
          LeadHandler.ai
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-3 sm:gap-6" aria-label="Main">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
