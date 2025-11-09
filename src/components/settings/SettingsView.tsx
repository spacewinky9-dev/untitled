import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Gear, BookOpen, Code, Robot, ChartLine, Question } from '@phosphor-icons/react'
import { EADocumentation } from '@/components/builder/EADocumentation'
import { CustomIndicatorManager } from '@/components/builder/CustomIndicatorManager'
import { CustomIndicatorGuide } from '@/components/builder/CustomIndicatorGuide'
import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { EASettings, CanvasSettings, DEFAULT_EA_SETTINGS, DEFAULT_CANVAS_SETTINGS } from '@/types/settings'

export function SettingsView() {
  const [showEADocs, setShowEADocs] = useState(false)
  const [showIndicatorManager, setShowIndicatorManager] = useState(false)
  const [showIndicatorGuide, setShowIndicatorGuide] = useState(false)
  const [eaSettings, setEASettings] = useKV<EASettings>('ea-settings', DEFAULT_EA_SETTINGS)
  const [canvasSettings, setCanvasSettings] = useKV<CanvasSettings>('canvas-settings', DEFAULT_CANVAS_SETTINGS)

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="ea-settings">EA Settings</TabsTrigger>
            <TabsTrigger value="indicators">Indicators</TabsTrigger>
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

          <TabsContent value="indicators" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ChartLine size={24} className="text-accent" />
                  <div>
                    <CardTitle>Custom Indicators</CardTitle>
                    <CardDescription>
                      Manage your MetaTrader custom indicators library
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-sm">About Custom Indicators</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Custom indicators are technical analysis tools you can write for MetaTrader. They fill output buffers 
                    with numeric data that can be read by Expert Advisors. Each buffer maps to candles on the chart.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Important Notes:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>EMPTY_VALUE indicates no data (conditions won't pass)</li>
                      <li>For arrow indicators, try Candle ID &gt; 0 (signals on older candles)</li>
                      <li>Some indicators draw objects directly (not in buffers)</li>
                      <li>Buffer indices start at 0 (first buffer is 0, second is 1, etc.)</li>
                    </ul>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => setShowIndicatorManager(true)}
                >
                  <ChartLine className="mr-2" size={16} />
                  Manage Custom Indicators
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs"
                    onClick={() => setShowIndicatorGuide(true)}
                  >
                    <BookOpen className="mr-2" size={14} />
                    Indicator Guide
                  </Button>
                  <Button variant="outline" className="w-full text-xs">
                    <Code className="mr-2" size={14} />
                    MQL Reference
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicator Locations</CardTitle>
                <CardDescription>
                  Where to find your custom indicators in MetaTrader
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">MetaTrader 4</Label>
                  <div className="bg-muted/50 p-3 rounded font-mono text-xs break-all">
                    %Data Folder%/MQL4/Indicators/
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">MetaTrader 5</Label>
                  <div className="bg-muted/50 p-3 rounded font-mono text-xs break-all">
                    %Data Folder%/MQL5/Indicators/
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Open Data Folder: File → Open Data Folder in MetaTrader
                </p>
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
                  <Switch 
                    checked={canvasSettings.showGrid}
                    onCheckedChange={(checked) => setCanvasSettings({ ...canvasSettings, showGrid: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Block Numbers</Label>
                    <p className="text-sm text-muted-foreground">
                      Display execution order numbers on nodes
                    </p>
                  </div>
                  <Switch 
                    checked={canvasSettings.showBlockNumbers}
                    onCheckedChange={(checked) => setCanvasSettings({ ...canvasSettings, showBlockNumbers: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Minimap</Label>
                    <p className="text-sm text-muted-foreground">
                      Display canvas minimap for navigation
                    </p>
                  </div>
                  <Switch 
                    checked={canvasSettings.showMinimap}
                    onCheckedChange={(checked) => setCanvasSettings({ ...canvasSettings, showMinimap: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-arrange Nodes</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically organize nodes when adding
                    </p>
                  </div>
                  <Switch 
                    checked={canvasSettings.autoArrange}
                    onCheckedChange={(checked) => setCanvasSettings({ ...canvasSettings, autoArrange: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Snap to Grid</Label>
                    <p className="text-sm text-muted-foreground">
                      Align nodes to grid when moving
                    </p>
                  </div>
                  <Switch 
                    checked={canvasSettings.snapToGrid}
                    onCheckedChange={(checked) => setCanvasSettings({ ...canvasSettings, snapToGrid: checked })}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Connection Animation</Label>
                      <p className="text-sm text-muted-foreground">
                        Animate data flow through connections
                      </p>
                    </div>
                    <Switch 
                      checked={canvasSettings.enableConnectionAnimation}
                      onCheckedChange={(checked) => setCanvasSettings({ ...canvasSettings, enableConnectionAnimation: checked })}
                    />
                  </div>
                  
                  {canvasSettings.enableConnectionAnimation && (
                    <div className="space-y-3 pl-4 border-l-2 border-border">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="animation-speed">Animation Speed</Label>
                          <span className="text-sm font-mono text-muted-foreground">
                            {canvasSettings.connectionAnimationSpeed}x
                          </span>
                        </div>
                        <Slider
                          id="animation-speed"
                          min={0.1}
                          max={3}
                          step={0.1}
                          value={[canvasSettings.connectionAnimationSpeed]}
                          onValueChange={([value]) => setCanvasSettings({ ...canvasSettings, connectionAnimationSpeed: value })}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Slow (0.1x)</span>
                          <span>Normal (1x)</span>
                          <span>Fast (3x)</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {canvasSettings.connectionAnimationSpeed < 0.5 && 'Very slow - Best for detailed visualization'}
                          {canvasSettings.connectionAnimationSpeed >= 0.5 && canvasSettings.connectionAnimationSpeed < 1 && 'Slow - Good for learning data flow'}
                          {canvasSettings.connectionAnimationSpeed === 1 && 'Normal speed - Default animation rate'}
                          {canvasSettings.connectionAnimationSpeed > 1 && canvasSettings.connectionAnimationSpeed <= 2 && 'Fast - Quick visual feedback'}
                          {canvasSettings.connectionAnimationSpeed > 2 && 'Very fast - Minimal distraction'}
                        </p>
                      </div>
                    </div>
                  )}
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

      <CustomIndicatorManager
        open={showIndicatorManager}
        onOpenChange={setShowIndicatorManager}
      />

      <Dialog open={showIndicatorGuide} onOpenChange={setShowIndicatorGuide}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Question size={20} />
              Custom Indicators Guide
            </DialogTitle>
            <DialogDescription>
              Everything you need to know about using custom indicators
            </DialogDescription>
          </DialogHeader>
          <CustomIndicatorGuide />
        </DialogContent>
      </Dialog>
    </div>
  )
}
