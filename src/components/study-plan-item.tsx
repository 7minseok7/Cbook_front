"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, GripVertical } from "lucide-react"

interface StudyPlanItemProps {
  id: string
  task: string
  onDelete: () => void
  onEdit: (newContent: string) => void
}

export function StudyPlanItem({ id, task, onDelete, onEdit }: StudyPlanItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleEditSubmit = () => {
    onEdit(editedTask)
    setIsEditing(false)
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center bg-secondary py-2 px-4 rounded-md mb-2 mx-8 cursor-grab group"
    >
      {isEditing ? (
        <Input
          value={editedTask}
          onChange={(e) => setEditedTask(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyPress={(e) => e.key === "Enter" && handleEditSubmit()}
          className="mr-2 flex-grow"
          autoFocus
        />
      ) : (
        <span className="mr-2 flex-grow" onDoubleClick={() => setIsEditing(true)}>
          <span className="mr-2 text-gray-500">○</span>
          {task}
        </span>
      )}
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  )
}
