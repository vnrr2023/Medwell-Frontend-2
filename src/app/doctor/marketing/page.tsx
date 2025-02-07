"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sparkles, Send } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  const [recipients, setRecipients] = useState("")

  const emailHTML = `
    <table width="100%" cellpadding="0" cellspacing="0" style="min-width:100%;background-color:${bgColor};">
      <tr>
        <td width="100%" style="padding:20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="min-width:100%;max-width:600px;margin:0 auto;background-color:${bgColor};color:${textColor};font-family:Arial,sans-serif;">
            <tr>
              <td style="padding:20px;">
                <h1 style="font-size:24px;font-weight:bold;margin-bottom:20px;">${heading}</h1>
                <div style="white-space:pre-wrap;line-height:1.5;">${body}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px;border-top:1px solid #e5e5e5;font-size:12px;color:#888888;">
                Promotional email generated with MedWell
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `

  const handleSendEmail = async () => {
    const recipientList = recipients.split(",").map((email) => email.trim()).filter((email) => email !== "")
    const API_DATA ={
        "html":`${emailHTML}`,
        "subject":subject,
        "emails":recipientList
    }

    const response = await DaddyAPI.sendMarketingEmail(API_DATA)
    console.log(response.data)
  }
  const generateBodyText = async () => {
    setIsGenerating(true);
    setBody("");
    
    const response = await DaddyAPI.genEmailBody({ heading, subject });
    const splitData = response.data.body.split(" ");
  
    splitData.forEach((data:any, index:any) => {
      setTimeout(() => {
        setBody(prevBody => prevBody + " " + data);
        
        if (index === splitData.length - 1) {
          setIsGenerating(false);
        }
      }, index * 100); 
    });
  };
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      <div className="w-full md:w-1/2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Email Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input id="heading" placeholder="Heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body" className="flex items-center justify-between">
                Body
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={generateBodyText} disabled={isGenerating}>
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate email body</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Textarea id="body" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} rows={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-grow" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="textColor"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-grow"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients (comma separated)</Label>
              <Textarea
                id="recipients"
                placeholder="email1@example.com, email2@example.com, email3@example.com"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={handleSendEmail}><Send/></Button>
          </CardContent>
        </Card>
      </div>
      <div className="w-full md:w-1/2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden shadow-lg">
              <div className="p-4 bg-gray-100 border-b">
                <div className="text-sm text-gray-600">Subject: {subject}</div>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: emailHTML }}
                className="w-full overflow-auto"
                style={{ maxHeight: "calc(100vh - 400px)" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
