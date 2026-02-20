"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "lh_demo_mode";

interface DemoToggleProps {
  demoEnabled: boolean;
  onToggle?: (enabled: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function DemoToggle({
  demoEnabled: serverDemoEnabled,
  onToggle,
  disabled = false,
  className,
}: DemoToggleProps) {
  const router = useRouter();
  const [checked, setChecked] = useState(serverDemoEnabled);

  useEffect(() => {
    const run = () => setChecked(serverDemoEnabled);
    queueMicrotask(run);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, serverDemoEnabled ? "true" : "false");
      } catch {
        // ignore
      }
    }
  }, [serverDemoEnabled]);

  async function handleChange(enabled: boolean) {
    if (disabled) return;
    setChecked(enabled);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
      }
    } catch {
      // ignore
    }
    const res = await fetch("/api/demo/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(enabled ? "Demo mode enabled — showing sample data" : "Demo mode disabled");
      onToggle?.(enabled);
      router.refresh();
    } else {
      setChecked(!enabled);
      toast.error("Could not update demo mode");
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5",
        disabled && "opacity-60",
        className
      )}
    >
      {checked ? (
        <Eye className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
      ) : (
        <EyeOff className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
      )}
      <Label htmlFor="demo-toggle" className="text-sm font-medium cursor-pointer shrink-0">
        Demo Mode
      </Label>
      <span className="text-xs text-muted-foreground shrink-0">{checked ? "On" : "Off"}</span>
      <Switch
        id="demo-toggle"
        checked={checked}
        onCheckedChange={handleChange}
        disabled={disabled}
        className="shrink-0"
      />
    </div>
  );
}
