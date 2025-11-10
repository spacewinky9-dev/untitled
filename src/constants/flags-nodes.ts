import { NodeDefinition } from '../types/node-types'

export const FLAGS_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'flag_set',
    type: 'action',
    category: 'state',
    label: 'Set Flag',
    description: 'Set boolean flag to true or false',
    icon: 'Flag',
    color: '#98D98E',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'flag_name', label: 'Flag Name', type: 'string' },
      { id: 'value', label: 'Value', type: 'boolean' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' }
    ],
    defaultParams: {
      flag_name: 'my_flag',
      value: true
    }
  },
  {
    id: 'flag_get',
    type: 'getter',
    category: 'state',
    label: 'Get Flag',
    description: 'Read current flag state',
    icon: 'FlagBanner',
    color: '#98D98E',
    inputs: [
      { id: 'flag_name', label: 'Flag Name', type: 'string' }
    ],
    outputs: [
      { id: 'value', label: 'Value', type: 'boolean' },
      { id: 'exists', label: 'Exists', type: 'boolean' }
    ],
    defaultParams: {
      flag_name: 'my_flag'
    }
  },
  {
    id: 'flag_toggle',
    type: 'action',
    category: 'state',
    label: 'Toggle Flag',
    description: 'Flip flag state (true → false, false → true)',
    icon: 'ArrowsCounterClockwise',
    color: '#98D98E',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'flag_name', label: 'Flag Name', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'new_value', label: 'New Value', type: 'boolean' }
    ],
    defaultParams: {
      flag_name: 'my_flag'
    }
  },
  {
    id: 'flag_reset_all',
    type: 'action',
    category: 'state',
    label: 'Reset All Flags',
    description: 'Clear all flags to false',
    icon: 'ArrowClockwise',
    color: '#98D98E',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'count_reset', label: 'Count Reset', type: 'number' }
    ],
    defaultParams: {}
  }
]
