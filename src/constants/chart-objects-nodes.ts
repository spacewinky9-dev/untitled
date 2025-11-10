import { NodeDefinition } from '../types/node-types'

export const CHART_OBJECTS_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'draw_horizontal_line',
    type: 'action',
    category: 'chart',
    label: 'Draw Horizontal Line',
    description: 'Draw horizontal line at specified price level',
    icon: 'Minus',
    color: '#FF8C69',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'price', label: 'Price', type: 'number' },
      { id: 'label', label: 'Label', type: 'string' },
      { id: 'color', label: 'Color', type: 'string' },
      { id: 'width', label: 'Width', type: 'number' },
      { id: 'style', label: 'Style', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'object_id', label: 'Object ID', type: 'string' }
    ],
    defaultParams: {
      price: 0,
      label: 'H-Line',
      color: 'Blue',
      width: 1,
      style: 'solid'
    }
  },
  {
    id: 'draw_vertical_line',
    type: 'action',
    category: 'chart',
    label: 'Draw Vertical Line',
    description: 'Draw vertical line at specified time',
    icon: 'ArrowsVertical',
    color: '#FF8C69',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'time', label: 'Time', type: 'number' },
      { id: 'label', label: 'Label', type: 'string' },
      { id: 'color', label: 'Color', type: 'string' },
      { id: 'width', label: 'Width', type: 'number' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'object_id', label: 'Object ID', type: 'string' }
    ],
    defaultParams: {
      time: 0,
      label: 'V-Line',
      color: 'Red',
      width: 1
    }
  },
  {
    id: 'draw_trend_line',
    type: 'action',
    category: 'chart',
    label: 'Draw Trend Line',
    description: 'Draw trend line between two points',
    icon: 'TrendUp',
    color: '#FF8C69',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'time1', label: 'Time 1', type: 'number' },
      { id: 'price1', label: 'Price 1', type: 'number' },
      { id: 'time2', label: 'Time 2', type: 'number' },
      { id: 'price2', label: 'Price 2', type: 'number' },
      { id: 'label', label: 'Label', type: 'string' },
      { id: 'color', label: 'Color', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'object_id', label: 'Object ID', type: 'string' }
    ],
    defaultParams: {
      label: 'Trend',
      color: 'Green'
    }
  },
  {
    id: 'draw_rectangle',
    type: 'action',
    category: 'chart',
    label: 'Draw Rectangle',
    description: 'Draw rectangular zone on chart',
    icon: 'Rectangle',
    color: '#FF8C69',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'time1', label: 'Time 1', type: 'number' },
      { id: 'price1', label: 'Price 1', type: 'number' },
      { id: 'time2', label: 'Time 2', type: 'number' },
      { id: 'price2', label: 'Price 2', type: 'number' },
      { id: 'label', label: 'Label', type: 'string' },
      { id: 'fill_color', label: 'Fill Color', type: 'string' },
      { id: 'border_color', label: 'Border Color', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'object_id', label: 'Object ID', type: 'string' }
    ],
    defaultParams: {
      label: 'Zone',
      fill_color: 'LightBlue',
      border_color: 'Blue'
    }
  },
  {
    id: 'draw_text',
    type: 'action',
    category: 'chart',
    label: 'Draw Text',
    description: 'Add text label on chart',
    icon: 'TextT',
    color: '#FF8C69',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'time', label: 'Time', type: 'number' },
      { id: 'price', label: 'Price', type: 'number' },
      { id: 'text', label: 'Text', type: 'string' },
      { id: 'font_size', label: 'Font Size', type: 'number' },
      { id: 'color', label: 'Color', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'object_id', label: 'Object ID', type: 'string' }
    ],
    defaultParams: {
      text: 'Label',
      font_size: 12,
      color: 'Black'
    }
  },
  {
    id: 'draw_arrow',
    type: 'action',
    category: 'chart',
    label: 'Draw Arrow',
    description: 'Add arrow indicator on chart',
    icon: 'ArrowUp',
    color: '#FF8C69',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'time', label: 'Time', type: 'number' },
      { id: 'price', label: 'Price', type: 'number' },
      { id: 'direction', label: 'Direction', type: 'string' },
      { id: 'color', label: 'Color', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'object_id', label: 'Object ID', type: 'string' }
    ],
    defaultParams: {
      direction: 'up',
      color: 'Green'
    }
  },
  {
    id: 'delete_chart_object',
    type: 'action',
    category: 'chart',
    label: 'Delete Chart Object',
    description: 'Remove specific chart object by ID',
    icon: 'Trash',
    color: '#FF8C69',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'object_id', label: 'Object ID', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'deleted', label: 'Deleted', type: 'boolean' }
    ],
    defaultParams: {}
  },
  {
    id: 'delete_all_chart_objects',
    type: 'action',
    category: 'chart',
    label: 'Delete All Chart Objects',
    description: 'Clear all drawings from chart',
    icon: 'TrashSimple',
    color: '#FF8C69',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'object_type', label: 'Object Type', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'count_deleted', label: 'Count Deleted', type: 'number' }
    ],
    defaultParams: {
      object_type: 'all'
    }
  }
]
