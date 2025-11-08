import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Download, Copy, CheckCircle } from '@phosphor-icons/react'
import { Strategy } from '@/types/strategy'
import { ProjectConfig } from './NewProjectDialog'
import { exportToMQL, MQLVersion } from '@/lib/mql-export'
import { toast } from 'sonner'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  strategy: Strategy
  projectConfig?: ProjectConfig | null
}

export function ExportDialog({ open, onOpenChange, strategy, projectConfig }: ExportDialogProps) {
  const [expertName, setExpertName] = useState('ForexFlowBot')
  const [magicNumber, setMagicNumber] = useState(12345)
  const [selectedVersion, setSelectedVersion] = useState<MQLVersion>('mql4')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (projectConfig) {
      setExpertName(projectConfig.name)
      setSelectedVersion(projectConfig.language as MQLVersion)
    }
  }, [projectConfig])

  const generatedCode = exportToMQL(strategy, {
    version: selectedVersion,
    expertName,
    magicNumber
  })

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    toast.success('Code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const extension = selectedVersion === 'mql4' ? 'mq4' : 'mq5'
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${expertName}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`${expertName}.${extension} downloaded!`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Export to MetaTrader</DialogTitle>
          <DialogDescription>
            Generate MQL4 or MQL5 code for your trading strategy
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="expert-name">Expert Advisor Name</Label>
            <Input
              id="expert-name"
              value={expertName}
              onChange={(e) => setExpertName(e.target.value)}
              placeholder="ForexFlowBot"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="magic-number">Magic Number</Label>
            <Input
              id="magic-number"
              type="number"
              value={magicNumber}
              onChange={(e) => setMagicNumber(Number(e.target.value))}
              placeholder="12345"
            />
          </div>
        </div>

        <Tabs value={selectedVersion} onValueChange={(v) => setSelectedVersion(v as MQLVersion)} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mql4" className="gap-2">
              <Badge variant="outline" className="text-xs">MT4</Badge>
              MQL4
            </TabsTrigger>
            <TabsTrigger value="mql5" className="gap-2">
              <Badge variant="outline" className="text-xs">MT5</Badge>
              MQL5
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mql4" className="flex-1 flex flex-col min-h-0 mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Ready to use in MetaTrader 4
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopy} className="gap-2">
                  {copied ? <CheckCircle size={16} className="text-bullish" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button size="sm" onClick={handleDownload} className="gap-2">
                  <Download size={16} />
                  Download .mq4
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 border border-border rounded-lg bg-muted/30">
              <pre className="p-4 text-xs font-mono">
                <code>{generatedCode}</code>
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="mql5" className="flex-1 flex flex-col min-h-0 mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Ready to use in MetaTrader 5
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopy} className="gap-2">
                  {copied ? <CheckCircle size={16} className="text-bullish" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button size="sm" onClick={handleDownload} className="gap-2">
                  <Download size={16} />
                  Download .mq5
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 border border-border rounded-lg bg-muted/30">
              <pre className="p-4 text-xs font-mono">
                <code>{generatedCode}</code>
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <p><strong>Nodes:</strong> {strategy.nodes.length} | <strong>Connections:</strong> {strategy.edges.length}</p>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
