'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { Card, CardContent } from '@/components/shared/Card'
import { Input } from '@/components/shared/Input'
import { mockCatchUpContent, mockQuizQuestions } from '@/lib/constants'

interface StudentCatchUpViewProps {
  lessonId: string
  studentName: string
  onComplete: () => void
}

export function StudentCatchUpView({ lessonId, studentName, onComplete }: StudentCatchUpViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(string | number | null)[]>(new Array(mockQuizQuestions.length).fill(null))
  const [isReading, setIsReading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const currentQuestion = mockQuizQuestions[currentQuestionIndex]
  const progressPercentage = ((currentQuestionIndex + 1) / mockQuizQuestions.length) * 100

  const handleAnswerChange = (value: string | number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = value
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = () => {
    setIsCompleted(true)
    setShowSuccess(true)
    setTimeout(() => {
      onComplete()
    }, 3000)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-success" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="heading-lg mb-2 text-success">Lesson Complete!</h1>
          <p className="text-muted-foreground mb-8">Great work catching up on the content.</p>
          <p className="text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-serif text-lg font-semibold text-foreground">Catch-Up Lesson</h1>
            <span className="text-xs font-medium text-muted-foreground">
              {isReading ? 'Reading' : `Question ${currentQuestionIndex + 1} of ${mockQuizQuestions.length}`}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: isReading ? '10%' : `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 mt-16 pb-32">
        {isReading ? (
          // Reading Section
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="heading-md mb-4 text-foreground">Content Overview</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-base max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap font-sans mb-6">
                      {mockCatchUpContent.explanation}
                    </p>

                    <div className="mt-8 pt-8 border-t border-border">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Key Topics Covered</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mockCatchUpContent.contentAudit.included.map((topic, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                            <span className="text-success font-semibold flex-shrink-0">✓</span>
                            <span className="text-sm text-foreground">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Proceed to Quiz */}
            <div className="flex justify-end gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsReading(false)}
              >
                Start Quiz →
              </Button>
            </div>
          </div>
        ) : (
          // Quiz Section
          <div className="space-y-8 animate-fade-in">
            <Card>
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border rounded-t-lg">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Question {currentQuestionIndex + 1} of {mockQuizQuestions.length}
                </p>
              </div>

              <CardContent className="pt-8">
                <h2 className="heading-sm mb-8 text-foreground">{currentQuestion.question}</h2>

                {currentQuestion.type === 'multiple-choice' ? (
                  // Multiple Choice
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, index) => (
                      <label
                        key={index}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          answers[currentQuestionIndex] === index
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-muted'
                        }`}
                      >
                        <input
                          type="radio"
                          name="question"
                          value={index}
                          checked={answers[currentQuestionIndex] === index}
                          onChange={() => handleAnswerChange(index)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-base text-foreground">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  // Short Answer
                  <Input
                    placeholder={currentQuestion.placeholder}
                    value={(answers[currentQuestionIndex] as string) || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="text-base p-4"
                  />
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </Button>

              <div className="flex gap-2">
                {mockQuizQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentQuestionIndex
                        ? 'bg-primary w-8'
                        : answers[index] !== null
                          ? 'bg-success'
                          : 'bg-border'
                    }`}
                    title={`Question ${index + 1}${answers[index] !== null ? ' (answered)' : ''}`}
                  />
                ))}
              </div>

              {currentQuestionIndex === mockQuizQuestions.length - 1 ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmitQuiz}
                  disabled={answers.some((a) => a === null)}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button variant="primary" size="lg" onClick={handleNextQuestion}>
                  Next →
                </Button>
              )}
            </div>

            {answers.some((a) => a === null) && (
              <p className="text-center text-sm text-warning">
                Please answer all questions before submitting
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
