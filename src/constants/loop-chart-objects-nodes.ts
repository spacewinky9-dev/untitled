import { NodeDefinition } from '../types/node-types'

export const LOOP_CHART_OBJECTS_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'loop_all_chart_objects',
    type: 'loop',
    category: 'loop',
    label: 'Loop Through All Objects',
    description: 'Iterate through all chart objects',
    icon: 'ArrowsClockwise',
    color: '#FF9955',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' }
    ],
    outputs: [
      { id: 'each', label: 'Each', type: 'flow' },
      { id: 'complete', label: 'Complete', type: 'flow' },
      { id: 'object', label: 'Object', type: 'object' },
      { id: 'index', label: 'Index', type: 'number' }
    ],
    defaultParams: {}
  },
  {
    id: 'loop_chart_lines',
    type: 'loop',
    category: 'loop',
    label: 'Loop Through Lines',
    description: 'Iterate through horizontal, vertical, and trend lines',
    icon: 'LineSegment',
    color: '#FF9955',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'line_type', label: 'Line Type', type: 'string' }
    ],
    outputs: [
      { id: 'each', label: 'Each', type: 'flow' },
      { id: 'complete', label: 'Complete', type: 'flow' },
      { id: 'line', label: 'Line', type: 'object' },
      { id: 'index', label: 'Index', type: 'number' }
    ],
    defaultParams: {
      line_type: 'all'
    }
  },
  {
    id: 'loop_chart_shapes',
    type: 'loop',
    category: 'loop',
    label: 'Loop Through Shapes',
    description: 'Iterate through rectangles, arrows, and text objects',
    icon: 'Shapes',
    color: '#FF9955',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'shape_type', label: 'Shape Type', type: 'string' }
    ],
    outputs: [
      { id: 'each', label: 'Each', type: 'flow' },
      { id: 'complete', label: 'Complete', type: 'flow' },
      { id: 'shape', label: 'Shape', type: 'object' },
      { id: 'index', label: 'Index', type: 'number' }
    ],
    defaultParams: {
      shape_type: 'all'
    }
  }
]
