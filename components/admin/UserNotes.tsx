'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'

interface Note {
  id: string
  content: string
  createdAt: Date
  author: string
}

interface UserNotesProps {
  userId: string
  initialNotes?: Note[]
}

export default function UserNotes({ userId, initialNotes = [] }: UserNotesProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    
    setSaving(true)
    // API call would go here
    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date(),
      author: 'Admin'
    }
    setNotes([note, ...notes])
    setNewNote('')
    setSaving(false)
  }

  const handleDeleteNote = (id: string) => {
    if (confirm('Delete this note?')) {
      setNotes(notes.filter(n => n.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a note about this user..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
        />
        <Button onClick={handleAddNote} disabled={saving} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="border rounded-lg p-4 bg-yellow-50">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm text-gray-600">
                {note.author} • {new Date(note.createdAt).toLocaleString()}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteNote(note.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm">{note.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
