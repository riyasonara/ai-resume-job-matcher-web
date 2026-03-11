"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ComparePage() {
  const mockResult = {
    score: 76,
    strengths: [
      "Strong experience in SEO and performance marketing",
      "Hands-on with Google Ads and Meta Ads",
      "Campaign analytics and KPI tracking",
    ],
    missingSkills: [
      "Advanced automation workflows",
      "Marketing attribution modeling",
    ],
    suggestions:
      "Consider highlighting measurable campaign outcomes and adding advanced automation tools experience.",
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Compare With Job Description
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Paste a job description to get AI-powered analysis
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 space-y-4">
          <Textarea
            placeholder="Paste job description here..."
            className="min-h-37.5"
          />
          <Button>Analyze Match</Button>
        </Card>

        {/* Result Section */}
        <Card className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Match Score</h2>
            <span className="text-2xl font-bold text-emerald-500">
              {mockResult.score}%
            </span>
          </div>

          <Progress value={mockResult.score} />

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-medium mb-3">Strengths</h3>
              <ul className="space-y-2">
                {mockResult.strengths.map((item, index) => (
                  <li key={index} className="text-sm text-foreground">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">Missing Skills</h3>
              <ul className="space-y-2">
                {mockResult.missingSkills.map((item, index) => (
                  <li key={index} className="text-sm text-destructive">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">AI Suggestions</h3>
            <p className="text-sm text-muted-foreground">
              {mockResult.suggestions}
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}