import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from 'lucide-react'

interface StudyPlanCardProps {
  title: string
  tasks: string[]
}

export function StudyPlanCard({ title, tasks }: StudyPlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer flex flex-row items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle>{title}</CardTitle>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <ul className="list-disc list-inside mt-2">
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  )
}
