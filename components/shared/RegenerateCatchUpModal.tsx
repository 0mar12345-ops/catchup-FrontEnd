'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'

interface RegenerateCatchUpModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (type: 'full' | 'explanation' | 'quiz', customPrompt?: string) => void
  isLoading?: boolean
}

export function RegenerateCatchUpModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: RegenerateCatchUpModalProps) {
  const [selectedType, setSelectedType] = useState<'full' | 'explanation' | 'quiz'>('full')
  const [customPrompt, setCustomPrompt] = useState('')

  const handleConfirm = () => {
    onConfirm(selectedType, customPrompt.trim() || undefined)
  }

  const regenerationOptions = [
    {
      value: 'full' as const,
      label: 'Full Regeneration',
      description: 'Regenerate both the explanation and quiz questions',
      icon: '🔄',
    },
    {
      value: 'explanation' as const,
      label: 'Regenerate Explanation',
      description: 'Only regenerate the lesson explanation content',
      icon: '📝',
    },
    {
      value: 'quiz' as const,
      label: 'Regenerate Quiz',
      description: 'Only regenerate the quiz questions',
      icon: '❓',
    },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Regenerate Catch-Up Lesson">
      <div className="space-y-6">
        {/* Regeneration Type Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Regeneration Type
          </label>
          <div className="space-y-2">
            {regenerationOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedType === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                }`}
              >
                <input
                  type="radio"
                  name="regenerationType"
                  value={option.value}
                  checked={selectedType === option.value}
                  onChange={(e) => setSelectedType(e.target.value as 'full' | 'explanation' | 'quiz')}
                  disabled={isLoading}
                  className="mt-0.5 accent-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium text-foreground">{option.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Prompt (Optional) */}
        <div>
          <label htmlFor="customPrompt" className="block text-sm font-medium text-foreground mb-2">
            Custom Instructions (Optional)
          </label>
          <textarea
            id="customPrompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Add specific instructions for the AI to follow during regeneration..."
            disabled={isLoading}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Example: "Focus more on practical examples" or "Make it easier to understand"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            Regenerate Content
          </Button>
        </div>
      </div>
    </Modal>
  )
}
