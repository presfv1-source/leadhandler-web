import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost";

export function Button({
  children,
  href,
  variant = "primary",
  className,
  type,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold font-sans transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";
  const styles = {
    primary:
      "bg-[#2563EB] text-white hover:opacity-90",
    ghost:
      "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
  };
  const combined = cn(base, styles[variant], className);

  if (href) {
    return (
      <Link href={href} className={combined}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type ?? "button"}
      className={combined}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
