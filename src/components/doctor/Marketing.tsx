"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

export default function Marketing() {
  const [emailContent, setEmailContent] = useState("")

  const handleEmailContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailContent(event.target.value)
  }

  const handleSendEmail = () => {
    // Handle sending email logic here
    console.log("Sending email with content:", emailContent)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-content">Email Content</Label>
            <Textarea
              id="email-content"
              value={emailContent}
              onChange={handleEmailContentChange}
              placeholder="Enter email content here..."
              className="w-full"
            />
          </div>
          <Button onClick={handleSendEmail} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Send Email
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

