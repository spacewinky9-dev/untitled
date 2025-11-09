import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ChartLine, 
  Database, 
  Code, 
  Info, 
  Lightning, 
  Warning, 
  CheckCircle,
  ArrowRight,
  FileCode
} from '@phosphor-icons/react'

export function CustomIndicatorGuide() {
  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Custom Indicators in MetaTrader</h3>
          <p className="text-muted-foreground">
            A comprehensive guide to understanding and using custom indicators in your Expert Advisors
          </p>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              What Are Indicators?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Indicators provide visual information to help with trading decisions. This information appears as lines, 
              histograms, arrows, or other visual elements on your charts.
            </p>
            <p>
              Indicators can also provide data to other programs like Expert Advisors. In this case, the information 
              isn't visual—it's numeric data that computer programs can understand and use.
            </p>
            <p className="font-medium">
              Technically, all indicators work the same way: they fill arrays with numeric data. These arrays are 
              called <Badge variant="secondary" className="font-mono">output buffers</Badge> (or simply buffers).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              Finding Your Custom Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              Custom Indicators are indicators you can write for MetaTrader. MetaTrader has built-in indicators, 
              but you can also create your own.
            </p>
            <div className="space-y-3">
              <div>
                <p className="font-medium mb-2">MetaTrader 4:</p>
                <div className="bg-muted/50 p-3 rounded font-mono text-xs">
                  %Data Folder%/MQL4/Indicators/
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">MetaTrader 5:</p>
                <div className="bg-muted/50 p-3 rounded font-mono text-xs">
                  %Data Folder%/MQL5/Indicators/
                </div>
              </div>
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  To find your Data Folder: In MetaTrader, go to <strong>File → Open Data Folder</strong>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              How Indicators Communicate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              Indicators store their numeric data in <strong>buffers</strong>. A buffer is a one-dimensional array 
              filled with numeric data. The total number of elements in that array equals the number of candles on 
              the chart—one value per candle.
            </p>
            
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">Example: Moving Average</h4>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Candle 0</Badge>
                  <ArrowRight className="w-3 h-3" />
                  <span>1.3667</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Candle 1</Badge>
                  <ArrowRight className="w-3 h-3" />
                  <span>1.3658</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Candle 2</Badge>
                  <ArrowRight className="w-3 h-3" />
                  <span>1.3641</span>
                </div>
                <div className="text-muted-foreground">...</div>
              </div>
              <p className="text-muted-foreground">
                Each candle has an ID (shift): 0 is current, 1 is previous, 2 before that, etc.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Multiple Buffers</h4>
              <p>
                Indicators can have multiple buffers, each numbered starting from 0. For example:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                <li>Buffer 0 might be the main line</li>
                <li>Buffer 1 might be an upper band</li>
                <li>Buffer 2 might be a lower band</li>
              </ul>
            </div>

            <div className="bg-accent/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Lightning className="w-4 h-4" />
                Reading Values in EA
              </h4>
              <p>
                To get a value from an indicator, you need:
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-2 ml-2">
                <li>The indicator name (file name)</li>
                <li>The output buffer number (0, 1, 2, ...)</li>
                <li>The candle ID/shift (0, 1, 2, ...)</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Finding Buffer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              When you add a custom indicator to a chart in MetaTrader, you can see its buffers:
            </p>
            
            <div className="space-y-3">
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <p className="font-medium">In MetaTrader:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-muted-foreground">
                  <li>Right-click the indicator on the chart</li>
                  <li>Select "Properties" or "Settings"</li>
                  <li>Go to the "Colors" tab</li>
                  <li>You'll see the buffers listed with their numbers</li>
                </ol>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <p className="font-medium mb-2">Example: Bollinger Bands</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">0</Badge>
                    <span>Upper Band</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">1</Badge>
                    <span>Middle Band</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">2</Badge>
                    <span>Lower Band</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warning className="w-5 h-5" />
              Arrows and Interrupted Signals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              Some indicators don't draw continuous lines—they show arrows or dots only at certain candles. 
              How do they do that?
            </p>

            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">EMPTY_VALUE</h4>
              <p>
                There's a special value called <Badge variant="secondary" className="font-mono">EMPTY_VALUE</Badge> that 
                tells MetaTrader "don't draw anything for this candle."
              </p>
              <div className="space-y-2">
                <p className="text-muted-foreground">EMPTY_VALUE equals:</p>
                <div className="space-y-1 font-mono text-xs">
                  <div>MetaTrader 4 (32-bit): 2,147,483,647</div>
                  <div>MetaTrader 5 (64-bit): 9,223,372,036,854,775,807</div>
                </div>
              </div>
            </div>

            <Alert>
              <Warning className="w-4 h-4" />
              <AlertDescription>
                <strong>Important:</strong> In ForexFlow, condition blocks won't pass if an operand equals EMPTY_VALUE. 
                This is correct behavior—EMPTY_VALUE means "no data exists."
              </AlertDescription>
            </Alert>

            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>Tip:</strong> If you expect signals from an arrow indicator but don't see any, try setting 
                the <strong>Candle ID</strong> parameter to 1 or higher. These indicators often give signals on 
                older candles, not the current one.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartLine className="w-5 h-5" />
              Direct Drawing (No Buffers)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Some indicators draw directly on the chart instead of using buffers. This is common for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
              <li>Trend line indicators</li>
              <li>Support/resistance level indicators</li>
              <li>Pattern recognition indicators</li>
            </ul>
            
            <Alert>
              <Warning className="w-4 h-4" />
              <AlertDescription>
                Indicators that draw objects directly can't be easily read by EAs. You would need to access the 
                chart objects programmatically, which is complex. Additionally, strategies using these indicators 
                may not work during optimization due to MetaTrader limitations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Checking Buffer Contents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              When testing a new custom indicator, you might not know what's in its buffers. Here's how to check:
            </p>
            
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">What to Look For:</h4>
              <ul className="list-disc list-inside space-y-2 ml-2 text-muted-foreground">
                <li>
                  <strong>Various values:</strong> Good! The buffer contains useful data.
                </li>
                <li>
                  <strong>Same value repeated:</strong> This buffer might not be usable with that configuration.
                </li>
                <li>
                  <strong>EMPTY_VALUE everywhere:</strong> The buffer is empty—try different parameters or check 
                  if the indicator is drawing objects instead.
                </li>
              </ul>
            </div>

            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                Use the <strong>Indicator Buffer</strong> block in ForexFlow to test buffer values. Connect it to 
                a Print block to see the values during backtesting.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Using Custom Indicators in ForexFlow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              To use a custom indicator in your strategy:
            </p>
            
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li className="pl-2">
                <strong>Add to Library:</strong> Go to Settings → Indicators and add your custom indicator 
                by uploading the source code or entering details manually.
              </li>
              <li className="pl-2">
                <strong>Use in Strategy:</strong> The custom indicator will appear in the Indicators category 
                of the node palette. Drag it onto your canvas.
              </li>
              <li className="pl-2">
                <strong>Configure Parameters:</strong> Set the input parameters (period, source, etc.) in the 
                properties panel.
              </li>
              <li className="pl-2">
                <strong>Select Buffer:</strong> Choose which output buffer to read from.
              </li>
              <li className="pl-2">
                <strong>Set Shift:</strong> Specify which candle to read (0 = current, 1 = previous, etc.).
              </li>
              <li className="pl-2">
                <strong>Connect and Use:</strong> Connect the indicator output to conditions or other nodes.
              </li>
            </ol>

            <div className="bg-accent/10 rounded-lg p-4 mt-4">
              <h4 className="font-semibold mb-2">Key Information Needed:</h4>
              <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                <li>Indicator file name (must match exactly, without .mq4/.mq5 extension)</li>
                <li>Input parameters (count, order, and types must be correct)</li>
                <li>Output buffers (number and purpose of each buffer)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-bullish flex-shrink-0" />
                <span>Always test custom indicators on a demo account first</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-bullish flex-shrink-0" />
                <span>Verify buffer contents before using in live strategies</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-bullish flex-shrink-0" />
                <span>Document your custom indicators with clear descriptions</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-bullish flex-shrink-0" />
                <span>Keep indicator file names consistent across installations</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-bullish flex-shrink-0" />
                <span>Be aware of EMPTY_VALUE in conditional logic</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-bullish flex-shrink-0" />
                <span>For arrow indicators, start with Candle Shift = 1</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
