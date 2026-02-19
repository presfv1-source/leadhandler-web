"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Agent } from "@/lib/types";
import type { Brokerage } from "@/lib/types";
import { DevTestToolsSection } from "@/components/app/DevTestToolsSection";

interface SettingsPageContentProps {
  session: { name?: string; email?: string } | null;
  brokerage: Brokerage;
  agents: Agent[];
  devToolsPhone: string;
}

export function SettingsPageContent({
  session,
  brokerage,
  agents,
  devToolsPhone,
}: SettingsPageContentProps) {
  const router = useRouter();
  const [, setGeneralSaved] = useState(false);
  const [emailNewLead, setEmailNewLead] = useState(true);
  const [smsHotLead, setSmsHotLead] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [qualPrompt, setQualPrompt] = useState("What is your budget and preferred area?");
  const [firstMsg, setFirstMsg] = useState("Hi {{name}}, thanks for reaching out! I'd love to help you find a home.");
  const [followUpMsg, setFollowUpMsg] = useState("Just following up — any questions about the listings I sent?");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  function handleGeneralSave() {
    setGeneralSaved(true);
    toast.success("Settings saved");
    router.refresh();
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Brokerage, integrations, and preferences."
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-slate-100 p-1 rounded-xl font-sans">
          <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white">
            General
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-lg data-[state=active]:bg-white">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-white">
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="danger" className="rounded-lg data-[state=active]:bg-white text-red-600">
            Danger Zone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display">General</CardTitle>
              <p className="text-sm text-slate-500 font-sans">Brokerage name, phone, timezone</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brokerage-name" className="font-sans">Brokerage name</Label>
                  <Input id="brokerage-name" defaultValue={brokerage.name} className="font-sans" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brokerage-phone" className="font-sans">Phone</Label>
                  <Input id="brokerage-phone" defaultValue={brokerage.phone ?? ""} className="font-sans" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brokerage-tz" className="font-sans">Timezone</Label>
                  <Input id="brokerage-tz" defaultValue={brokerage.timezone} className="font-sans" readOnly />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="brokerage-address" className="font-sans">Address</Label>
                  <Input id="brokerage-address" defaultValue={brokerage.address ?? ""} className="font-sans" readOnly />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-sans">Logo upload — coming soon</p>
              <Button onClick={handleGeneralSave} className="bg-blue-600 hover:bg-blue-700 font-sans">
                Save
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6 space-y-4">
          {[
            { name: "Twilio (SMS)", status: "Connected", detail: "Phone: +1 555 XXX XXXX" },
            { name: "Airtable", status: "Connected", detail: "Base linked" },
            { name: "Make.com", status: "Webhook", detail: "Webhook URL input below" },
            { name: "Zillow", status: "Coming soon", detail: "" },
            { name: "Realtor.com", status: "Coming soon", detail: "" },
          ].map((int) => (
            <Card key={int.name} className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="py-4 flex flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-display font-semibold text-slate-900">{int.name}</p>
                  {int.detail && <p className="text-sm text-slate-500 font-sans">{int.detail}</p>}
                </div>
                <span className={`text-sm font-sans ${int.status === "Coming soon" ? "text-slate-400" : "text-green-600"}`}>
                  {int.status}
                </span>
              </CardContent>
            </Card>
          ))}
          <div className="rounded-2xl border border-slate-200 p-4">
            <Label htmlFor="make-webhook" className="font-sans">Make.com webhook URL</Label>
            <Input id="make-webhook" placeholder="https://hook.eu1.make.com/..." className="mt-2 font-sans" />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display">Notifications</CardTitle>
              <p className="text-sm text-slate-500 font-sans">When to receive alerts</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "email-new", label: "Email on new lead", desc: "Get an email when a new lead is added", state: emailNewLead, set: setEmailNewLead },
                { id: "sms-hot", label: "SMS to owner on hot lead", desc: "Text when a lead is marked hot", state: smsHotLead, set: setSmsHotLead },
                { id: "daily", label: "Daily digest email", desc: "Summary of activity each day", state: dailyDigest, set: setDailyDigest },
                { id: "weekly", label: "Weekly report", desc: "Weekly performance summary", state: weeklyReport, set: setWeeklyReport },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                  <div>
                    <Label htmlFor={item.id} className="font-medium font-sans">{item.label}</Label>
                    <p className="text-xs text-slate-500 font-sans">{item.desc}</p>
                  </div>
                  <Switch id={item.id} checked={item.state} onCheckedChange={item.set} />
                </div>
              ))}
              <Button className="bg-blue-600 hover:bg-blue-700 font-sans">Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display">AI Settings</CardTitle>
              <p className="text-sm text-slate-500 font-sans">Qualification and message templates</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qual-prompt" className="font-sans">Qualification prompt</Label>
                <Textarea id="qual-prompt" value={qualPrompt} onChange={(e) => setQualPrompt(e.target.value)} className="mt-2 font-sans" rows={3} />
              </div>
              <div>
                <Label htmlFor="first-msg" className="font-sans">First message template</Label>
                <Textarea id="first-msg" value={firstMsg} onChange={(e) => setFirstMsg(e.target.value)} className="mt-2 font-sans" rows={2} />
              </div>
              <div>
                <Label htmlFor="followup-msg" className="font-sans">Follow-up message template</Label>
                <Textarea id="followup-msg" value={followUpMsg} onChange={(e) => setFollowUpMsg(e.target.value)} className="mt-2 font-sans" rows={2} />
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700 font-sans">Save</Button>
                <Button variant="ghost" className="font-sans text-slate-600">Reset to defaults</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="mt-6">
          <Card className="rounded-2xl border-2 border-red-200 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <p className="text-sm text-slate-500 font-sans">Permanently delete your brokerage account and all data.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="delete-confirm" className="font-sans">
                  Type <strong>{brokerage.name}</strong> to confirm
                </Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder={brokerage.name}
                  className="mt-2 border-red-200 font-sans"
                />
              </div>
              <Button
                variant="destructive"
                disabled={deleteConfirm !== brokerage.name}
                className="font-sans"
              >
                Delete Brokerage Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DevTestToolsSection phoneNumber={devToolsPhone} />
    </div>
  );
}
