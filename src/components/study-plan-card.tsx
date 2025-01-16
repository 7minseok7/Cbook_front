import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StudyPlanCardProps {
  title: string
  date: string
  daysRemaining: number
  tasks: string[]
}

export function StudyPlanCard({ title, date, daysRemaining, tasks }: StudyPlanCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>날짜: {date}</p>
        <p>남은 일수: {daysRemaining}일</p>
        <ul className="list-disc list-inside mt-2">
          {tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
