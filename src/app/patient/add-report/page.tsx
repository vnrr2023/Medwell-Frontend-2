"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { File, X, Send, Loader2, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function AddReport() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (file.type === "application/pdf") {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      if (file.type === "application/pdf") {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      setUploadStatus("Please upload a file");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading...");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsUploading(false);
    setUploadStatus("Upload successful");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-primary mb-8">Add Medical Report</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Report</CardTitle>
              <CardDescription>Drag and drop your medical report or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-muted rounded-lg p-8 text-center transition-all duration-300 hover:border-primary"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg mb-2">Drag and drop your medical report here</p>
                  <p className="text-sm text-muted-foreground mb-4">or</p>
                  <Button onClick={handleBrowseClick}>Browse Files</Button>
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpload} disabled={isUploading || !uploadedFile} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <AnimatePresence>
                  {previewUrl ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-lg overflow-hidden"
                    >
                      {uploadedFile && uploadedFile.type.startsWith("image/") ? (
                        <img src={previewUrl} alt="Uploaded report" className="w-full h-auto" />
                      ) : uploadedFile && uploadedFile.type === "application/pdf" ? (
                        <iframe
                          src={previewUrl}
                          title="PDF Preview"
                          className="w-full h-[400px] rounded-md border"
                        />
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">Unsupported file type</div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-lg p-8 text-center text-muted-foreground"
                    >
                      No report uploaded yet
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
            {uploadedFile && (
              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <File className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{uploadedFile.name}</span>
                  </div>
                  <Badge variant="outline">{uploadedFile.type}</Badge>
                  <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>

        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <Card>
              <CardContent className="pt-6">
                <p
                  className={`text-center ${uploadStatus === "Upload successful" ? "text-green-600" : "text-red-600"}`}
                >
                  {uploadStatus}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
