import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from '@phosphor-icons/react'

export function LibraryView() {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={32} className="text-accent" />
            <CardTitle>Strategy Library</CardTitle>
          </div>
          <CardDescription>
            Browse, save, and load your trading strategies and templates.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Coming in Phase 9: Strategy Persistence & Marketplace</p>
          <ul className="mt-3 space-y-1 list-disc list-inside">
            <li>Save/load strategies</li>
            <li>Pre-built templates</li>
            <li>Strategy categorization</li>
            <li>Import/export functionality</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
