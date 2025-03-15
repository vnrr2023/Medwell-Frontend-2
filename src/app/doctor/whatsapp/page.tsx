"use client"

import { useState, useRef } from "react"
import { Bold, Italic, Strikethrough, Code, Smile, Type, Send, Loader2, CheckCheck, Search, Sparkles, Mail, MessageSquare } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast, Toaster } from "sonner"
import DaddyAPI from "@/services/api"
import Link from "next/link"

export default function Page() {
  const [message, setMessage] = useState<any>(
    "🩸🏡 Convenient Home-Based Blood Checkup & Free Report Delivery! 📑🚀\n\nTaking care of your health just got easier! ✅",
  )
  const [phoneNumbers, setPhoneNumbers] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("text")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeEmojiCategory, setActiveEmojiCategory] = useState("smileys")
  const [generatePrompt, setGeneratePrompt] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const emojiCategories = {
    smileys: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊",
      "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
    ],
    gestures: [
      "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟",
      "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "👍",
    ],
    people: [
      "👶", "👧", "🧒", "👦", "👩", "🧑", "👨", "👩‍🦱", "🧑‍🦱", "👨‍🦱",
      "👩‍🦰", "🧑‍🦰", "👨‍🦰", "👱‍♀️", "👱", "👱‍♂️", "👩‍🦳", "🧑‍🦳", "👨‍🦳", "👩‍🦲",
    ],
    animals: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁",
      "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒",
    ],
    food: [
      "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑",
      "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦",
    ],
    objects: [
      "⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾",
      "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️",
    ],
    symbols: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕",
      "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️",
    ],
  };
  

  function getEmojiDescription(emoji: string): string {
    const emojiDescriptions: Record<string, string> = {
      "😀": "grinning face",
      "😃": "grinning face with big eyes",
      "😄": "grinning face with smiling eyes",
      "👍": "thumbs up",
      "❤️": "red heart",
      "🔥": "fire",
      "✅": "check mark",
    }

    return emojiDescriptions[emoji] || ""
  }

  const filteredEmojis = searchTerm
    ? Object.values(emojiCategories)
        .flat()
        .filter(
          (emoji) =>
            emoji.includes(searchTerm) || getEmojiDescription(emoji).toLowerCase().includes(searchTerm.toLowerCase()),
        )
    : emojiCategories[activeEmojiCategory as keyof typeof emojiCategories]

  const formatWhatsAppMessage = (text: string) => {
    let formattedText = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>")

    formattedText = formattedText.replace(/_(.*?)_/g, "<em>$1</em>")

    formattedText = formattedText.replace(/~(.*?)~/g, "<del>$1</del>")

    formattedText = formattedText.replace(/```(.*?)```/g, "<code>$1</code>")

    formattedText = formattedText.replace(/\n/g, "<br />")

    return formattedText
  }

  const insertFormatting = (prefix: string, suffix: string) => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const selectedText = message.substring(start, end)

    const newMessage = message.substring(0, start) + prefix + selectedText + suffix + message.substring(end)

    setMessage(newMessage)

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length)
      }
    }, 0)
  }

  const formatBold = () => insertFormatting("*", "*")
  const formatItalic = () => insertFormatting("_", "_")
  const formatStrikethrough = () => insertFormatting("~", "~")
  const formatMonospace = () => insertFormatting("```", "```")

  const handleEmojiSelect = (emoji: string) => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const newMessage = message.substring(0, start) + emoji + message.substring(start)

    setMessage(newMessage)

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(start + emoji.length, start + emoji.length)
      }
    }, 0)
  }

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message is empty", {
        description: "Please enter a message to send",
      })
      return
    }

    if (!phoneNumbers.trim()) {
      toast.error("No phone numbers", {
        description: "Please enter at least one phone number",
      })
      return
    }

    const phoneNumbersList = phoneNumbers
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num)

    if (phoneNumbersList.length === 0) {
      toast.error("Invalid phone numbers", {
        description: "Please enter valid phone numbers separated by commas",
      })
      return
    }

    setIsSending(true)
    try {
      const response = await DaddyAPI.sendWhatsappMsg({
        phone_number: phoneNumbers,
        message,
      })

      toast.success("Success!", {
        description: "Messages sent successfully",
      })
    } catch (error) {
      toast.error("Error sending messages", {
        description: "There was an error sending your messages. Please try again.",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleGenerateMessage = async () => {
    if (!generatePrompt.trim()) {
      toast.error("Prompt is empty", {
        description: "Please enter a prompt to generate a message",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await DaddyAPI.genWhatsappBody({
        prompt: generatePrompt,
      })

      if (typeof response.data === "string") {
        setMessage(response.data)
      } else {
        setMessage(String(response.data.body))
      }

      setDialogOpen(false)
      setGeneratePrompt("")

      toast.success("Message Generated!", {
        description: "Your WhatsApp message has been generated successfully",
      })
    } catch (error) {
      toast.error("Error generating message", {
        description: "There was an error generating your message. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <Tabs defaultValue="whatsapp" className="mb-4">
        <TabsList>
          <Link href="/doctor/marketing">
            <TabsTrigger value="email" className="flex items-center gap-2" asChild>
              <div>
                <Mail className="h-4 w-4" />
                Email Marketing
              </div>
            </TabsTrigger>
          </Link>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp Marketing
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <h1 className="text-3xl font-bold mb-6">WhatsApp Message Builder</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">Message Builder</h2>

          <div className="border rounded-lg overflow-hidden">
            <div className="p-3 border-b">
              <div className="flex space-x-2 mb-3">
                <Button variant="outline" size="icon" onClick={formatBold} title="Bold">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={formatItalic} title="Italic">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={formatStrikethrough} title="Strikethrough">
                  <Strikethrough className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={formatMonospace} title="Monospace">
                  <Code className="h-4 w-4" />
                </Button>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="ml-auto " title="Generate Message">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                      <DialogTitle>Generate WhatsApp Message</DialogTitle>
                      <DialogDescription>Enter a prompt to generate a WhatsApp message using AI.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="prompt">Prompt</Label>
                        <Textarea
                          id="prompt"
                          placeholder="e.g. Create a promotional message for a blood test service with home collection"
                          value={generatePrompt}
                          onChange={(e) => setGeneratePrompt(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleGenerateMessage} disabled={isGenerating}>
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Message
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your WhatsApp message here..."
                className="min-h-[200px] resize-none"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b px-3">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="text" className="data-[state=active]:bg-muted">
                    <Type className="h-4 w-4 mr-2" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="emoji" className="data-[state=active]:bg-muted">
                    <Smile className="h-4 w-4 mr-2" />
                    Emoji
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="text" className="p-3">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Formatting tips:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      *bold* for <strong>bold text</strong>
                    </li>
                    <li>
                      _italic_ for <em>italic text</em>
                    </li>
                    <li>
                      ~strikethrough~ for <del>strikethrough text</del>
                    </li>
                    <li>
                      \`\`\`monospace\`\`\` for <code>monospace text</code>
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="emoji" className="p-3">
                <div className="emoji-keyboard">
                  <div className="relative mb-3">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search emojis..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  {searchTerm ? (
                    <div className="grid grid-cols-8 gap-2">
                      {filteredEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiSelect(emoji)}
                          className="h-8 w-8 flex items-center justify-center text-lg hover:bg-muted rounded"
                          title={getEmojiDescription(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <Tabs value={activeEmojiCategory} onValueChange={setActiveEmojiCategory}>
                      <TabsList className="grid grid-cols-7 mb-2">
                        <TabsTrigger value="smileys" title="Smileys & Emotions">
                          😀
                        </TabsTrigger>
                        <TabsTrigger value="gestures" title="Hand Gestures">
                          👋
                        </TabsTrigger>
                        <TabsTrigger value="people" title="People & Body">
                          👨
                        </TabsTrigger>
                        <TabsTrigger value="animals" title="Animals & Nature">
                          🐶
                        </TabsTrigger>
                        <TabsTrigger value="food" title="Food & Drink">
                          🍎
                        </TabsTrigger>
                        <TabsTrigger value="objects" title="Objects">
                          💻
                        </TabsTrigger>
                        <TabsTrigger value="symbols" title="Symbols">
                          ❤️
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={activeEmojiCategory} className="mt-0">
                        <div className="grid grid-cols-8 gap-2 max-h-[200px] overflow-y-auto">
                          {emojiCategories[activeEmojiCategory as keyof typeof emojiCategories].map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiSelect(emoji)}
                              className="h-8 w-8 flex items-center justify-center text-lg hover:bg-muted rounded"
                              title={getEmojiDescription(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="phone-numbers">Phone Number</Label>
              <Input
                id="phone-numbers"
                maxLength={10}
                type="number"
                placeholder="e.g. 9324052342"
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
              />
            </div>

            <Button onClick={handleSendMessage} className="w-full" disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send WhatsApp Message
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preview (now on the right) */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="max-w-[350px] mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-gray-100">
            {/* WhatsApp header */}
            <div className="bg-emerald-600 text-white p-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <span className="text-sm">👤</span>
              </div>
              <div>
                <div className="font-medium">Customer</div>
                <div className="text-xs opacity-80">Online</div>
              </div>
            </div>

            {/* Chat area */}
            <div className="bg-[#e5ddd5] h-[400px] p-6 overflow-y-auto bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat bg-opacity-30">
              <div className="flex justify-end mb-4">
                <div className="max-w-[80%] bg-[#dcf8c6] rounded-lg p-2 px-3 shadow-sm relative">
                  <div
                    className="text-sm text-gray-800 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: formatWhatsAppMessage(message) }}
                  />
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-500 mr-1">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <CheckCheck className="inline-block h-3 w-3 text-blue-500" />
                  </div>

                  {/* Triangle for chat bubble */}
                  <div className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-[#dcf8c6]"></div>
                </div>
              </div>
            </div>

            {/* Input area */}
            <div className="bg-gray-200 p-3 flex items-center">
              <div className="bg-white rounded-full flex-1 flex items-center px-3 py-2">
                <span className="text-gray-400 text-sm">Type a message</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}
