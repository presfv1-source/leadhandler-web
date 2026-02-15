"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CONTAINER_NARROW, TYPO } from "@/lib/ui";
import { cn } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/app/dashboard";
  const [role, setRole] = useState<"owner" | "agent">("owner");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message ?? "Login failed");
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className={cn(CONTAINER_NARROW, "w-full")}>
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          >
            <Building2 className="size-6" aria-hidden />
            LeadHandler.ai
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 sm:p-8">
          <h1 className={cn(TYPO.h1, "text-2xl")}>Continue to app</h1>
          <p className={cn(TYPO.muted, "mt-1 mb-6")}>Select your role to enter demo mode.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("owner")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    role === "owner"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/50"
                  )}
                >
                  <Building2 className="size-4" aria-hidden />
                  Owner
                </button>
                <button
                  type="button"
                  onClick={() => setRole("agent")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    role === "agent"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/50"
                  )}
                >
                  <User className="size-4" aria-hidden />
                  Agent
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Name (optional)
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "owner" ? "Demo Owner" : "Demo Agent"}
                className="w-full"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Continue"}
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Button>
          </form>
          <p className={cn(TYPO.muted, "mt-6 text-center text-sm")}>
            Demo mode. No real credentials required.
          </p>
        </div>
        <p className={cn(TYPO.muted, "mt-6 text-center text-sm")}>
          <Link href="/" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Skeleton className="h-96 w-full max-w-md" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
