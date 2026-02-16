import Link from "next/link";
import { BarChart3, LayoutDashboard, UserPlus, Clock, TrendingUp, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDemoEnabled } from "@/lib/auth";
import { demoAnalytics, getDemoLeadsByDay } from "@/lib/demoData";
import { AnalyticsChart } from "@/components/app/AnalyticsChart";

export default async function AnalyticsPage() {
  const demoEnabled = await getDemoEnabled();

  if (!demoEnabled) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Performance and lead analytics</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Analytics</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Turn on Demo Mode in the header to see sample analytics, or connect your lead sources for real data.
            </p>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default">
              <Link href="/app/dashboard" className="inline-flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const leadsByDay = getDemoLeadsByDay();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Performance and lead analytics</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoAnalytics.totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoAnalytics.avgResponseMin} min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoAnalytics.conversionRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoAnalytics.responseRate}%</div>
          </CardContent>
        </Card>
      </div>
      <Card>
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
