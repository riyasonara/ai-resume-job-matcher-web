"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lightbulb,
  ArrowUpRight,
  Briefcase,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { getRecommendedJobs } from "@/services/match.service";
import { queryKeys } from "@/lib/query-keys";
import { getAxiosMessage } from "@/lib/api";

export default function RecommendationsPage() {
  const queryClient = useQueryClient();
  const { data: jobs = [], isLoading, isError, error, refetch, isFetching } =
    useQuery({
      queryKey: queryKeys.recommendations,
      queryFn: getRecommendedJobs,
    });

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                AI recommendations
              </h1>
              <div className="px-2 py-0.5 bg-indigo-100 rounded-full">
                <Sparkles className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
            <p className="text-slate-500 mt-1">
              Personalized job matches from your latest resume profile.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <Card className="rounded-2xl border-dashed p-10 text-center">
            <p className="text-sm text-red-600">
              {getAxiosMessage(error, "Failed to load recommendations")}
            </p>
            <Button
              className="mt-4 rounded-xl"
              onClick={() =>
                void queryClient.invalidateQueries({
                  queryKey: queryKeys.recommendations,
                })
              }
            >
              Try again
            </Button>
          </Card>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.jobId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Card className="group overflow-hidden border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-0.5 transition-all duration-300 rounded-2xl">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-stretch">
                      <div className="w-2 bg-gradient-to-b from-indigo-500 to-violet-500" />
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.company}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Match score
                              </div>
                              <div className="text-2xl font-black text-emerald-600">
                                {Math.round(job.score)}%
                              </div>
                            </div>
                            <Button
                              size="icon"
                              className="rounded-full bg-slate-900 hover:bg-indigo-600"
                              type="button"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 mb-6">
              <BookOpen className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No recommendations yet
            </h3>
            <p className="max-w-xs text-center text-slate-500 mt-2 text-sm">
              Upload your resume so we can score open roles against your
              profile.
            </p>
            <Link href="/upload" className="mt-8">
              <Button className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600">
                <Lightbulb className="mr-2 h-4 w-4" />
                Upload resume
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
