"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SignupStep } from "@/components/survey-steps/signup-step"
import { WelcomeStep } from "@/components/survey-steps/welcome-step"
import { ExamStep } from "@/components/survey-steps/exam-step"
import { YesNoStep } from "@/components/survey-steps/yesno-step"
import { GenderStep } from "@/components/survey-steps/gender-step"
import { EducationStep } from "@/components/survey-steps/education-step"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    exam: "",
    gender: "",
    education: {
      school: "",
      status: ""
    }
  })

  const handleSignupChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    setStep(prev => prev + 1)
  }

  const handleFinish = () => {
    // Here you would typically submit the form data to your backend
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <Card className="max-w-md mx-auto p-6 space-y-6">
        <Progress value={step * 100 / 6} className="h-2" />
        <div className="text-sm text-center">
            {step} / {6}
        </div>

        {step === 1 && (
          <SignupStep
            values={{
              username: formData.username,
              password: formData.password,
              passwordConfirm: formData.passwordConfirm
            }}
            onChange={handleSignupChange}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <WelcomeStep onNext={handleNext} />
        )}

        {step === 3 && (
          <YesNoStep
            value={formData.gender}
            onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
            onNext={handleNext}
          />
        )}

        {step === 4 && (
          <ExamStep
            value={formData.exam}
            onChange={(value) => setFormData(prev => ({ ...prev, exam: value }))}
            onNext={handleNext}
          />
        )}

        {step === 5 && (
          <GenderStep
            value={formData.gender}
            onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
            onNext={handleNext}
          />
        )}

        {step === 6 && (
          <EducationStep
            school={formData.education.school}
            status={formData.education.status}
            onSchoolChange={(value) => 
              setFormData(prev => ({
                ...prev,
                education: { ...prev.education, school: value }
              }))
            }
            onStatusChange={(value) =>
              setFormData(prev => ({
                ...prev,
                education: { ...prev.education, status: value }
              }))
            }
            onFinish={handleFinish}
          />
        )}
      </Card>
    </div>
  )
}

