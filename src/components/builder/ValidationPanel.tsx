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
import { ValidationResult, ValidationIssue } from '@/lib/strategy-validator'

interface ValidationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  validation: ValidationResult
}

export function ValidationPanel({ open, onOpenChange, validation }: ValidationPanelProps) {
  const hasErrors = validation.issues.length > 0
  const hasWarnings = validation.warnings.length > 0
  const hasInfo = validation.info.length > 0
  const isValid = validation.valid

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'structure': return 'text-blue-400'
      case 'connection': return 'text-purple-400'
      case 'parameter': return 'text-yellow-400'
      case 'logic': return 'text-red-400'
      case 'performance': return 'text-green-400'
      default: return 'text-foreground'
    }
  }

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
          <div className="flex gap-3 flex-wrap">
            <Badge 
              variant={isValid ? "default" : "destructive"}
              className={isValid ? "bg-bullish" : "bg-bearish"}
            >
              {isValid ? 'Valid' : 'Invalid'}
            </Badge>
            {hasErrors && (
              <Badge variant="destructive">
                {validation.issues.length} Error{validation.issues.length !== 1 ? 's' : ''}
              </Badge>
            )}
            {hasWarnings && (
              <Badge variant="outline" className="border-accent text-accent">
                {validation.warnings.length} Warning{validation.warnings.length !== 1 ? 's' : ''}
              </Badge>
            )}
            {hasInfo && (
              <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                {validation.info.length} Info
              </Badge>
            )}
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {/* Errors */}
              {validation.issues.map((error, idx) => (
                <Alert key={`error-${idx}`} variant="destructive">
                  <div className="flex items-start gap-3">
                    <XCircle size={20} weight="fill" className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">Error</span>
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(error.category)}`}>
                          {error.category}
                        </Badge>
                      </div>
                      <AlertDescription>{error.message}</AlertDescription>
                      {(error.nodeId || error.edgeId) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {error.nodeId && (
                            <Badge variant="outline" className="text-xs">
                              Node: {error.nodeId}
                            </Badge>
                          )}
                          {error.edgeId && (
                            <Badge variant="outline" className="text-xs">
                              Edge: {error.edgeId}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}

              {/* Warnings */}
              {validation.warnings.map((warning, idx) => (
                <Alert key={`warning-${idx}`} className="border-accent">
                  <div className="flex items-start gap-3">
                    <Warning size={20} weight="fill" className="mt-0.5 flex-shrink-0 text-accent" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-accent">Warning</span>
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(warning.category)}`}>
                          {warning.category}
                        </Badge>
                      </div>
                      <AlertDescription>{warning.message}</AlertDescription>
                      {(warning.nodeId || warning.edgeId) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {warning.nodeId && (
                            <Badge variant="outline" className="text-xs">
                              Node: {warning.nodeId}
                            </Badge>
                          )}
                          {warning.edgeId && (
                            <Badge variant="outline" className="text-xs">
                              Edge: {warning.edgeId}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}

              {/* Info */}
              {validation.info.map((info, idx) => (
                <Alert key={`info-${idx}`} className="border-muted">
                  <div className="flex items-start gap-3">
                    <Info size={20} weight="fill" className="mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-muted-foreground">Info</span>
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(info.category)}`}>
                          {info.category}
                        </Badge>
                      </div>
                      <AlertDescription>{info.message}</AlertDescription>
                      {(info.nodeId || info.edgeId) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {info.nodeId && (
                            <Badge variant="outline" className="text-xs">
                              Node: {info.nodeId}
                            </Badge>
                          )}
                          {info.edgeId && (
                            <Badge variant="outline" className="text-xs">
                              Edge: {info.edgeId}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}


              {/* Success message */}
              {isValid && !hasWarnings && !hasInfo && (
                <Alert className="border-bullish bg-bullish/10">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} weight="fill" className="mt-0.5 flex-shrink-0 text-bullish" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1 text-bullish">
                        All Checks Passed
                      </div>
                      <AlertDescription>
                        Your strategy has valid connections, proper flow, no circular dependencies,
                        and all parameters are configured correctly. Ready to backtest or export to MQL!
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Info when valid with warnings */}
              {isValid && (hasWarnings || hasInfo) && (
                <Alert className="border-accent bg-accent/10">
                  <div className="flex items-start gap-3">
                    <Info size={20} weight="fill" className="mt-0.5 flex-shrink-0 text-accent" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1 text-accent">
                        Valid with Suggestions
                      </div>
                      <AlertDescription>
                        Your strategy will execute successfully. Consider reviewing the suggestions above
                        for potential improvements to performance and risk management.
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
