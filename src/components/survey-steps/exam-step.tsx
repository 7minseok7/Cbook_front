import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ExamStepProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
}

export function ExamStep({ value, onChange, onNext }: ExamStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-center">
          최근에 준비해 보셨던 시험은<br />어떤 것이었나요?
        </h1>
        <div className="space-y-2">
          <Label htmlFor="exam">시험명 (가장 최근에 준비한 시험 하나만 입력)</Label>
          <Input
            className="bg-background border-None"
            id="exam"
            placeholder="ex) 빅데이터분석기사, SQLD 등"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      <Button 
        className="w-full py-6 text-lg"
        onClick={onNext}
        disabled={!value.trim()}
      >
        다음
      </Button>
    </div>
  )
}
