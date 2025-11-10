import { NodeDefinition } from '../types/node-types'

export const COUNTERS_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'counter_increment',
    type: 'action',
    category: 'state',
    label: 'Increment Counter',
    description: 'Add 1 or N to counter value',
    icon: 'Plus',
    color: '#7BC8A4',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'counter_name', label: 'Counter Name', type: 'string' },
      { id: 'amount', label: 'Amount', type: 'number' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'new_value', label: 'New Value', type: 'number' }
    ],
    defaultParams: {
      counter_name: 'my_counter',
      amount: 1
    }
  },
  {
    id: 'counter_decrement',
    type: 'action',
    category: 'state',
    label: 'Decrement Counter',
    description: 'Subtract 1 or N from counter value',
    icon: 'Minus',
    color: '#7BC8A4',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'counter_name', label: 'Counter Name', type: 'string' },
      { id: 'amount', label: 'Amount', type: 'number' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'new_value', label: 'New Value', type: 'number' }
    ],
    defaultParams: {
      counter_name: 'my_counter',
      amount: 1
    }
  },
  {
    id: 'counter_reset',
    type: 'action',
    category: 'state',
    label: 'Reset Counter',
    description: 'Set counter to zero',
    icon: 'ArrowCounterClockwise',
    color: '#7BC8A4',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'counter_name', label: 'Counter Name', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' }
    ],
    defaultParams: {
      counter_name: 'my_counter'
    }
  },
  {
    id: 'counter_get',
    type: 'getter',
    category: 'state',
    label: 'Get Counter',
    description: 'Read current counter value',
    icon: 'HashStraight',
    color: '#7BC8A4',
    inputs: [
      { id: 'counter_name', label: 'Counter Name', type: 'string' }
    ],
    outputs: [
      { id: 'value', label: 'Value', type: 'number' },
      { id: 'exists', label: 'Exists', type: 'boolean' }
    ],
    defaultParams: {
      counter_name: 'my_counter'
    }
  },
  {
    id: 'counter_set',
    type: 'action',
    category: 'state',
    label: 'Set Counter',
    description: 'Set counter to specific value',
    icon: 'NumberSquareOne',
    color: '#7BC8A4',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'counter_name', label: 'Counter Name', type: 'string' },
      { id: 'value', label: 'Value', type: 'number' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' }
    ],
    defaultParams: {
      counter_name: 'my_counter',
      value: 0
    }
  },
  {
    id: 'counter_reaches',
    type: 'condition',
    category: 'condition',
    label: 'Counter Reaches',
    description: 'Check if counter equals or exceeds threshold',
    icon: 'Target',
    color: '#7BC8A4',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'counter_name', label: 'Counter Name', type: 'string' },
      { id: 'threshold', label: 'Threshold', type: 'number' },
      { id: 'operator', label: 'Operator', type: 'string' }
    ],
    outputs: [
      { id: 'true', label: 'True', type: 'flow' },
      { id: 'false', label: 'False', type: 'flow' },
      { id: 'value', label: 'Value', type: 'number' }
    ],
    defaultParams: {
      counter_name: 'my_counter',
      threshold: 10,
      operator: 'equal'
    }
  }
]
