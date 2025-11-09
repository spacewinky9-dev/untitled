export type CustomIndicatorDataType = 'int' | 'double' | 'bool' | 'string' | 'datetime' | 'color' | 'enum'

export interface CustomIndicatorInputParameter {
  name: string
  displayName: string
  dataType: CustomIndicatorDataType
  defaultValue: any
  min?: number
  max?: number
  step?: number
  options?: Array<{ label: string; value: any }>
  description?: string
}

export interface CustomIndicatorOutputBuffer {
  index: number
  name: string
  description?: string
}

export interface CustomIndicator {
  id: string
  name: string
  fileName: string
  description: string
  category: 'trend' | 'momentum' | 'volatility' | 'volume' | 'custom'
  createdAt: Date
  updatedAt: Date
  
  inputParameters: CustomIndicatorInputParameter[]
  outputBuffers: CustomIndicatorOutputBuffer[]
  
  sourceCode?: string
  isBuiltIn: boolean
  
  metadata?: {
    author?: string
    version?: string
    website?: string
    notes?: string
  }
}

export interface CustomIndicatorUsage {
  indicatorId: string
  parameters: Record<string, any>
  outputBuffer: number
  shift: number
}

export interface ParsedIndicatorInfo {
  name: string
  inputParameters: CustomIndicatorInputParameter[]
  outputBuffers: CustomIndicatorOutputBuffer[]
  bufferCount: number
}
