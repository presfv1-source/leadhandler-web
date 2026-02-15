"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONTAINER_NARROW, TYPO } from "@/lib/ui";
import { cn } from "@/lib/utils";

type Role = "owner" | "agent";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<Role | null>(null);

  async function handleContinue(role: Role) {
    setLoading(role);
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error?.message ?? "Something went wrong");
        setLoading(null);
        return;
      }
      toast.success("Welcome!");
      router.push("/app/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-12">
      <div className={cn(CONTAINER_NARROW, "w-full")}>
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-md"
          >
            <Building2 className="size-6" aria-hidden />
            LeadHandler.ai
          </Link>
        </div>

        <Card className="border-indigo-200/50 dark:border-indigo-500/20 shadow-lg shadow-indigo-500/5">
          <CardHeader className="text-center pb-2">
            <CardTitle className={cn(TYPO.h1, "text-2xl")}>
              Continue to app
            </CardTitle>
            <CardDescription className={cn(TYPO.muted, "mt-1")}>
              Select your role to enter demo mode.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-2">
            <Button
              type="button"
              onClick={() => handleContinue("owner")}
              disabled={loading !== null}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white focus-visible:ring-indigo-500"
            >
              <Building2 className="size-4" aria-hidden />
              {loading === "owner" ? "Signing in…" : "Continue as Owner"}
            </Button>
            <Button
              type="button"
              onClick={() => handleContinue("agent")}
              disabled={loading !== null}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white focus-visible:ring-indigo-500"
            >
              <User className="size-4" aria-hidden />
              {loading === "agent" ? "Signing in…" : "Continue as Agent"}
            </Button>
          </CardContent>
        </Card>

        <p className={cn(TYPO.muted, "mt-6 text-center text-sm")}>
          <Link
            href="/"
            className="text-indigo-600 dark:text-indigo-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
