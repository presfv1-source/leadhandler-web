"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

/** Placeholder base URL and API key for demo; no real secrets in client. */
const DEMO_BASE_URL_PLACEHOLDER = "https://airtable.com/your-base-id";
const DEMO_API_KEY_PLACEHOLDER = "key••••••••••••••••";

interface DemoAirtableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoAirtableModal({ open, onOpenChange }: DemoAirtableModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Demo lead sync info</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Use these in your automation or lead source to connect to the demo base. For production, configure in Settings.
        </p>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="demo-base-url">Base URL</Label>
            <Input
              id="demo-base-url"
              readOnly
              value={DEMO_BASE_URL_PLACEHOLDER}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-api-key">API key</Label>
            <Input
              id="demo-api-key"
              readOnly
              type="password"
              value={DEMO_API_KEY_PLACEHOLDER}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
