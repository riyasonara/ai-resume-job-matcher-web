"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockJobs = [
  {
    id: 1,
    title: "Performance Marketing Manager",
    company: "AdScale Media",
    score: 82,
  },
  {
    id: 2,
    title: "Digital Marketing Specialist",
    company: "GrowthBoost Media",
    score: 74,
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "CloudTech Solutions",
    score: 38,
  },
];

export default function RecommendationsPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Recommended Jobs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Based on your resume analysis
          </p>
        </div>

        {mockJobs.map((job) => (
          <Card key={job.id} className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">
                  {job.title}
                </h3>
                <Badge variant="secondary" className="mt-2">
                  {job.company}
                </Badge>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-500">
                  {job.score}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Match Score
                </p>
              </div>
            </div>

            <Progress value={job.score} />
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}