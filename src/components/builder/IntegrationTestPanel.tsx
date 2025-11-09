import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, ClockClockwise, Flask } from '@phosphor-icons/react'
import { nodeIntegrationTester, IntegrationTestResult, NodeTestResult } from '@/lib/node-integration-tester'

export function IntegrationTestPanel() {
  const [open, setOpen] = useState(false)
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<IntegrationTestResult | null>(null)

  const runTests = async () => {
    setTesting(true)
    setResult(null)
    
    try {
      const testResult = await nodeIntegrationTester.runAllTests()
      setResult(testResult)
    } catch (error) {
      console.error('Integration tests failed:', error)
    } finally {
      setTesting(false)
    }
  }

  const groupedResults = result?.results.reduce((acc, r) => {
    if (!acc[r.nodeType]) {
      acc[r.nodeType] = []
    }
    acc[r.nodeType].push(r)
    return acc
  }, {} as Record<string, NodeTestResult[]>)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Flask size={16} />
          Integration Tests
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Flask size={32} weight="fill" className="text-accent" />
            <div>
              <DialogTitle className="text-2xl">Node Integration Tests</DialogTitle>
              <DialogDescription>
                Comprehensive testing of all node types with the strategy executor
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {!result && !testing && (
            <div className="text-center py-12">
              <Flask size={64} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Ready to Test</p>
              <p className="text-sm text-muted-foreground mb-6">
                Run comprehensive integration tests to verify all node types work correctly
                with the strategy executor.
              </p>
              <Button onClick={runTests} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Flask size={18} className="mr-2" />
                Run All Tests
              </Button>
            </div>
          )}

          {testing && (
            <div className="text-center py-12">
              <ClockClockwise size={64} weight="duotone" className="mx-auto mb-4 text-accent animate-spin" />
              <p className="text-lg font-medium mb-2">Running Tests...</p>
              <p className="text-sm text-muted-foreground">
                Testing all node types and integrations
              </p>
            </div>
          )}

          {result && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{result.totalTests}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Passed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-bullish">{result.passedTests}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Failed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-bearish">{result.failedTests}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{result.overallExecutionTime.toFixed(0)}ms</div>
                  </CardContent>
                </Card>
              </div>

              {/* Overall Status */}
              <Card className={result.passed ? 'border-bullish bg-bullish/5' : 'border-bearish bg-bearish/5'}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    {result.passed ? (
                      <CheckCircle size={24} weight="fill" className="text-bullish" />
                    ) : (
                      <XCircle size={24} weight="fill" className="text-bearish" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {result.passed ? 'All Tests Passed! ✓' : 'Some Tests Failed'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.passed 
                          ? 'All node types are working correctly with the strategy executor.'
                          : `${result.failedTests} test(s) failed. Review the details below.`
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-medium">
                    {((result.passedTests / result.totalTests) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={(result.passedTests / result.totalTests) * 100} 
                  className="h-2"
                />
              </div>

              {/* Detailed Results */}
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {groupedResults && Object.entries(groupedResults).map(([nodeType, tests]) => {
                    const passed = tests.filter(t => t.passed).length
                    const failed = tests.filter(t => !t.passed).length
                    const avgTime = tests.reduce((sum, t) => sum + (t.executionTime || 0), 0) / tests.length

                    return (
                      <Card key={nodeType}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-lg capitalize">{nodeType} Nodes</CardTitle>
                              <Badge variant={failed === 0 ? "default" : "destructive"} className={failed === 0 ? "bg-bullish" : ""}>
                                {passed}/{tests.length}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Avg: {avgTime.toFixed(1)}ms
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {tests.map((test, idx) => (
                              <div 
                                key={idx} 
                                className="flex items-center justify-between p-3 rounded-lg bg-card border"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {test.passed ? (
                                    <CheckCircle size={20} weight="fill" className="text-bullish flex-shrink-0" />
                                  ) : (
                                    <XCircle size={20} weight="fill" className="text-bearish flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                      {test.nodeSubtype || test.nodeType}
                                    </p>
                                    {test.error && (
                                      <p className="text-sm text-bearish truncate mt-1">
                                        {test.error}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  {test.executionTime && (
                                    <Badge variant="outline" className="text-xs">
                                      {test.executionTime.toFixed(1)}ms
                                    </Badge>
                                  )}
                                  <Badge 
                                    variant={test.passed ? "default" : "destructive"}
                                    className={test.passed ? "bg-bullish" : ""}
                                  >
                                    {test.passed ? 'PASS' : 'FAIL'}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button onClick={runTests} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Flask size={18} className="mr-2" />
                  Run Tests Again
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
