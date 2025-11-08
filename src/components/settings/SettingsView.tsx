import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Gear } from '@phosphor-icons/react'

export function SettingsView() {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Gear size={32} className="text-accent" />
            <h2 className="text-2xl font-semibold">Settings</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure your ForexFlow preferences and default values.
          </p>
        </div>

        <Separator />

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
              <Label htmlFor="leverage">Leverage</Label>
              <Input
                id="leverage"
                type="number"
                defaultValue="100"
                className="font-mono"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interface</CardTitle>
            <CardDescription>
              Customize your workspace
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
                <Label>Auto-save</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save strategy changes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Minimap</Label>
                <p className="text-sm text-muted-foreground">
                  Display canvas minimap
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>
              ForexFlow version and information
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-mono">1.0.0-alpha</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Build</span>
              <span className="font-mono">2025.01</span>
            </div>
            <Separator className="my-2" />
            <p className="text-muted-foreground">
              A next-generation visual forex bot builder for creating, testing, and deploying automated trading strategies.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
