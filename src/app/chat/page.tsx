"use client"

import { useState } from "react"
import { Message } from "@/components/message"
import { MessageInput } from "@/components/message-input"

const initialMessages = [
  { id: 1, content: "심심해", isUser: true, userName: "나" },
  { id: 2, content: "그래 보여", isUser: false, userName: "팩폭이" },
  { id: 3, content: "심심해", isUser: true, userName: "나" },
  { id: 4, content: "시험 계획 짜줬으니까 가서 공부나 해", isUser: false, userName: "팩폭이" },
]

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages)

  const handleSendMessage = (content: string) => {
    setMessages(prev => [
      ...prev,
      { id: prev.length + 1, content, isUser: true, userName: "나" }
    ])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between relative">
            <button 
              onClick={() => window.history.back()} 
              className="hover:text-primary"
            >
              {"<--"} 이전 화면
            </button>
            <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">
              팩폭이
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex-1">
          {messages.map(message => (
            <Message
              key={message.id}
              isUser={message.isUser}
              content={message.content}
              userName={message.userName}
            />
          ))}
        </div>
        
        <div className="border-t">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </main>
    </div>
  )
}

