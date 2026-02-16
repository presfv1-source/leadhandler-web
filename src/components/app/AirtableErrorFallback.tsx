import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AirtableErrorFallbackProps {
  className?: string;
  showSettingsLink?: boolean;
}

export function AirtableErrorFallback({
  className,
  showSettingsLink = true,
}: AirtableErrorFallbackProps) {
  return (
    <Card
      className={cn(
        "border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 py-4",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span className="font-semibold">Failed to load data</span>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground">
        Check your Airtable connection in Settings.
        {showSettingsLink && (
          <>
            {" "}
            <Link
              href="/app/settings"
              className="font-medium underline underline-offset-2 hover:no-underline text-foreground"
            >
              Open Settings
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
