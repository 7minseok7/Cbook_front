'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface StudyPlanItemProps {
  id: string;
  task: string;
}

export function StudyPlanItem({ id, task }: StudyPlanItemProps) {
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
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center py-2 px-4 bg-gray-50 rounded-md mb-2 ml-6 cursor-grab ${
        isDragging ? 'z-10' : ''
      }`}
    >
      <span className="mr-2 text-gray-500">○</span>
      {task}
    </li>
  );
}
