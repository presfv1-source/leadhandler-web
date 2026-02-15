"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface MessageComposerProps {
  leadId: string;
  leadPhone: string;
}

export function MessageComposer({ leadId, leadPhone }: MessageComposerProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: leadPhone, body: body.trim(), leadId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message sent");
        setBody("");
        router.refresh();
      } else {
        toast.error(data.error?.message ?? "Failed to send");
      }
    } catch {
      toast.error("Failed to send");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <Textarea
        placeholder="Type your message..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        className="resize-none"
      />
      <Button type="submit" disabled={loading || !body.trim()}>
        {loading ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
