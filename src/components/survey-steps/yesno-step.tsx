import { Button } from "@/components/ui/button"

interface YesNoStepProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
}

export function YesNoStep({ value, onChange, onNext }: YesNoStepProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        자격증 시험 준비가<br />처음이신가요?
      </h1>
      <div className="grid gap-4">
        <Button
          variant="default"
          className="w-full py-6 text-lg"
          onClick={() => {
            onChange("yes")
            onNext()
          }}
        >
          네
        </Button>
        <Button
          variant="default"
          className="w-full py-6 text-lg"
          onClick={() => {
            onChange("no")
            onNext()
          }}
        >
          아니오
        </Button>
      </div>
    </div>
  )
}

