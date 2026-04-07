"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getRecommendedJobs,
  type RecommendedJob as Job,
} from "@/app/services/match.service";

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getRecommendedJobs();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Recommended Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Based on your resume analysis
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          jobs.map((job) => <AnimatedJobCard key={job.jobId} job={job} />)
        )}
      </div>
    </AppLayout>
  );
}

function AnimatedJobCard({ job }: { job: Job }) {
  const count = useMotionValue(0);
  //   const rounded = useTransform(count, (latest) =>
  //     Math.round(latest)
  //   );

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, job.score, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate(value) {
        setDisplayValue(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [job.score, count]);

  const isHighMatch = job.score >= 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className={`p-6 space-y-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
          isHighMatch
            ? "ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/20"
            : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{job.title}</h3>
            <Badge variant="secondary" className="mt-2">
              {job.company}
            </Badge>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-500">
              {displayValue}%
            </p>
            <p className="text-xs text-muted-foreground">Match Score</p>
          </div>
        </div>

        {/* Gradient Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${job.score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${
              isHighMatch
                ? "bg-linear-to-r from-emerald-400 to-emerald-600"
                : "bg-linear-to-r from-indigo-400 to-indigo-600"
            }`}
          />
        </div>
      </Card>
    </motion.div>
  );
}
