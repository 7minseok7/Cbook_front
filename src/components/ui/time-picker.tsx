"use client"

import * as React from "react"
import { Clock } from 'lucide-react'
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TimePickerProps {
  label: string
}

export function TimePicker({ label }: TimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>("12:00")

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[120px] justify-start text-left font-normal",
            !selectedTime && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedTime || "Pick a time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-2">
          <Label htmlFor={`${label}-time-picker`}>{label}</Label>
          <Input
            id={`${label}-time-picker`}
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
