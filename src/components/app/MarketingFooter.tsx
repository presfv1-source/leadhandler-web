import Link from "next/link";
import { CONTAINER, PAGE_PADDING, TYPO } from "@/lib/ui";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "LeadHandler.ai", primary: true },
  { href: "/pricing", label: "Pricing", primary: false },
  { href: "/security", label: "Security", primary: false },
  { href: "/privacy", label: "Privacy", primary: false },
  { href: "/terms", label: "Terms", primary: false },
  { href: "/contact", label: "Contact", primary: false },
] as const;

export function MarketingFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "mt-16 sm:mt-24 border-t border-border py-8",
        className
      )}
    >
      <div className={cn(CONTAINER, PAGE_PADDING, "text-center space-y-3")}>
        <p className={cn(TYPO.mutedSmall, "flex flex-wrap items-center justify-center gap-x-2 gap-y-1")}>
          {links.map(({ href, label, primary }, i) => (
            <span key={href}>
              {i > 0 && " · "}
              <Link
                href={href}
                className={primary ? "font-medium text-primary hover:underline" : "hover:underline"}
              >
                {label}
              </Link>
            </span>
          ))}
        </p>
        <p className={cn(TYPO.mutedSmall, "text-muted-foreground")}>
          © 2026 LeadHandler.ai · Houston, TX
        </p>
      </div>
    </footer>
  );
}
