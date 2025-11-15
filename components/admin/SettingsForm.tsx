'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LoadingSpinner from './LoadingSpinner'

interface SettingsFormProps {
  initialSettings: Record<string, string>
  category: 'general' | 'email' | 'payment' | 'seo'
}

const settingsFields = {
  general: [
    { key: 'site_name', label: 'Site Name', type: 'text' },
    { key: 'site_description', label: 'Site Description', type: 'text' },
    { key: 'contact_email', label: 'Contact Email', type: 'email' },
    { key: 'contact_phone', label: 'Contact Phone', type: 'tel' },
  ],
  email: [
    { key: 'smtp_host', label: 'SMTP Host', type: 'text' },
    { key: 'smtp_port', label: 'SMTP Port', type: 'number' },
    { key: 'smtp_user', label: 'SMTP Username', type: 'text' },
    { key: 'smtp_from', label: 'From Email', type: 'email' },
  ],
  payment: [
    { key: 'currency', label: 'Currency', type: 'text' },
    { key: 'tax_rate', label: 'Tax Rate (%)', type: 'number' },
    { key: 'razorpay_key', label: 'Razorpay Key', type: 'text' },
  ],
  seo: [
    { key: 'meta_title', label: 'Meta Title', type: 'text' },
    { key: 'meta_description', label: 'Meta Description', type: 'text' },
    { key: 'meta_keywords', label: 'Meta Keywords', type: 'text' },
  ],
}

export default function SettingsForm({ initialSettings, category }: SettingsFormProps) {
  const router = useRouter()
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const fields = settingsFields[category]

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const promises = fields.map(field =>
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: field.key,
            value: settings[field.key] || '',
          }),
        })
      )

      await Promise.all(promises)
      alert('Settings saved successfully!')
      router.refresh()
    } catch (error) {
      alert('Failed to save settings')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {fields.map(field => (
        <div key={field.key}>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input
            id={field.key}
            type={field.type}
            value={settings[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            disabled={isSaving}
          />
        </div>
      ))}
      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? <LoadingSpinner size="sm" /> : 'Save Settings'}
      </Button>
    </div>
  )
}
