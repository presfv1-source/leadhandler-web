import { notFound } from "next/navigation";
import { env } from "@/lib/env.mjs";

export default function DebugEnvPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const key = env.server.AIRTABLE_API_KEY ?? "";
  const baseId = env.server.AIRTABLE_BASE_ID ?? "";
  const airtableKeyStatus = key.trim() ? "Set" : "Missing";
  const airtableKeyRedacted = key.trim() ? `${key.slice(0, 10)}...` : "—";
  const baseIdStatus = baseId.trim() ? "Set" : "Missing";
  const baseIdRedacted = baseId.trim() ? `${baseId.slice(0, 10)}...` : "—";

  return (
    <div className="space-y-6 p-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold">Environment (debug)</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Verify .env.local is loaded. Restart the dev server after changing env.
        </p>
      </div>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium text-muted-foreground">AIRTABLE_API_KEY</dt>
          <dd className="mt-0.5">
            {airtableKeyStatus} — {airtableKeyRedacted}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">AIRTABLE_BASE_ID</dt>
          <dd className="mt-0.5">
            {baseIdStatus} — {baseIdRedacted}
          </dd>
        </div>
      </dl>
    </div>
  );
}
