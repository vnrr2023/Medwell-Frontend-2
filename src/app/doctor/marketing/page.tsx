"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sparkles, Send, Mail, Loader2, MessageSquare } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import DaddyAPI from "@/services/api"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import ChatArogya from "@/components/chatbots/ChatArogya"
import { useRouter } from "next/navigation"

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
  const [recipients, setRecipients] = useState<any[]>([])

  const formattedBody = body.replace(/\n/g, "<br>")

  const emailHTML = `
    <table width="100%" cellpadding="0" cellspacing="0" style="min-width:100%;background-color:#f0f4f8;">
      <tr>
        <td width="100%" align="center" style="padding:40px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;color:#333333;font-family:Arial,sans-serif;border-radius:8px;box-shadow:0px 4px 10px rgba(0,0,0,0.1);overflow:hidden;">
            <!-- Header -->
            <tr>
              <td align="center" style="padding:30px 20px;background: linear-gradient(to right, #ef4444,#3b82f6);border-radius:8px 8px 0 0;">
                <img src="https://i.ibb.co/6R125xgQ/logo.png" width="80" height="80" alt="Logo" style="border-radius:50%; background:#f0f4f8; padding:5px;">
                <h1 style="font-size:28px;font-weight:bold;margin-top:15px;color:#ffffff;">${heading}</h1>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:30px 20px;background-color:#ffffff;color:#333333;line-height:1.6;">
                <p style="margin-bottom:20px;font-size:16px;">${formattedBody}</p>
                <div style="text-align:center;">
                  <a href="https://medwell2.vercel.app/" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:4px;font-size:16px;">Learn More</a>
                </div>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:20px;background-color:#f0f4f8;text-align:center;font-size:14px;color:#666666;border-radius:0 0 8px 8px;">
                <strong>MedWell</strong> | Your Trusted Healthcare Partner
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `
  const router = useRouter();
  useEffect(() => {
    const role=localStorage.getItem("Role")
    const token=localStorage.getItem("Token")
    if(!token || token==undefined){
      alert("You are not signed in")
      window.location.href="/auth"
      return
    }
    if(role!=="doctor"){
      alert("You cannot access logged in as patient")
      router.push("/patient")
      return
    }
  }, []);
  const handleSendEmail = async () => {
    setIsSending(true)
    try {
      console.log("Sending email...")
      console.log("Recipients:", recipients)
      console.log("Subject:", subject)
      console.log("Body:", emailHTML)
     const data={
        "html":emailHTML,
        subject,
        "emails":recipients
      }
       await DaddyAPI.sendMarketingEmail(data)
      alert("Email sent successfully!")
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Failed to send email.")
    } finally {
      setIsSending(false)
    }
  }

  const generateBodyText = async () => {
    setIsGenerating(true)
    try {
      
      const generatedText = await DaddyAPI.genEmailBody({subject,heading})
      setBody(generatedText.data.body)
    } catch (error) {
      console.error("Error generating text:", error)
      alert("Failed to generate email content.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl py-4 px-2 sm:px-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="mb-6">
              <Tabs defaultValue="email" className="mb-4">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="hidden sm:inline">Email Marketing</span>
                    <span className="sm:hidden">Email</span>
                  </TabsTrigger>
                  <Link href="/doctor/whatsapp">
                    <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">WhatsApp Marketing</span>
                      <span className="sm:hidden">WhatsApp</span>
                    </TabsTrigger>
                  </Link>
                </TabsList>
              </Tabs>
            </div>
            <p className="text-base sm:text-lg text-blue-600">Create and send engaging marketing emails to your patients.</p>
          </div>
          <Button 
            onClick={handleSendEmail} 
            disabled={isSending} 
            size="lg" 
            className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
          >
            {isSending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
            Send Email
          </Button>
        </div>
        <Separator className="bg-blue-200" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="order-2 lg:order-1 border-blue-200 shadow-lg">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Mail className="h-6 w-6" />
                Email Editor
              </CardTitle>
              <CardDescription className="text-blue-600">Customize your email content and appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="heading" className="text-blue-700">
                    Heading
                  </Label>
                  <Input
                    id="heading"
                    placeholder="Email heading"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject" className="text-blue-700">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>
              <Separator className="bg-blue-100" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="body" className="text-blue-700">
                    Email Body
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateBodyText}
                          disabled={isGenerating}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
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
                  className="resize-none border-blue-200 focus:border-blue-400"
                />
              </div>
              <Separator className="bg-blue-100" />
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="recipients" className="text-blue-700">
                    Recipients
                  </Label>
                  <Textarea
                  id="recipients"
                  placeholder="Enter email addresses separated by commas..."
                  value={recipients.join(', ')} // Display as comma-separated
                  onChange={(e) => {
                    const input = e.target.value;
                    const emailList = input
                      .split(',')
                      .map(email => email.trim())
                      .filter(email => email.length > 0); // remove empty strings
                    setRecipients(emailList);
                  }}
                  rows={3}
                  className="resize-none border-blue-200 focus:border-blue-400"
                />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bgColor" className="text-blue-700">
                      Background
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="bgColor"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-10 p-1 border-blue-200"
                      />
                      <Input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 border-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor" className="text-blue-700">
                      Text
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="textColor"
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-12 h-10 p-1 border-blue-200"
                      />
                      <Input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 border-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="order-1 lg:order-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800">Preview</CardTitle>
              <CardDescription className="text-blue-600">See how your email will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden shadow-sm border-blue-200">
                <div className="p-3 bg-blue-100 border-b border-blue-200">
                  <div className="text-sm text-blue-700">Subject: {subject}</div>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: emailHTML }}
                  className="w-full overflow-auto"
                  style={{
                    maxHeight: "calc(100vh - 400px)",
                    minHeight: "300px",
                    backgroundColor: bgColor,
                    color: textColor,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ChatArogya/>
    </div>
  )
}
