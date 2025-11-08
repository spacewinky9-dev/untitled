import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Code, Robot } from '@phosphor-icons/react'

interface NewProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateProject: (config: ProjectConfig) => void
}

export interface ProjectConfig {
  name: string
  type: 'expert_advisor' | 'indicator' | 'script'
  language: 'mql4' | 'mql5'
}

export function NewProjectDialog({ open, onOpenChange, onCreateProject }: NewProjectDialogProps) {
  const [projectName, setProjectName] = useState('My Strategy')
  const [projectType, setProjectType] = useState<ProjectConfig['type']>('expert_advisor')
  const [language, setLanguage] = useState<ProjectConfig['language']>('mql4')

  const handleCreate = () => {
    onCreateProject({
      name: projectName,
      type: projectType,
      language: language
    })
    onOpenChange(false)
    setProjectName('My Strategy')
    setProjectType('expert_advisor')
    setLanguage('mql4')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Project</DialogTitle>
          <DialogDescription>
            Configure your new trading strategy project. Choose the type and programming language.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label>Project Type</Label>
            <div className="grid grid-cols-3 gap-3">
              <Card
                className={`p-3 cursor-pointer transition-all hover:border-primary ${
                  projectType === 'expert_advisor' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setProjectType('expert_advisor')}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <Robot size={24} weight="duotone" />
                  <div className="text-xs font-medium">Expert Advisor</div>
                  <div className="text-[10px] text-muted-foreground">Trading bot</div>
                </div>
              </Card>

              <Card
                className={`p-3 cursor-pointer transition-all hover:border-primary ${
                  projectType === 'indicator' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setProjectType('indicator')}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <Code size={24} weight="duotone" />
                  <div className="text-xs font-medium">Indicator</div>
                  <div className="text-[10px] text-muted-foreground">Custom indicator</div>
                </div>
              </Card>

              <Card
                className={`p-3 cursor-pointer transition-all hover:border-primary ${
                  projectType === 'script' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setProjectType('script')}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <Code size={24} weight="duotone" />
                  <div className="text-xs font-medium">Script</div>
                  <div className="text-[10px] text-muted-foreground">One-time script</div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Programming Language</Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as ProjectConfig['language'])}>
              <SelectTrigger id="language" className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="mql4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">MQL4</span>
                    <span className="text-xs text-muted-foreground">MetaTrader 4</span>
                  </div>
                </SelectItem>
                <SelectItem value="mql5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">MQL5</span>
                    <span className="text-xs text-muted-foreground">MetaTrader 5</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!projectName.trim()}>
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
