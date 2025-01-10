import { Button } from "@/components/ui/button"

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">안녕하세요!</h1>
      
      <div className="space-y-4 text-center">
        <p>
          지금부터 서비스 이용을 위한 질문을<br />
          몇 가지 드릴게요.
        </p>
        <p className="text-red-500 font-medium">
          솔직하게 답변해 주세요.
        </p>
      </div>

      <Button 
        className="w-full py-6 text-lg"
        onClick={onNext}
      >
        다음
      </Button>
    </div>
  )
}
