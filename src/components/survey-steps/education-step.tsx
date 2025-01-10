import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EducationStepProps {
  school: string
  status: string
  onSchoolChange: (value: string) => void
  onStatusChange: (value: string) => void
  onFinish: () => void
}

export function EducationStep({
  school,
  status,
  onSchoolChange,
  onStatusChange,
  onFinish,
}: EducationStepProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        최종 학력을<br />선택해주세요.
      </h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>학교급 선택</Label>
          <Select value={school} onValueChange={onSchoolChange}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="middle">중학교</SelectItem>
              <SelectItem value="high">고등학교</SelectItem>
              <SelectItem value="college">대학교</SelectItem>
              <SelectItem value="graduate">대학원</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>상태</Label>
          <RadioGroup value={status} onValueChange={onStatusChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="bg-background" value="attending" id="attending" />
              <Label htmlFor="attending">재학중</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="bg-background" value="graduated" id="graduated" />
              <Label htmlFor="graduated">졸업</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="bg-background" value="dropped" id="dropped" />
              <Label htmlFor="dropped">중퇴</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <Button 
        className="w-full py-6 text-lg"
        onClick={onFinish}
        disabled={!school || !status}
      >
        마치기
      </Button>
    </div>
  )
}
