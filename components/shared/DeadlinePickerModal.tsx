'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'

interface DeadlinePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (dueDate: Date | undefined, title: string) => void
  isLoading?: boolean
  defaultTitle?: string
}

export function DeadlinePickerModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  defaultTitle = '',
}: DeadlinePickerModalProps) {
  const [dueDate, setDueDate] = useState<string>('')
  const [skipDeadline, setSkipDeadline] = useState(false)
  const [title, setTitle] = useState(defaultTitle)

  const handleConfirm = () => {
    if (skipDeadline || !dueDate) {
      onConfirm(undefined, title)
    } else {
      onConfirm(new Date(dueDate), title)
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deliver Catch-Up Lesson">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Lesson Title
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this lesson"
            disabled={isLoading}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This title will appear in Google Classroom and the PDF.
          </p>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-2">
            Due Date (Optional)
          </label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value)
              setSkipDeadline(false)
            }}
            min={getTomorrowDate()}
            disabled={skipDeadline || isLoading}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Select a due date for the assignment, or leave blank for no deadline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="skipDeadline"
            checked={skipDeadline}
            onChange={(e) => {
              setSkipDeadline(e.target.checked)
              if (e.target.checked) {
                setDueDate('')
              }
            }}
            disabled={isLoading}
            className="rounded border-border"
          />
          <label htmlFor="skipDeadline" className="text-sm text-foreground cursor-pointer">
            No deadline needed
          </label>
        </div>

        <div className="flex gap-3 pt-4">
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
            Deliver Lesson
          </Button>
        </div>
      </div>
    </Modal>
  )
}
