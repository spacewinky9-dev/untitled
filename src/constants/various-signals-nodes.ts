import { NodeDefinition } from '../types/node-types'

export const VARIOUS_SIGNALS_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'signal_buy',
    type: 'signal',
    category: 'signal',
    label: 'Signal Buy',
    description: 'Generate buy signal',
    icon: 'TrendUp',
    color: '#FFD700',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'strength', label: 'Strength', type: 'number' }
    ],
    outputs: [
      { id: 'signal', label: 'Signal', type: 'flow' },
      { id: 'value', label: 'Value', type: 'number' }
    ],
    defaultParams: {
      strength: 1.0
    }
  },
  {
    id: 'signal_sell',
    type: 'signal',
    category: 'signal',
    label: 'Signal Sell',
    description: 'Generate sell signal',
    icon: 'TrendDown',
    color: '#FFD700',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'strength', label: 'Strength', type: 'number' }
    ],
    outputs: [
      { id: 'signal', label: 'Signal', type: 'flow' },
      { id: 'value', label: 'Value', type: 'number' }
    ],
    defaultParams: {
      strength: 1.0
    }
  },
  {
    id: 'signal_close',
    type: 'signal',
    category: 'signal',
    label: 'Signal Close',
    description: 'Generate close signal',
    icon: 'X',
    color: '#FFD700',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'strength', label: 'Strength', type: 'number' }
    ],
    outputs: [
      { id: 'signal', label: 'Signal', type: 'flow' },
      { id: 'value', label: 'Value', type: 'number' }
    ],
    defaultParams: {
      strength: 1.0
    }
  },
  {
    id: 'signal_neutral',
    type: 'signal',
    category: 'signal',
    label: 'Signal Neutral',
    description: 'Generate neutral signal (no action)',
    icon: 'Minus',
    color: '#FFD700',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' }
    ],
    outputs: [
      { id: 'signal', label: 'Signal', type: 'flow' },
      { id: 'value', label: 'Value', type: 'number' }
    ],
    defaultParams: {}
  },
  {
    id: 'signal_custom',
    type: 'signal',
    category: 'signal',
    label: 'Custom Signal',
    description: 'User-defined signal with custom label',
    icon: 'Star',
    color: '#FFD700',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'label', label: 'Label', type: 'string' },
      { id: 'strength', label: 'Strength', type: 'number' }
    ],
    outputs: [
      { id: 'signal', label: 'Signal', type: 'flow' },
      { id: 'value', label: 'Value', type: 'number' }
    ],
    defaultParams: {
      label: 'Custom',
      strength: 1.0
    }
  }
]
