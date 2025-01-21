"use client"

import { useState, useEffect, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Mode = "timer" | "stopwatch"

export function StudyTimer() {
  const [mode, setMode] = useState<Mode>("timer")
  const [showAlert, setShowAlert] = useState(false)

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(40)
  const [seconds, setSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(40 * 60)
  const [editingField, setEditingField] = useState<"hours" | "minutes" | "seconds" | null>(null)
  const initialTimeRef = useRef(40 * 60)

  // Stopwatch state
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (mode === "timer") {
      // Timer logic
      let interval: NodeJS.Timeout
      if (timerRunning && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setTimerRunning(false)
              setShowAlert(true)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
      return () => clearInterval(interval)
    } else {
      // Stopwatch logic
      if (stopwatchRunning) {
        startTimeRef.current = Date.now() - elapsedTime
        const updateStopwatch = () => {
          setElapsedTime(Date.now() - (startTimeRef.current || 0))
          animationFrameRef.current = requestAnimationFrame(updateStopwatch)
        }
        animationFrameRef.current = requestAnimationFrame(updateStopwatch)
      }
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [timerRunning, stopwatchRunning, timeLeft, mode, elapsedTime])

  const toggleTimer = () => {
    if (mode === "timer") {
      if (!timerRunning && timeLeft === 0) {
        resetTimer()
      }
      setTimerRunning(!timerRunning)
    } else {
      setStopwatchRunning(!stopwatchRunning)
    }
  }

  const resetTimer = () => {
    if (mode === "timer") {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      setTimeLeft(totalSeconds)
      initialTimeRef.current = totalSeconds
    } else {
      setElapsedTime(0)
      startTimeRef.current = null
    }
    setTimerRunning(false)
    setStopwatchRunning(false)
  }

  const formatTimerDisplay = () => {
    const h = Math.floor(timeLeft / 3600)
    const m = Math.floor((timeLeft % 3600) / 60)
    const s = timeLeft % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const formatStopwatchDisplay = () => {
    const totalSeconds = Math.floor(elapsedTime / 1000)
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    const ms = Math.floor((elapsedTime % 1000) / 10)

    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`
  }

  const handleTimeClick = (field: "hours" | "minutes" | "seconds") => {
    if (!timerRunning && mode === "timer") {
      setEditingField(field)
    }
  }

  const handleTimeInput = (value: string, field: "hours" | "minutes" | "seconds") => {
    const num = Number.parseInt(value) || 0
    switch (field) {
      case "hours":
        setHours(Math.min(99, Math.max(0, num)))
        break
      case "minutes":
        setMinutes(Math.min(59, Math.max(0, num)))
        break
      case "seconds":
        setSeconds(Math.min(59, Math.max(0, num)))
        break
    }
    setEditingField(null)
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    setTimeLeft(totalSeconds)
    initialTimeRef.current = totalSeconds
  }

  const calculateProgress = () => {
    if (mode === "timer") {
      return ((initialTimeRef.current - timeLeft) / initialTimeRef.current) * 100
    } else {
      return ((elapsedTime / 1000) % 60) / 0.6
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Button
          variant={mode === "timer" ? "default" : "outline"}
          onClick={() => {
            setMode("timer")
            resetTimer()
          }}
          className="w-24"
        >
          타이머
        </Button>
        <Button
          variant={mode === "stopwatch" ? "default" : "outline"}
          onClick={() => {
            setMode("stopwatch")
            resetTimer()
          }}
          className="w-24"
        >
          스톱워치
        </Button>
      </div>

      <div className="flex justify-center items-center py-2">
        {mode === "timer" ? (
          <div className="text-4xl font-semibold">
            {editingField === "hours" ? (
              <input
                type="number"
                value={hours}
                onChange={(e) => handleTimeInput(e.target.value, "hours")}
                className="w-16 bg-transparent text-center focus:outline-none"
                autoFocus
                onBlur={() => setEditingField(null)}
              />
            ) : (
              <span
                className={cn("cursor-pointer", !timerRunning && "hover:text-primary")}
                onClick={() => handleTimeClick("hours")}
              >
                {hours.toString().padStart(2, "0")}
              </span>
            )}
            :
            {editingField === "minutes" ? (
              <input
                type="number"
                value={minutes}
                onChange={(e) => handleTimeInput(e.target.value, "minutes")}
                className="w-16 bg-transparent text-center focus:outline-none"
                autoFocus
                onBlur={() => setEditingField(null)}
              />
            ) : (
              <span
                className={cn("cursor-pointer", !timerRunning && "hover:text-primary")}
                onClick={() => handleTimeClick("minutes")}
              >
                {minutes.toString().padStart(2, "0")}
              </span>
            )}
            :
            {editingField === "seconds" ? (
              <input
                type="number"
                value={seconds}
                onChange={(e) => handleTimeInput(e.target.value, "seconds")}
                className="w-16 bg-transparent text-center focus:outline-none"
                autoFocus
                onBlur={() => setEditingField(null)}
              />
            ) : (
              <span
                className={cn("cursor-pointer", !timerRunning && "hover:text-primary")}
                onClick={() => handleTimeClick("seconds")}
              >
                {seconds.toString().padStart(2, "0")}
              </span>
            )}
          </div>
        ) : (
          <div className="text-4xl font-semibold">{formatStopwatchDisplay()}</div>
        )}
      </div>

      <Progress value={calculateProgress()} className="w-full" />

      <div className="flex justify-end gap-2">
        <Button onClick={toggleTimer} className="w-24">
          {(mode === "timer" && timerRunning) || (mode === "stopwatch" && stopwatchRunning) ? "일시정지" : "시작"}
        </Button>
        <Button onClick={resetTimer} variant="outline" className="w-24">
          리셋
        </Button>
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>시간이 다 되었습니다!</AlertDialogTitle>
            <AlertDialogDescription>
              설정한 학습 시간이 완료되었습니다. 잠시 휴식을 취하거나 다음 학습을 시작하세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
