"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { compareJob } from "@/app/services/compare.service";
import { useState } from "react";

type CompareResult = {
  score: number;
  strengths: string[];
  missingSkills: string[];
  suggestions: string;
};

export default function ComparePage() {
  const [result, setResult] = useState<CompareResult | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

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
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            className="min-h-37.5"
          />
          <Button
            disabled={loading}
            onClick={async () => {
              if (!jobDescription.trim()) {
                return alert("Please enter job description");
              }

              try {
                setLoading(true);

                const res = await compareJob(jobDescription);

                setResult(res as CompareResult);
              } catch (err) {
                console.error(err);
                alert("Failed to analyze");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Analyzing..." : "Analyze Match"}
          </Button>
        </Card>

        {/* Result Section */}

        {result && (
          <Card className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Match Score</h2>
              <span className="text-2xl font-bold text-emerald-500">
                {result.score}%
              </span>
            </div>

            <Progress value={result.score} />

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-medium mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-3">Missing Skills</h3>
                <ul className="space-y-2">
                  {result.missingSkills.map((item, index) => (
                    <li key={index} className="text-destructive">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">AI Suggestions</h3>
              <p className="text-sm text-muted-foreground">
                {result.suggestions}
              </p>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
