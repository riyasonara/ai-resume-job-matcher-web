"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, ChevronLeft, ChevronRight, Mic } from "lucide-react";
import { generateInterview } from "@/services/ai.service";
import { getAxiosMessage } from "@/lib/api";
import type { InterviewQuestion } from "@/lib/api-types";

export default function InterviewPage() {
  const [resumeText, setResumeText] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const interviewMutation = useMutation({
    mutationFn: generateInterview,
    onSuccess: (items) => {
      setQuestions(items);
      setIndex(0);
      setFlipped(false);
      if (items.length === 0) {
        toast.error("No questions returned — try longer resume text");
      } else {
        toast.success("Interview questions ready");
      }
    },
    onError: (err: unknown) => {
      toast.error(getAxiosMessage(err, "Could not generate interview"));
    },
  });

  const current = questions[index];
  const total = questions.length;
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0;

  const goPrev = () => {
    if (index <= 0) return;
    setIndex((i) => i - 1);
    setFlipped(false);
  };

  const goNext = () => {
    if (index >= total - 1) return;
    setIndex((i) => i + 1);
    setFlipped(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Mic className="h-8 w-8 text-violet-600" />
            AI interview prep
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Generates interview questions and answers in parallel, aligned by
            context for a seamless mock interview experience.
          </p>
        </div>

        <Card className="rounded-2xl shadow-md border-slate-200">
          <CardHeader>
            <CardTitle>Resume or notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste resume text or bullet your experience…"
              className="min-h-36 rounded-xl"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={interviewMutation.isPending}
            />
            <Button
              type="button"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:-translate-y-0.5 transition-all"
              disabled={interviewMutation.isPending || !resumeText.trim()}
              onClick={() => interviewMutation.mutate(resumeText.trim())}
            >
              {interviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate questions"
              )}
            </Button>
          </CardContent>
        </Card>

        {total > 0 && current ? (
          <>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>
                Question {index + 1} / {total}
              </span>
              <span className="tabular-nums">
                {Math.round(progress)}% through
              </span>
            </div>
            <Progress value={progress} className="h-2 rounded-full" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.question + index}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="relative min-h-[20rem] h-auto [perspective:1200px]"
              >
                <motion.button
                  type="button"
                  className="relative w-full min-h-[20rem] text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
                  onClick={() => setFlipped((f) => !f)}
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="absolute inset-0 min-h-[20rem] rounded-2xl border border-slate-200 bg-white p-6 shadow-md flex flex-col justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
                      Question
                    </p>
                    <p className="text-lg font-semibold text-slate-900 leading-snug">
                      {current.question}
                    </p>
                    <p className="text-xs text-slate-400 mt-6">
                      Tap card to reveal suggested answer
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 min-h-[20rem] rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 shadow-md flex flex-col justify-start overflow-y-auto"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-700 mb-2 shrink-0">
                      Suggested answer
                    </p>
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {current.answer || "—"}
                    </p>
                  </div>
                </motion.button>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl flex-1"
                onClick={goPrev}
                disabled={index === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                type="button"
                className="rounded-xl flex-1 bg-slate-900 hover:bg-slate-800"
                onClick={goNext}
                disabled={index >= total - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </AppLayout>
  );
}
