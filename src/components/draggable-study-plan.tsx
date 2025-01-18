'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface DraggableStudyPlanProps {
  id: string
  week: string
}

export function DraggableStudyPlan({ 
  id, 
  week
}: DraggableStudyPlanProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`select-none ${isDragging ? 'z-10' : ''} cursor-grab 
                  bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{week}</h3>
        <div className="flex flex-col">
          <ChevronUp className="w-4 h-4" />
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      <div className="h-px bg-gray-300"></div>
    </div>
  )
}
