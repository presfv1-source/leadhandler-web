import { Suspense } from "react";
import Link from "next/link";
import { BarChart3, UserPlus, Clock, TrendingUp, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession, getDemoEnabled } from "@/lib/auth";
import { demoAnalytics, getDemoLeadsByDay } from "@/lib/demoData";
import { AnalyticsChart } from "@/components/app/AnalyticsChart";
import { EmptyState } from "@/components/app/EmptyState";
import { PageHeader } from "@/components/app/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

async function AnalyticsContent() {
  const session = await getSession();
  const demoEnabled = await getDemoEnabled(session);

  if (!demoEnabled) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Analytics"
          subtitle="Performance and lead analytics"
          breadcrumbs={[
            { label: "Home", href: "/app/dashboard" },
            { label: "Analytics" },
          ]}
        />
        <EmptyState
          icon={BarChart3}
          title="No analytics yet"
          description="Turn on Demo Mode or connect sources in Settings to see analytics."
          action={{ label: "Go to Settings", href: "/app/settings" }}
        />
      </div>
    );
  }

  const leadsByDay = getDemoLeadsByDay();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Performance and lead analytics</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoAnalytics.totalLeads}</div>
          </CardContent>
        </Card>
        <Card className="rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoAnalytics.avgResponseMin} min</div>
          </CardContent>
        </Card>
        <Card className="rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoAnalytics.conversionRate}%</div>
          </CardContent>
        </Card>
        <Card className="rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoAnalytics.responseRate}%</div>
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Leads over time</CardTitle>
          <p className="text-sm text-muted-foreground">Lead volume by day (demo data)</p>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={leadsByDay} />
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">
        <Link href="/app/dashboard" className="font-medium text-primary hover:underline">
          Back to Dashboard
        </Link>
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 sm:space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}
