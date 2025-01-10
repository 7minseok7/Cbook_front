import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MessageProps {
  isUser: boolean
  content: string
  userName: string
}

export function Message({ isUser, content, userName }: MessageProps) {
  return (
    <div className={`w-full p-4 ${isUser ? 'bg-background' : 'bg-primary'}`}>
      <div className="container max-w-4xl mx-auto">
        <div className="flex items-start gap-3">
          <Avatar>
            {isUser ? (
              <AvatarImage src="/placeholder.svg" alt="User" />
            ) : (
              <AvatarImage src="/placeholder.svg" alt="Pakpok-i" />
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
          </div>
        </div>
      </div>
    </div>
  )
}
