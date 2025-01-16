import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface MessageProps {
  isUser: boolean
  plan: boolean
  content: string
  userName: string
  children?: React.ReactNode
}

export function Message({ isUser, plan, content, userName, children }: MessageProps) {
  const renderContent = () => {
    if (children) {
      return children;
    }

    if (plan) {
      const planData = content.match(/<시작>([\s\S]*?)<분할>([\s\S]*?)<분할>([\s\S]*?)<끝>/)
      if (planData) {
        const [, date, place, tasks] = planData
        const taskList = tasks.split('|').map(task => {
          const [taskDate, taskContent] = task.split(',')
          return `${taskDate}: ${taskContent}`
        }).join('\n')

        return (
          <div>
            <p>시험 날짜: {date}</p>
            <p>시험 장소: {place}</p>
            <p>학습 계획:</p>
            <pre>{taskList}</pre>
          </div>
        )
      }
    }
    return content
  }

  return (
    <div className={`w-full p-4 ${isUser ? 'bg-background' : 'bg-primary'}`}>
      <div className="container max-w-4xl mx-auto">
        <div className="flex items-start gap-3">
          <Avatar>
            {isUser ? (
              <AvatarImage src="/placeholder.svg" alt="User" />
            ) : (
              <AvatarImage src="/placeholder.svg" alt="AI" />
            )}
            <AvatarFallback>{isUser ? '나' : 'AI'}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className={`text-sm font-medium ${isUser ? 'text-foreground' : 'text-white'}`}>
              {userName}
            </div>
            <div className={`${isUser ? 'text-foreground' : 'text-white'}`}>
              {renderContent()}
            </div>
            {plan && (
              <a href="/plan-preview">
                <Button 
                  variant="secondary"
                  className="w-full my-2 py-6"
                >
                  시험 계획 미리보기
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
