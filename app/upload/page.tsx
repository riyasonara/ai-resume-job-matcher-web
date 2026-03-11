"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export default function UploadPage() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="p-10 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2">
          <UploadCloud size={48} className="text-muted-foreground" />

          <div>
            <h2 className="text-xl font-semibold">
              Upload Your Resume
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Upload your resume in PDF format to get AI-powered job recommendations.
            </p>
          </div>

          <div className="w-full">
            <input
              type="file"
              className="hidden"
              id="resume-upload"
            />

            <label htmlFor="resume-upload">
              <Button className="w-full">
                Choose File
              </Button>
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