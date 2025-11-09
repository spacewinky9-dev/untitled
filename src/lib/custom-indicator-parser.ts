import { ParsedIndicatorInfo, CustomIndicatorDataType, CustomIndicatorInputParameter, CustomIndicatorOutputBuffer } from '@/types/custom-indicator'

export class CustomIndicatorParser {
  
  static parseFromSourceCode(sourceCode: string, fileName: string): ParsedIndicatorInfo {
    const name = fileName.replace(/\.(mq4|mq5)$/i, '')
    const inputParameters = this.extractInputParameters(sourceCode)
    const outputBuffers = this.extractOutputBuffers(sourceCode)
    
    return {
      name,
      inputParameters,
      outputBuffers,
      bufferCount: outputBuffers.length
    }
  }
  
  private static extractInputParameters(sourceCode: string): CustomIndicatorInputParameter[] {
    const parameters: CustomIndicatorInputParameter[] = []
    
    const inputRegex = /input\s+(\w+)\s+(\w+)\s*=\s*([^;]+);(?:\s*\/\/\s*(.+))?/g
    
    let match
    while ((match = inputRegex.exec(sourceCode)) !== null) {
      const [, dataType, name, defaultValueStr, comment] = match
      
      const parameter: CustomIndicatorInputParameter = {
        name,
        displayName: comment?.trim() || this.formatDisplayName(name),
        dataType: this.mapDataType(dataType),
        defaultValue: this.parseDefaultValue(defaultValueStr.trim(), dataType),
        description: comment?.trim()
      }
      
      if (dataType === 'int' || dataType === 'double') {
        parameter.min = 1
        parameter.max = dataType === 'int' ? 1000 : 10000
        parameter.step = dataType === 'int' ? 1 : 0.1
      }
      
      if (dataType.startsWith('ENUM_')) {
        parameter.options = this.extractEnumOptions(sourceCode, dataType)
      }
      
      parameters.push(parameter)
    }
    
    return parameters
  }
  
  private static extractOutputBuffers(sourceCode: string): CustomIndicatorOutputBuffer[] {
    const buffers: CustomIndicatorOutputBuffer[] = []
    
    const bufferCountMatch = sourceCode.match(/#property\s+indicator_buffers\s+(\d+)/)
    const plotCountMatch = sourceCode.match(/#property\s+indicator_plots\s+(\d+)/)
    
    const bufferCount = bufferCountMatch ? parseInt(bufferCountMatch[1]) : 1
    const plotCount = plotCountMatch ? parseInt(plotCountMatch[1]) : bufferCount
    
    const labelRegex = /#property\s+indicator_label(\d+)\s+"([^"]+)"/g
    const labels: Record<number, string> = {}
    
    let match
    while ((match = labelRegex.exec(sourceCode)) !== null) {
      const [, index, label] = match
      labels[parseInt(index)] = label
    }
    
    for (let i = 0; i < Math.max(bufferCount, plotCount); i++) {
      buffers.push({
        index: i,
        name: labels[i + 1] || `Buffer ${i}`,
        description: `Output buffer ${i}`
      })
    }
    
    if (buffers.length === 0) {
      buffers.push({
        index: 0,
        name: 'Value',
        description: 'Main output value'
      })
    }
    
    return buffers
  }
  
  private static mapDataType(mqlType: string): CustomIndicatorDataType {
    const typeMap: Record<string, CustomIndicatorDataType> = {
      'int': 'int',
      'double': 'double',
      'bool': 'bool',
      'string': 'string',
      'datetime': 'datetime',
      'color': 'color'
    }
    
    if (mqlType.startsWith('ENUM_')) {
      return 'enum'
    }
    
    return typeMap[mqlType.toLowerCase()] || 'int'
  }
  
  private static parseDefaultValue(valueStr: string, dataType: string): any {
    valueStr = valueStr.trim()
    
    if (dataType === 'bool') {
      return valueStr.toLowerCase() === 'true'
    }
    
    if (dataType === 'int' || dataType === 'double') {
      return parseFloat(valueStr)
    }
    
    if (dataType === 'string') {
      return valueStr.replace(/^"(.*)"$/, '$1')
    }
    
    if (dataType === 'color') {
      return valueStr.replace(/^clr/, '')
    }
    
    return valueStr
  }
  
  private static extractEnumOptions(sourceCode: string, enumType: string): Array<{ label: string; value: any }> {
    const commonEnums: Record<string, Array<{ label: string; value: string }>> = {
      'ENUM_MA_METHOD': [
        { label: 'Simple', value: 'MODE_SMA' },
        { label: 'Exponential', value: 'MODE_EMA' },
        { label: 'Smoothed', value: 'MODE_SMMA' },
        { label: 'Linear Weighted', value: 'MODE_LWMA' }
      ],
      'ENUM_APPLIED_PRICE': [
        { label: 'Close', value: 'PRICE_CLOSE' },
        { label: 'Open', value: 'PRICE_OPEN' },
        { label: 'High', value: 'PRICE_HIGH' },
        { label: 'Low', value: 'PRICE_LOW' },
        { label: 'Median (HL/2)', value: 'PRICE_MEDIAN' },
        { label: 'Typical (HLC/3)', value: 'PRICE_TYPICAL' },
        { label: 'Weighted (HLCC/4)', value: 'PRICE_WEIGHTED' }
      ],
      'ENUM_TIMEFRAMES': [
        { label: 'M1', value: 'PERIOD_M1' },
        { label: 'M5', value: 'PERIOD_M5' },
        { label: 'M15', value: 'PERIOD_M15' },
        { label: 'M30', value: 'PERIOD_M30' },
        { label: 'H1', value: 'PERIOD_H1' },
        { label: 'H4', value: 'PERIOD_H4' },
        { label: 'D1', value: 'PERIOD_D1' },
        { label: 'W1', value: 'PERIOD_W1' },
        { label: 'MN1', value: 'PERIOD_MN1' }
      ]
    }
    
    if (commonEnums[enumType]) {
      return commonEnums[enumType]
    }
    
    return [{ label: 'Default', value: 0 }]
  }
  
  private static formatDisplayName(variableName: string): string {
    return variableName
      .replace(/^Inp/, '')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^\w/, c => c.toUpperCase())
  }
  
  static validateIndicatorName(name: string): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Indicator name cannot be empty' }
    }
    
    if (name.length > 100) {
      return { valid: false, error: 'Indicator name too long (max 100 characters)' }
    }
    
    if (!/^[a-zA-Z0-9_\s\-]+$/.test(name)) {
      return { valid: false, error: 'Indicator name contains invalid characters' }
    }
    
    return { valid: true }
  }
}
