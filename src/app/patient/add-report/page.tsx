"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { File, X, Send, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import DaddyAPI from "@/services/api"
import CombinedChat from "@/components/chatbots/ChatCombined"
import { Loader } from "@/components/box-loader"
import { useRouter } from "next/navigation"







const TypingDots = () => {
  return (
    <motion.span
      className="inline-flex"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: {
              opacity: [0, 1, 0],
              y: [5, 0, 5],
              transition: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 1,
              },
            },
          }}
        >
          .
        </motion.span>
      ))}
    </motion.span>
  )
}

const ProcessingFinishedMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center text-green-600 mt-2"
    >
      Processing finished successfully!
    </motion.div>
  )
}

export default function AddReport() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [buttonText, setButtonText] = useState("Upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router=useRouter();
  useEffect(() => {
    const role=localStorage.getItem("Role")
    const token=localStorage.getItem("Token")
    if(!token || token==undefined){
      alert("You are not signed in")
      window.location.href="/auth"
      return
    }
    if(role!=="patient"){
      alert("You cannot access logged in as doctor")
      router.push("/doctor")
      return
    }
  }, []);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      if (file.type === "application/pdf") {
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setUploadedFile(file)
      if (file.type === "application/pdf") {
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setPreviewUrl(null)
    setUploadStatus(null)
    setIsProcessing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const getRandomButtonText = () => {
    const texts = ["Generating", "Creating", "Cooking", "Processing"]
    return texts[Math.floor(Math.random() * texts.length)]
  }

  const handleUpload = async () => {
    if (!uploadedFile) {
      setUploadStatus("Please upload a file")
      return
    }

    setIsUploading(true)
    setIsProcessing(true)
    setUploadStatus("Uploading...")

    try {
      const formData = new FormData()
      formData.append("report", uploadedFile)
      const response = await DaddyAPI.addReport(formData)

      if (response.status === 200) {
        setIsUploading(false)
        setUploadStatus("Processing report...")

        const checkStatus = async () => {

          try {
            const taskStatusResponse = await DaddyAPI.getReportTaskStatus(response.data.task_id)
            if (taskStatusResponse.data.state === "SUCCESS") {
              setIsProcessing(false)
              setUploadStatus("Upload successful")
              setButtonText("Upload")
            } else if (taskStatusResponse.data.status === "FAILED") {
              setIsProcessing(false)
              setUploadStatus("Processing failed")
              setButtonText("Upload")
            } else {
              setButtonText(getRandomButtonText())
              setTimeout(checkStatus, 15000)
            }
          } catch (error) {
            setIsProcessing(false)
            setUploadStatus("Error checking status")
            setButtonText("Upload")
          }
          return;
        }

        checkStatus()
      } else {
        setIsUploading(false)
        setIsProcessing(false)
        setUploadStatus("Upload failed")
        setButtonText("Upload")
      }
    } catch (error) {
      setIsUploading(false)
      setIsProcessing(false)
      setUploadStatus("Error uploading file")
      setButtonText("Upload")
    }
  }

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
              <div className="w-full">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || isProcessing || !uploadedFile}
                  className="w-full"
                >
                  {isUploading || isProcessing ? (
                    <>
                      <motion.span
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        key={buttonText}
                        className="flex items-center"
                      >
                        {buttonText}
                        <TypingDots />
                      </motion.span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
                {!isProcessing && uploadStatus === "Upload successful" && <ProcessingFinishedMessage />}
              </div>
            </CardFooter>
          {(isUploading || isProcessing) && <Loader></Loader>}
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
                        <img src={previewUrl || "/placeholder.svg"} alt="Uploaded report" className="w-full h-auto" />
                      ) : uploadedFile && uploadedFile.type === "application/pdf" ? (
                        <iframe src={previewUrl} title="PDF Preview" className="w-full h-[400px] rounded-md border" />
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

      
      </motion.div>
      <CombinedChat />
    </div>
  )
}