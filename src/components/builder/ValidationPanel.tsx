import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Warning, Info, XCircle } from '@phosphor-icons/react'
import { ValidationResult } from '@/lib/engine/connection-validator'

interface ValidationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  validation: ValidationResult
}

export function ValidationPanel({ open, onOpenChange, validation }: ValidationPanelProps) {
  const hasErrors = validation.errors.length > 0
  const hasWarnings = validation.warnings.length > 0
  const isValid = validation.isValid

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isValid ? (
              <CheckCircle size={32} weight="fill" className="text-bullish" />
            ) : (
              <XCircle size={32} weight="fill" className="text-bearish" />
            )}
            <div>
              <DialogTitle className="text-2xl">Strategy Validation</DialogTitle>
              <DialogDescription>
                {isValid 
                  ? 'Your strategy is valid and ready to execute!'
                  : 'Your strategy has issues that need to be fixed.'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="flex gap-3">
            <Badge 
              variant={isValid ? "default" : "destructive"}
              className={isValid ? "bg-bullish" : "bg-bearish"}
            >
              {isValid ? 'Valid' : 'Invalid'}
            </Badge>
            {hasErrors && (
              <Badge variant="destructive">
                {validation.errors.length} Error{validation.errors.length !== 1 ? 's' : ''}
              </Badge>
            )}
            {hasWarnings && (
              <Badge variant="outline" className="border-accent text-accent">
                {validation.warnings.length} Warning{validation.warnings.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {/* Errors */}
              {validation.errors.map((error, idx) => (
                <Alert key={error.id} variant="destructive">
                  <div className="flex items-start gap-3">
                    <XCircle size={20} weight="fill" className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1 capitalize">
                        {error.type} Error
                      </div>
                      <AlertDescription>{error.message}</AlertDescription>
                      {error.nodeIds.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {error.nodeIds.map(nodeId => (
                            <Badge key={nodeId} variant="outline" className="text-xs">
                              {nodeId}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}

              {/* Warnings */}
              {validation.warnings.map((warning, idx) => (
                <Alert key={warning.id} className="border-accent">
                  <div className="flex items-start gap-3">
                    <Warning size={20} weight="fill" className="mt-0.5 flex-shrink-0 text-accent" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1 text-accent">
                        Warning
                      </div>
                      <AlertDescription>{warning.message}</AlertDescription>
                      {warning.nodeIds.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {warning.nodeIds.map(nodeId => (
                            <Badge key={nodeId} variant="outline" className="text-xs">
                              {nodeId}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}

              {/* Success message */}
              {isValid && !hasWarnings && (
                <Alert className="border-bullish bg-bullish/10">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} weight="fill" className="mt-0.5 flex-shrink-0 text-bullish" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1 text-bullish">
                        All Checks Passed
                      </div>
                      <AlertDescription>
                        Your strategy has valid connections, proper flow, and no circular dependencies.
                        You can now run a backtest or export to MQL.
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Info when valid with warnings */}
              {isValid && hasWarnings && (
                <Alert className="border-accent bg-accent/10">
                  <div className="flex items-start gap-3">
                    <Info size={20} weight="fill" className="mt-0.5 flex-shrink-0 text-accent" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1 text-accent">
                        Valid with Warnings
                      </div>
                      <AlertDescription>
                        Your strategy will execute, but you may want to address the warnings above
                        for better results.
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {isValid && (
              <Button className="bg-bullish text-bullish-foreground hover:bg-bullish/90">
                Continue to Backtest
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
