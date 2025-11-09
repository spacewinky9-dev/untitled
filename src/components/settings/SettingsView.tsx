import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Gear, BookOpen, Code, Robot } from '@phosphor-icons/react'
import { EADocumentation } from '@/components/builder/EADocumentation'
import { useState } from 'react'
import { useKV } from '@github/spark/hooks'

interface EASettings {
  magicNumberBase: number
  slippage: number
  maxSpread: number
  enableLogging: boolean
  logLevel: 'minimal' | 'normal' | 'verbose'
  commentPrefix: string
}

const DEFAULT_EA_SETTINGS: EASettings = {
  magicNumberBase: 12345,
  slippage: 3,
  maxSpread: 3.0,
  enableLogging: true,
  logLevel: 'normal',
  commentPrefix: 'ForexFlow'
}

export function SettingsView() {
  const [showEADocs, setShowEADocs] = useState(false)
  const [eaSettings, setEASettings] = useKV<EASettings>('ea-settings', DEFAULT_EA_SETTINGS)

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Gear size={32} className="text-accent" />
              <h2 className="text-2xl font-semibold">Settings</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure your ForexFlow preferences and EA defaults.
            </p>
          </div>
          <Dialog open={showEADocs} onOpenChange={setShowEADocs}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <BookOpen className="mr-2" size={16} />
                EA Documentation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>Expert Advisor Documentation</DialogTitle>
                <DialogDescription>
                  Complete guide to understanding and creating Expert Advisors
                </DialogDescription>
              </DialogHeader>
              <EADocumentation />
            </DialogContent>
          </Dialog>
        </div>

        <Separator />

        <Tabs defaultValue="trading" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="ea-settings">EA Settings</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Trading Defaults</CardTitle>
                <CardDescription>
                  Default values for new strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="initial-balance">Initial Balance</Label>
                  <Input
                    id="initial-balance"
                    type="number"
                    defaultValue="10000"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk-per-trade">Risk Per Trade (%)</Label>
                  <Input
                    id="risk-per-trade"
                    type="number"
                    defaultValue="1"
                    step="0.1"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-lots">Default Lot Size</Label>
                  <Input
                    id="default-lots"
                    type="number"
                    defaultValue="0.01"
                    step="0.01"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leverage">Leverage</Label>
                  <Input
                    id="leverage"
                    type="number"
                    defaultValue="100"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-sl">Default Stop Loss (pips)</Label>
                  <Input
                    id="default-sl"
                    type="number"
                    defaultValue="20"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-tp">Default Take Profit (pips)</Label>
                  <Input
                    id="default-tp"
                    type="number"
                    defaultValue="40"
                    className="font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ea-settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Robot size={24} className="text-primary" />
                  <div>
                    <CardTitle>Expert Advisor Configuration</CardTitle>
                    <CardDescription>
                      MetaTrader EA-specific settings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="magic-number">Magic Number (Base)</Label>
                  <Input
                    id="magic-number"
                    type="number"
                    value={eaSettings.magicNumberBase}
                    onChange={(e) => setEASettings({ ...eaSettings, magicNumberBase: parseInt(e.target.value) || 0 })}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Unique identifier for trades from your EA. Each strategy gets an incremented number.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slippage">Maximum Slippage (pips)</Label>
                  <Input
                    id="slippage"
                    type="number"
                    value={eaSettings.slippage}
                    onChange={(e) => setEASettings({ ...eaSettings, slippage: parseInt(e.target.value) || 0 })}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum allowed price slippage when opening orders.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-spread">Maximum Spread (pips)</Label>
                  <Input
                    id="max-spread"
                    type="number"
                    value={eaSettings.maxSpread}
                    onChange={(e) => setEASettings({ ...eaSettings, maxSpread: parseFloat(e.target.value) || 0 })}
                    step="0.1"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Prevent trading when spread exceeds this value.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment-prefix">Trade Comment Prefix</Label>
                  <Input
                    id="comment-prefix"
                    type="text"
                    value={eaSettings.commentPrefix}
                    onChange={(e) => setEASettings({ ...eaSettings, commentPrefix: e.target.value })}
                    placeholder="ForexFlow"
                  />
                  <p className="text-xs text-muted-foreground">
                    Prefix for trade comments to identify EA-generated trades.
                  </p>
                </div>

                <Separator />

                <div>
                  <Label className="mb-3 block">Logging Configuration</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Logging</Label>
                        <p className="text-sm text-muted-foreground">
                          Write EA events to MetaTrader log
                        </p>
                      </div>
                      <Switch 
                        checked={eaSettings.enableLogging}
                        onCheckedChange={(checked) => setEASettings({ ...eaSettings, enableLogging: checked })}
                      />
                    </div>

                    {eaSettings.enableLogging && (
                      <div className="space-y-2">
                        <Label>Log Detail Level</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            variant={eaSettings.logLevel === 'minimal' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEASettings({ ...eaSettings, logLevel: 'minimal' })}
                          >
                            Minimal
                          </Button>
                          <Button 
                            variant={eaSettings.logLevel === 'normal' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEASettings({ ...eaSettings, logLevel: 'normal' })}
                          >
                            Normal
                          </Button>
                          <Button 
                            variant={eaSettings.logLevel === 'verbose' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEASettings({ ...eaSettings, logLevel: 'verbose' })}
                          >
                            Verbose
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {eaSettings.logLevel === 'minimal' && 'Log only errors and critical events'}
                          {eaSettings.logLevel === 'normal' && 'Log trades and important events'}
                          {eaSettings.logLevel === 'verbose' && 'Log detailed debug information'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code size={24} className="text-accent" />
                  <div>
                    <CardTitle>Code Export Settings</CardTitle>
                    <CardDescription>
                      MQL4/MQL5 code generation preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Add explanatory comments in generated code
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Strict Error Handling</Label>
                    <p className="text-sm text-muted-foreground">
                      Include comprehensive error checking
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Optimize for Speed</Label>
                    <p className="text-sm text-muted-foreground">
                      Generate performance-optimized code
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interface" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Canvas Settings</CardTitle>
                <CardDescription>
                  Customize your strategy builder workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Grid</Label>
                    <p className="text-sm text-muted-foreground">
                      Display grid on strategy canvas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Block Numbers</Label>
                    <p className="text-sm text-muted-foreground">
                      Display execution order numbers on nodes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Minimap</Label>
                    <p className="text-sm text-muted-foreground">
                      Display canvas minimap for navigation
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-arrange Nodes</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically organize nodes when adding
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Snap to Grid</Label>
                    <p className="text-sm text-muted-foreground">
                      Align nodes to grid when moving
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  General application preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save strategy changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Tooltips</Label>
                    <p className="text-sm text-muted-foreground">
                      Display helpful tooltips on hover
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Confirm Before Delete</Label>
                    <p className="text-sm text-muted-foreground">
                      Ask for confirmation before deleting
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About ForexFlow</CardTitle>
                <CardDescription>
                  Version and application information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono">1.0.0-beta</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Build</span>
                  <span className="font-mono">2025.01</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Platform</span>
                  <span className="font-mono">MetaTrader 4/5</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ForexFlow is a next-generation visual forex bot builder for creating, testing, and deploying 
                    automated trading strategies. Build Expert Advisors without coding using an intuitive 
                    node-based interface, then export production-ready MQL4/MQL5 code for MetaTrader.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Visual node-based strategy builder</li>
                    <li>100+ pre-built trading blocks</li>
                    <li>Event-driven EA architecture</li>
                    <li>MQL4/MQL5 code export</li>
                    <li>AI-powered strategy generation</li>
                    <li>Comprehensive risk management</li>
                    <li>Money management systems</li>
                    <li>Multi-timeframe analysis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowEADocs(true)}
                >
                  <BookOpen className="mr-2" size={16} />
                  Expert Advisor Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Code className="mr-2" size={16} />
                  MQL4/MQL5 Reference
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Robot className="mr-2" size={16} />
                  Strategy Examples
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
