"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CONTAINER, PAGE_PADDING } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AGENT_OPTIONS = [
  { value: "1-5", label: "1-5" },
  { value: "6-15", label: "6-15" },
  { value: "16-30", label: "16-30" },
  { value: "30+", label: "30+" },
] as const;

const BEST_TIME_OPTIONS = [
  { value: "Morning", label: "Morning" },
  { value: "Afternoon", label: "Afternoon" },
  { value: "Evening", label: "Evening" },
] as const;

export function BetaAccessForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [city, setCity] = useState("");
  const [agents, setAgents] = useState("");
  const [phone, setPhone] = useState("");
  const [bestTime, setBestTime] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !name.trim() ||
      !email.trim() ||
      !brokerage.trim() ||
      !city.trim() ||
      !agents ||
      !phone.trim() ||
      !bestTime
    ) {
      return;
    }
    setStatus("loading");
    try {
      const source = [
        `Brokerage: ${brokerage.trim()}`,
        `City: ${city.trim()}`,
        `Agents: ${agents}`,
        `Phone: ${phone.trim()}`,
        `Best time: ${bestTime}`,
      ].join("; ");
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          source,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        console.error("[BetaAccessForm] waitlist error:", data);
        setStatus("error");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setBrokerage("");
      setCity("");
      setAgents("");
      setPhone("");
      setBestTime("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="beta-form" className="py-16 md:py-24 bg-white">
      <div className={cn(CONTAINER, PAGE_PADDING)}>
        <div className="max-w-lg mx-auto">
          <h2 className="font-display font-bold text-[#0A0A0A] tracking-tight text-center text-[clamp(2rem,4vw,3rem)] mb-2">
            Request beta access.
          </h2>
          <p className="font-sans text-gray-600 text-center mb-8">
            Limited spots. Texas brokerages only (for now).
          </p>

          {status === "success" ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="font-sans text-lg text-[#0A0A0A]">
                You&apos;re on the list. We&apos;ll reach out within 24 hours.
              </p>
            </div>
          ) : status === "error" ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-sans text-gray-700">
                Something went wrong — email us at{" "}
                <a
                  href="mailto:hello@leadhandler.ai"
                  className="text-blue-600 underline"
                >
                  hello@leadhandler.ai
                </a>
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="beta-name">Full name *</Label>
                <Input
                  id="beta-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  disabled={status === "loading"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beta-email">Email *</Label>
                <Input
                  id="beta-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@brokerage.com"
                  required
                  disabled={status === "loading"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beta-brokerage">Brokerage name *</Label>
                <Input
                  id="beta-brokerage"
                  value={brokerage}
                  onChange={(e) => setBrokerage(e.target.value)}
                  placeholder="Your brokerage"
                  required
                  disabled={status === "loading"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beta-city">City *</Label>
                <Input
                  id="beta-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  required
                  disabled={status === "loading"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beta-agents">Number of agents *</Label>
                <Select
                  value={agents}
                  onValueChange={setAgents}
                  required
                  disabled={status === "loading"}
                >
                  <SelectTrigger id="beta-agents" className="w-full">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGENT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="beta-phone">Phone number *</Label>
                <Input
                  id="beta-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  required
                  disabled={status === "loading"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beta-time">Best time to reach you *</Label>
                <Select
                  value={bestTime}
                  onValueChange={setBestTime}
                  required
                  disabled={status === "loading"}
                >
                  <SelectTrigger id="beta-time" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {BEST_TIME_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={
                  status === "loading" ||
                  !name.trim() ||
                  !email.trim() ||
                  !brokerage.trim() ||
                  !city.trim() ||
                  !agents ||
                  !phone.trim() ||
                  !bestTime
                }
                className="w-full min-h-[48px] rounded-xl font-semibold"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Request beta access
                  </>
                ) : (
                  "Request beta access"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
