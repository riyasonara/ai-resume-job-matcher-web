import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Total Matches
          </p>
          <h3 className="text-3xl font-bold mt-2">12</h3>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Best Match Score
          </p>
          <h3 className="text-3xl font-bold mt-2 text-emerald-500">
            87%
          </h3>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Resumes Uploaded
          </p>
          <h3 className="text-3xl font-bold mt-2">3</h3>
        </Card>
      </div>
    </AppLayout>
  );
}