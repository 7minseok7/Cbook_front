"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from 'next/navigation'
import { Message } from "@/components/message"
import { MessageInput } from "@/components/message-input"
import { useApi } from "@/hooks/useApi"
import { useAuth } from "@/contexts/AuthContext"
import { BookSearchResult } from "@/components/book-search-result"
import { TypingEffect } from "@/components/typing-effect"
import { ModeToggle } from "@/components/theme-toggle"

interface ChatMessage {
  id: number;
  message_id: number;
  message_content: string;
  action: string;
  sent_by: 'user' | 'ai';
  sent_at: string;
  chat_id: number;
  user_id: number;
}

interface AIResponse {
  action: string;
  content: string | BookSearchResult[];
}

interface BookSearchResult {
  title: string;
  author: string;
  categoryName: string;
  pubDate: string;
  toc?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { apiCall } = useApi()
  const { checkAuth } = useAuth()
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  const chatId = params.chatId as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login')
      return
    }

    fetchMessages()
  }, [chatId, userId, apiCall, checkAuth, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchMessages = async () => {
    const { data, error, status } = await apiCall<ChatMessage[] | { message: string }>(`/api/v1/chatrooms/${userId}/?chat_id=${chatId}`)
    if (status === 204 || (data && 'message' in data && data.message === "아직 대화가 시작되지 않았습니다.")) {
      setMessages([])
    } else if (error) {
      console.error('Failed to fetch messages:', error)
      setError('메시지를 불러오는데 실패했습니다. 다시 시도해주세요.')
    } else if (Array.isArray(data)) {
      const sortedMessages = data.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime())
      setMessages(sortedMessages)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!checkAuth()) {
      router.push('/login')
      return
    }

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      message_id: Date.now(),
      message_content: content,
      action: "",
      sent_by: 'user',
      sent_at: new Date().toISOString(),
      chat_id: parseInt(chatId),
      user_id: parseInt(userId)
    }

    setMessages(prev => [...prev, newUserMessage])
    setIsTyping(true)

    try {
      const { data, error } = await apiCall<{
        message: string;
        user_msg: string;
        ai_response: AIResponse;
      }>(`/api/v1/chatrooms/${userId}/?chat_id=${chatId}`, 'POST', { user_msg: content })

      if (error) {
        console.error('Failed to send message:', error)
        setError('메시지 전송에 실패했습니다. 다시 시도해주세요.')
      } else if (data) {
        const newAiMessage: ChatMessage = {
          id: Date.now() + 1,
          message_id: Date.now() + 1,
          message_content: JSON.stringify(data.ai_response),
          action: data.ai_response.action,
          sent_by: 'ai',
          sent_at: new Date().toISOString(),
          chat_id: parseInt(chatId),
          user_id: parseInt(userId)
        }

        setMessages(prev => [...prev, newAiMessage])
        setIsTyping(false)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError('메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsTyping(false)
    }
  }

  const renderMessage = (message: ChatMessage) => {
    if (message.sent_by === 'ai') {
      try {
        let aiResponse;

        try {
          aiResponse = JSON.parse(message.message_content);
        } catch (error) {
          aiResponse = { action: message.action, content: message.message_content };
        }
        
        if (aiResponse.action === 'search_books') {
          return (
            <Message
              key={message.id}
              isUser={false}
              plan={false}
              content=""
              userName="책을 찾음"
            >
              <BookSearchResult 
                books={aiResponse.content as BookSearchResult[]} 
              />
            </Message>
          );
        } else if (aiResponse.action === 'make_plans') {
          return (
            <Message
              key={message.id}
              isUser={false}
              plan={true}
              content={aiResponse.content as string}
              userName="계획을 세움"
            />
          );
        } else {
          // For 'basic_chat' action or any other actions
          return (
            <Message
              key={message.id}
              isUser={false}
              plan={false}
              content=""
              userName="일상 대화"
            >
              <TypingEffect text={aiResponse.content as string} />
            </Message>
          );
        }
      } catch (error) {
        // If parsing fails, treat the message as plain text
        return (
          <Message
            key={message.id}
            isUser={false}
            plan={false}
            content=""
            userName="대충 오류"
          >
            <TypingEffect text={"문제가 발생했습니다. 다시 시도해 주세요."} />
          </Message>
        );
      }
    }
    return (
      <Message
        key={message.id}
        isUser={true}
        plan={false}
        content={message.message_content}
        userName="나"
      />
    );
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
              채팅
            </h1>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">오류:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {messages.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              아직 대화가 시작되지 않았습니다. 첫 메시지를 보내보세요!
            </div>
          )}
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t">
          <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </main>
    </div>
  )
}
