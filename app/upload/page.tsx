"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { uploadResume } from "../services/resume.service";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="p-10 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2">
          <UploadCloud size={48} className="text-muted-foreground" />

          <div>
            <h2 className="text-xl font-semibold">Upload Your Resume</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Upload your resume in PDF format to get AI-powered job
              recommendations.
            </p>
          </div>

          <div className="w-full">
            <input
              type="file"
              className="hidden"
              id="resume-upload"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <label htmlFor="resume-upload">
              <Button
                className="w-full"
                onClick={async () => {
                  if (!file) return alert("Select a file");

                  try {
                    setIsUploading(true);
                    setProgress(0);

                    await uploadResume(file, setProgress);
                    alert("Resume uploaded successfully!");
                  } catch {
                    alert("Upload failed");
                  } finally {
                    setIsUploading(false);
                  }
                }}
              >
                {isUploading ? `Uploading... ${progress}%` : "Upload Resume"}
              </Button>

              {isUploading && (
                <div className="w-full mt-4 space-y-2">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-emerald-400 to-emerald-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Uploading... {progress}%
                  </p>
                </div>
              )}

              <input
                type="file"
                className="hidden"
                id="resume-upload"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <label
                htmlFor="resume-upload"
                className="cursor-pointer text-sm text-primary underline"
              >
                Choose File
              </label>
            </label>
          </div>

          <p className="text-xs text-muted-foreground">
            Supported format: PDF • Max size: 5MB
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
