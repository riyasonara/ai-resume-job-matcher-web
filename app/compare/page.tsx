"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  GitCompare,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { userIdFromToken } from "@/lib/auth-token";
import { compareWithJob, type CompareMatchResult } from "@/services/match.service";
import { getAxiosMessage } from "@/lib/api";

export default function ComparePage() {
  const { token } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<CompareMatchResult | null>(null);

  const compareMutation = useMutation({
    mutationFn: compareWithJob,
    onSuccess: (data) => {
      setResult(data);
      toast.success("Analysis complete");
    },
    onError: (err: unknown) => {
      toast.error(getAxiosMessage(err, "Analysis failed"));
    },
  });

  const handleCompare = () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first");
      return;
    }
    const userId = userIdFromToken(token);
    compareMutation.mutate({
      jobDescription: jobDescription.trim(),
      ...(userId ? { userId } : {}),
    });
  };

  const isAnalyzing = compareMutation.isPending;

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            AI job matcher
          </h1>
          <p className="text-slate-500 mt-1">
            Compare your resume against any job description.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ring-1 ring-slate-200/50 rounded-3xl bg-white p-6 shadow-xl shadow-slate-100/50">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Search className="h-4 w-4 text-indigo-500" />
                Paste job description
              </label>
              <Textarea
                placeholder="Paste the full job requirements here..."
                className="min-h-[300px] rounded-2xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 resize-none bg-slate-50/30 p-4"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
            <Button
              type="button"
              onClick={handleCompare}
              disabled={isAnalyzing || !jobDescription.trim()}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-100 hover:-translate-y-0.5 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing with AI…
                </>
              ) : (
                <>
                  <GitCompare className="mr-2 h-5 w-5" />
                  Compare now
                </>
              )}
            </Button>
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-indigo-50/30 rounded-2xl border border-indigo-100 border-dashed"
                >
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                    <Brain className="absolute inset-0 m-auto h-8 w-8 text-indigo-600 animate-pulse" />
                  </div>
                  <h3 className="mt-8 text-xl font-bold text-indigo-900">
                    Comparing profile…
                  </h3>
                  <p className="mt-2 text-indigo-700/60 text-center max-w-xs text-sm">
                    Matching skills between your resume and this role.
                  </p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                        Match score
                      </span>
                      <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-none rounded-lg">
                        {result.matchLevel}
                      </Badge>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-6xl font-black text-white leading-none">
                        {result.score}%
                      </span>
                      <TrendingUp className="h-8 w-8 text-emerald-400 mb-1" />
                    </div>
                    {result.summary ? (
                      <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                        {result.summary}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />{" "}
                        Matching skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.matchingSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100 py-1.5 px-3 h-auto whitespace-normal text-left"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-rose-500" /> Missing skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.missingSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-100 py-1.5 px-3 h-auto whitespace-normal text-left"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h4 className="text-sm font-bold text-slate-900">
                      AI recommendations
                    </h4>
                    <div className="space-y-2">
                      {result.insights.map((insight, i) => (
                        <div
                          key={i}
                          className="flex gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100"
                        >
                          <ChevronRight className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-slate-200 border-dashed">
                  <div className="h-16 w-16 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <TrendingUp className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-slate-400">
                    Ready to analyze
                  </h3>
                  <p className="mt-2 text-slate-400 text-center text-sm max-w-[220px]">
                    Paste a job description and run the comparison.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
