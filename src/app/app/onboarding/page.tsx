"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Link2, UserPlus, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Set up your brokerage", icon: Building2 },
  { id: 2, title: "Connect your first integration", icon: Link2 },
  { id: 3, title: "Invite your first agent", icon: UserPlus },
  { id: 4, title: "You're ready!", icon: CheckCircle },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [brokerage, setBrokerage] = useState({ name: "", phone: "", timezone: "America/Chicago" });
  const [agent, setAgent] = useState({ name: "", email: "" });

  async function handleStep1() {
    if (!brokerage.name.trim()) {
      toast.error("Enter your brokerage name");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 1, brokerage }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Brokerage saved");
        setStep(2);
      } else toast.error(data.error?.message ?? "Failed to save");
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  }

  function handleStep2Next() {
    setStep(3);
  }

  async function handleStep3Submit() {
    const hasEmail = agent.email.trim();
    if (hasEmail) {
      setLoading(true);
      try {
        const res = await fetch("/api/airtable/agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: agent.name.trim(), email: agent.email.trim() }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Agent added");
        } else {
          toast.error(data.error?.message ?? "Failed to add agent");
          return;
        }
      } catch {
        toast.error("Failed to add agent");
        return;
      } finally {
        setLoading(false);
      }
    } else if (agent.name.trim() && !hasEmail) {
      toast.error("Email is required to add an agent");
      return;
    }
    setStep(4);
  }

  function handleStep3Skip() {
    setStep(4);
  }

  async function handleComplete() {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complete: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("You're all set!");
        router.push("/app/dashboard");
        router.refresh();
      } else toast.error(data.error?.message ?? "Failed");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <PageHeader
        title="Welcome to LeadHandler"
        subtitle="Complete these steps to get your brokerage set up."
      />
      <div className="flex gap-2">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={`h-1 flex-1 rounded-full ${
              s.id <= step ? "bg-blue-600" : "bg-slate-200"
            }`}
            aria-hidden
          />
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-slate-900">Set up your brokerage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brokerage-name" className="font-sans">Brokerage name</Label>
              <Input
                id="brokerage-name"
                value={brokerage.name}
                onChange={(e) => setBrokerage((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Houston Premier Realty"
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brokerage-phone" className="font-sans">Phone</Label>
              <Input
                id="brokerage-phone"
                type="tel"
                value={brokerage.phone}
                onChange={(e) => setBrokerage((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+1 713 555 1234"
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="font-sans">Timezone</Label>
              <Input
                id="timezone"
                value={brokerage.timezone}
                onChange={(e) => setBrokerage((p) => ({ ...p, timezone: e.target.value }))}
                placeholder="America/Chicago"
                className="font-sans"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleStep1}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 font-sans"
            >
              Continue
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-slate-900">Connect your integrations later</CardTitle>
            <CardDescription className="font-sans">
              You can connect Twilio for SMS and add your Make.com webhook URL in Settings when you&apos;re ready to receive and qualify leads.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={handleStep2Next}
              className="bg-blue-600 hover:bg-blue-700 font-sans"
            >
              Skip for now
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-slate-900">Add your first agent</CardTitle>
            <CardDescription className="font-sans">
              Add an agent to receive leads. You can add more later in Settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name" className="font-sans">Agent name</Label>
              <Input
                id="agent-name"
                value={agent.name}
                onChange={(e) => setAgent((p) => ({ ...p, name: e.target.value }))}
                placeholder="Sarah Mitchell"
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-email" className="font-sans">Email</Label>
              <Input
                id="agent-email"
                type="email"
                value={agent.email}
                onChange={(e) => setAgent((p) => ({ ...p, email: e.target.value }))}
                placeholder="sarah@brokerage.com"
                className="font-sans"
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              onClick={handleStep3Submit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 font-sans"
            >
              Continue
            </Button>
            <Button variant="ghost" onClick={handleStep3Skip} className="font-sans" disabled={loading}>
              Skip for now
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-slate-900">You&apos;re all set</CardTitle>
            <CardDescription className="font-sans">
              Turn on Demo Mode to explore with sample data, or connect your integrations in Settings and start receiving real leads.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 font-sans"
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
