export function calculateDaysRemaining(targetDate: string, startDate: string): number {
    const target = new Date(targetDate)
    const start = new Date(startDate)
    const diffTime = target.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  
  export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').slice(0, -1)
  }
  