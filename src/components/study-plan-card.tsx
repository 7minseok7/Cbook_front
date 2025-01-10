interface StudyPlanCardProps {
    title: string
    date: string
    daysRemaining: number
  }
  
  export function StudyPlanCard({ title, date, daysRemaining }: StudyPlanCardProps) {
    return (
      <div className="bg-card rounded-xl p-4 flex border justify-between items-center">
        <div>
          <div className="font-medium">{title}</div>
          <div>{date}</div>
        </div>
        <div className="text-lg font-medium">
          {daysRemaining}일 남음
        </div>
      </div>
    )
  }
