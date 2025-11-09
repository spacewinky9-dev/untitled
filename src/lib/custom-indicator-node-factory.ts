import { NodeDefinition } from '@/constants/node-categories'
import { CustomIndicator } from '@/types/custom-indicator'

export function createCustomIndicatorNode(indicator: CustomIndicator): NodeDefinition {
  return {
    id: `custom_indicator_${indicator.id}`,
    type: 'custom_indicator',
    category: 'indicator',
    label: indicator.name,
    description: indicator.description || `Custom indicator: ${indicator.name}`,
    icon: 'ChartLine',
    defaultParameters: {
      customIndicatorId: indicator.id,
      fileName: indicator.fileName,
      ...indicator.inputParameters.reduce((acc, param) => ({
        ...acc,
        [param.name]: param.defaultValue
      }), {}),
      outputBuffer: 0,
      shift: 0
    },
    inputs: [],
    outputs: indicator.outputBuffers.map(buffer => ({
      id: `buffer_${buffer.index}`,
      label: buffer.name,
      type: 'output',
      dataType: 'number',
      description: buffer.description
    })),
    executionOrder: 1
  }
}

export function getCustomIndicatorParameters(indicator: CustomIndicator) {
  return [
    {
      key: 'shift',
      label: 'Candle Shift (Bar)',
      type: 'number' as const,
      default: 0,
      min: 0,
      max: 100,
      step: 1,
      description: 'Bar offset (0 = current, 1 = previous, etc.)'
    },
    {
      key: 'outputBuffer',
      label: 'Output Buffer',
      type: 'select' as const,
      default: 0,
      options: indicator.outputBuffers.map(buffer => ({
        label: `${buffer.index}: ${buffer.name}`,
        value: buffer.index
      })),
      description: 'Which buffer to read the value from'
    },
    ...indicator.inputParameters.map(param => {
      if (param.dataType === 'enum' && param.options) {
        return {
          key: param.name,
          label: param.displayName,
          type: 'select' as const,
          default: param.defaultValue,
          options: param.options,
          description: param.description
        }
      }
      
      if (param.dataType === 'bool') {
        return {
          key: param.name,
          label: param.displayName,
          type: 'boolean' as const,
          default: param.defaultValue,
          description: param.description
        }
      }
      
      return {
        key: param.name,
        label: param.displayName,
        type: 'number' as const,
        default: param.defaultValue,
        min: param.min,
        max: param.max,
        step: param.step,
        description: param.description
      }
    })
  ]
}
