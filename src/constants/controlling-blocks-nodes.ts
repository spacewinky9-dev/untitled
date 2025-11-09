import { NodeDefinition } from '../types/node-types'

export const CONTROLLING_BLOCKS_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'if_else',
    type: 'control',
    category: 'control',
    label: 'If / Else',
    description: 'Conditional branching based on condition',
    icon: 'GitBranch',
    color: '#E6D5B8',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'condition', label: 'Condition', type: 'boolean' }
    ],
    outputs: [
      { id: 'true', label: 'True', type: 'flow' },
      { id: 'false', label: 'False', type: 'flow' }
    ],
    defaultParams: {}
  },
  {
    id: 'while_loop',
    type: 'control',
    category: 'control',
    label: 'While Loop',
    description: 'Loop while condition is true',
    icon: 'ArrowsClockwise',
    color: '#E6D5B8',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'condition', label: 'Condition', type: 'boolean' },
      { id: 'max_iterations', label: 'Max Iterations', type: 'number' }
    ],
    outputs: [
      { id: 'loop_body', label: 'Loop Body', type: 'flow' },
      { id: 'complete', label: 'Complete', type: 'flow' },
      { id: 'iteration', label: 'Iteration', type: 'number' }
    ],
    defaultParams: {
      max_iterations: 1000
    }
  },
  {
    id: 'for_loop',
    type: 'control',
    category: 'control',
    label: 'For Loop',
    description: 'Count-based loop iteration',
    icon: 'ListNumbers',
    color: '#E6D5B8',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'start', label: 'Start', type: 'number' },
      { id: 'end', label: 'End', type: 'number' },
      { id: 'step', label: 'Step', type: 'number' }
    ],
    outputs: [
      { id: 'loop_body', label: 'Loop Body', type: 'flow' },
      { id: 'complete', label: 'Complete', type: 'flow' },
      { id: 'index', label: 'Index', type: 'number' }
    ],
    defaultParams: {
      start: 0,
      end: 10,
      step: 1
    }
  },
  {
    id: 'break',
    type: 'control',
    category: 'control',
    label: 'Break',
    description: 'Exit loop early',
    icon: 'Stop',
    color: '#E6D5B8',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' }
    ],
    outputs: [
      { id: 'exit', label: 'Exit', type: 'flow' }
    ],
    defaultParams: {}
  },
  {
    id: 'continue',
    type: 'control',
    category: 'control',
    label: 'Continue',
    description: 'Skip to next loop iteration',
    icon: 'FastForward',
    color: '#E6D5B8',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' }
    ],
    outputs: [
      { id: 'next', label: 'Next', type: 'flow' }
    ],
    defaultParams: {}
  },
  {
    id: 'wait',
    type: 'control',
    category: 'control',
    label: 'Wait',
    description: 'Pause execution for specified duration',
    icon: 'Clock',
    color: '#E6D5B8',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'duration', label: 'Duration', type: 'number' },
      { id: 'unit', label: 'Unit', type: 'string' }
    ],
    outputs: [
      { id: 'continue', label: 'Continue', type: 'flow' }
    ],
    defaultParams: {
      duration: 1,
      unit: 'seconds'
    }
  }
]
