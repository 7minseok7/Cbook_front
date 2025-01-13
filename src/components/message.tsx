import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface MessageProps {
  isUser: boolean
  plan: boolean
  content: string
  userName: string
}

export function Message({ isUser, plan, content, userName }: MessageProps) {
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
              {content}
            </div>
            { plan ? (
            <a href="/plan-preview">
              <Button 
                variant="secondary"
                className="w-full my-2 py-6"
              >
                시험 계획 미리보기
              </Button>
            </a>
            ): (<></>) }
          </div>
        </div>
      </div>
    </div>
  )
}
