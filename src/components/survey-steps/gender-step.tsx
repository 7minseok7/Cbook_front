import { Button } from "@/components/ui/button"

interface GenderStepProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
}

export function GenderStep({ value, onChange, onNext }: GenderStepProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        성별이<br />어떻게 되시나요?
      </h1>
      <div className="grid gap-4">
        <Button
          variant="default"
          className="w-full py-6 text-lg"
          onClick={() => {
            onChange("male")
            onNext()
          }}
        >
          남성
        </Button>
        <Button
          variant="default"
          className="w-full py-6 text-lg"
          onClick={() => {
            onChange("female")
            onNext()
          }}
        >
          여성
        </Button>
      </div>
    </div>
  )
}

