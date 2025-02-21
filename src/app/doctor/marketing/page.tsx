"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sparkles, Send, Mail, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import DaddyAPI from "@/services/api"

export default function Page() {
  const [heading, setHeading] = useState("Special Offer from Our Clinic")
  const [subject, setSubject] = useState("Limited Time Health Check-up Package")
  const [body, setBody] = useState(
    "Dear Valued Patient,\n\nWe hope this email finds you in good health. We are excited to offer you a special health check-up package...",
  )
  const [bgColor, setBgColor] = useState("#ffffff")
  const [textColor, setTextColor] = useState("#000000")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [recipients, setRecipients] = useState("")

  const formattedBody = body.replace(/\n/g, "<br>");

const emailHTML = `
  <table width="100%" cellpadding="0" cellspacing="0" style="min-width:100%;background-color:#e6f7ff;background-image:url('https://source.unsplash.com/1200x800/?health,medical');background-size:cover;background-position:center;background-repeat:no-repeat;">
    <tr>
      <td width="100%" align="center" style="padding:40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;color:#333333;font-family:Arial,sans-serif;border-radius:10px;box-shadow:0px 4px 10px rgba(0,0,0,0.1);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:30px 20px;background: linear-gradient(to right, #ef4444,#3b82f6);border-radius:10px 10px 0 0;">
              <img src="https://i.ibb.co/6R125xgQ/logo.png" width="80" height="80" alt="Logo" style="border-radius:50%; background:#f2f2f2; padding:5px;">
              <h1 style="font-size:24px;font-weight:bold;margin-top:10px;color:#ffffff;">${heading}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:30px 20px;background-color:#ffffff;color:#333333;line-height:1.6;">
              <p style="margin-bottom:20px;">${formattedBody}</p>
              <div style="text-align:center;">
                <a href="https://medwell2.vercel.app/" style="display:inline-block;padding:12px 20px;background:#2c7edb;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:5px;">Learn More</a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px;background-color:#f0f8ff;text-align:center;font-size:12px;color:#666666;border-radius:0 0 10px 10px;">
              <strong>MedWell</strong> | Your Trusted Medical Companion
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;


  const handleSendEmail = async () => {
    try {
      setIsSending(true)
      const recipientList = recipients
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "")
      const API_DATA = {
        html: `${emailHTML}`,
        subject: subject,
        emails: recipientList,
      }

      const response = await DaddyAPI.sendMarketingEmail(API_DATA)
      console.log(response.data)
    } catch (error) {
      console.error("Failed to send email:", error)
    } finally {
      setIsSending(false)
    }
  }

  const generateBodyText = async () => {
    try {
      setIsGenerating(true)
      setBody("")

      const response = await DaddyAPI.genEmailBody({ heading, subject })
      const splitData = response.data.body.split(" ")

      splitData.forEach((data: any, index: any) => {
        setTimeout(() => {
          setBody((prevBody) => prevBody + " " + data)

          if (index === splitData.length - 1) {
            setIsGenerating(false)
          }
        }, index * 100)
      })
    } catch (error) {
      console.error("Failed to generate body:", error)
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Email Marketing</h1>
            <p className="text-muted-foreground">Create and send marketing emails to your patients.</p>
          </div>
          <Button onClick={handleSendEmail} disabled={isSending} size="lg">
            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Send Email
          </Button>
        </div>
        <Separator />
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Editor
              </CardTitle>
              <CardDescription>Customize your email content and appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="heading">Heading</Label>
                  <Input
                    id="heading"
                    placeholder="Email heading"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="body">Email Body</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={generateBodyText} disabled={isGenerating}>
                          {isGenerating ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4 mr-2" />
                          )}
                          Generate
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generate email content with AI</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  id="body"
                  placeholder="Write your email content here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>
              <Separator />
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Textarea
                    id="recipients"
                    placeholder="Enter email addresses separated by commas..."
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bgColor">Background</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bgColor"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text</Label>
                    <div className="flex gap-2">
                      <Input
                        id="textColor"
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="order-1 lg:order-2">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your email will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="p-3 bg-muted border-b">
                  <div className="text-sm text-muted-foreground">Subject: {subject}</div>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: emailHTML }}
                  className="w-full overflow-auto"
                  style={{
                    maxHeight: "calc(100vh - 400px)",
                    minHeight: "500px",
                    backgroundColor: bgColor,
                    color: textColor,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

