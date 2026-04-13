"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileUp,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadResume } from "@/services/resume.service";
import { getAxiosMessage } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

const uploadSchema = z
  .object({
    file: z.custom<File | undefined>(
      (val) => val === undefined || val instanceof File
    ),
  })
  .refine((data) => data.file instanceof File, {
    message: "Please select a PDF file",
    path: ["file"],
  })
  .refine((data) => data.file == null || data.file.type === "application/pdf", {
    message: "Only PDF files are allowed",
    path: ["file"],
  })
  .refine(
    (data) => data.file == null || data.file.size <= 5 * 1024 * 1024,
    {
      message: "File must be 5MB or smaller",
      path: ["file"],
    }
  );

type UploadForm = z.infer<typeof uploadSchema>;

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [uploadPercent, setUploadPercent] = useState(0);

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { file: undefined },
  });

  const file = watch("file");

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      uploadResume(file, {
        onUploadProgress: (p) => setUploadPercent(p),
      }),
    onMutate: () => {
      setUploadPercent(0);
    },
    onSuccess: () => {
      setUploadPercent(100);
      toast.success("Resume uploaded successfully");
      reset();
    },
    onError: (err: unknown) => {
      setUploadPercent(0);
      toast.error(getAxiosMessage(err, "Upload failed"));
    },
  });

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setValue("file", selected, { shouldValidate: true });
    }
    e.target.value = "";
  };

  const onSubmit = (values: UploadForm) => {
    const f = values.file;
    if (!(f instanceof File)) return;
    uploadMutation.mutate(f);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Upload resume
          </h1>
          <p className="text-slate-500 mt-1">
            PDF only, up to 5MB. Used for matching and AI features.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-2xl overflow-hidden shadow-sm">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <AnimatePresence mode="wait">
                  {!file ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center"
                    >
                      <div className="h-20 w-20 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 flex items-center justify-center mb-6">
                        <UploadCloud className="h-10 w-10 text-indigo-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Drag and drop your resume
                      </h3>
                      <p className="text-sm text-slate-500 mt-2 max-w-xs">
                        PDF up to 5MB. Our AI extracts skills for matching.
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onPickFile}
                        accept=".pdf,application/pdf"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="mt-6 rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      >
                        Browse files
                      </Button>
                      {errors.file && (
                        <p className="text-xs text-red-500 mt-4">
                          {errors.file.message}
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="selected"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full max-w-md"
                    >
                      <div className="p-4 bg-white rounded-xl border border-indigo-100 shadow-sm flex items-center gap-4 relative">
                        <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        {!uploadMutation.isPending && (
                          <button
                            type="button"
                            onClick={() => reset()}
                            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                        {uploadMutation.isPending && (
                          <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                        )}
                      </div>

                      {uploadMutation.isPending && (
                        <div className="mt-6 space-y-2">
                          <div className="flex justify-between text-xs font-medium text-slate-600">
                            <span>Uploading…</span>
                            <span>{uploadPercent}%</span>
                          </div>
                          <Progress
                            value={uploadPercent}
                            className="h-2 bg-slate-100"
                          />
                        </div>
                      )}

                      {!uploadMutation.isPending && (
                        <div className="mt-8 flex gap-3">
                          <Button
                            type="submit"
                            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:-translate-y-0.5 transition-all"
                          >
                            Confirm & upload
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => reset()}
                            className="rounded-xl border-slate-200"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <h4 className="font-bold text-slate-900">Skill extraction</h4>
            <p className="text-sm text-slate-500 mt-2">
              We parse your resume to power recommendations and comparisons.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <FileUp className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-900">Privacy first</h4>
            <p className="text-sm text-slate-500 mt-2">
              Your file is sent securely to your workspace over HTTPS.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <h4 className="font-bold text-slate-900">Quality check</h4>
            <p className="text-sm text-slate-500 mt-2">
              Only PDFs up to 5MB are accepted for reliable parsing.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
