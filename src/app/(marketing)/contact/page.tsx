"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/app/MarketingHeader";
import { MarketingFooter } from "@/components/app/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CONTAINER_NARROW, PAGE_PADDING, TYPO } from "@/lib/ui";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Message sent. We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />

      <main className={cn(CONTAINER_NARROW, PAGE_PADDING, "flex-1 py-12 md:py-16")}>
        <h1 className={cn(TYPO.h1)}>Contact us</h1>
        <p className={cn(TYPO.muted, "mt-2")}>
          Have a question or want to see a demo for your brokerage? Send us a message.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@brokerage.com"
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              className="mt-2 min-h-[120px]"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Sending…" : "Send message"}
            <ArrowRight className="ml-2 size-4" aria-hidden />
          </Button>
        </form>
      </main>

      <MarketingFooter />
    </div>
  );
}
