/**
 * Time Filter Node Definitions
 * Time-based filtering nodes for strategy execution control
 * Based on FxDreema block system design
 */

import { NodeDefinition } from './node-categories'

/**
 * Time filter nodes for controlling when strategies execute
 * Includes date, time, frequency, and spread filters
 */
export const TIME_FILTER_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'time_filter',
    type: 'condition',
    category: 'condition',
    label: 'Time Filter',
    description: 'Filter by specific time range',
    icon: 'Clock',
    defaultParameters: {
      startHour: 0,
      startMinute: 0,
      endHour: 23,
      endMinute: 59
    },
    outputs: [
      { id: 'true', label: 'True', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'months_filter',
    type: 'condition',
    category: 'condition',
    label: 'Months Filter',
    description: 'Filter by specific months',
    icon: 'CalendarBlank',
    defaultParameters: {
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    outputs: [
      { id: 'true', label: 'True', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'weekday_filter',
    type: 'condition',
    category: 'condition',
    label: 'Weekday Filter',
    description: 'Filter by specific days of week',
    icon: 'CalendarDots',
    defaultParameters: {
      weekdays: [1, 2, 3, 4, 5] // Monday-Friday
    },
    outputs: [
      { id: 'true', label: 'True', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'hours_filter',
    type: 'condition',
    category: 'condition',
    label: 'Hours Filter',
    description: 'Filter by specific hours of day',
    icon: 'ClockCounterClockwise',
    defaultParameters: {
      hours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17] // Trading hours
    },
    outputs: [
      { id: 'true', label: 'True', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'minutes_filter',
    type: 'condition',
    category: 'condition',
    label: 'Minutes Filter',
    description: 'Filter by specific minutes',
    icon: 'Timer',
    defaultParameters: {
      minutes: [0, 15, 30, 45]
    },
    outputs: [
      { id: 'true', label: 'True', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'seconds_filter',
    type: 'condition',
    category: 'condition',
    label: 'Seconds Filter',
    description: 'Filter by specific seconds',
    icon: 'Hourglass',
    defaultParameters: {
      seconds: [0]
    },
    outputs: [
      { id: 'true', label: 'True', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'once_per_tick',
    type: 'condition',
    category: 'condition',
    label: 'Once Per Tick',
    description: 'Execute only once per tick',
    icon: 'Pulse',
    defaultParameters: {},
    outputs: [
      { id: 'trigger', label: 'Trigger', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'once_per_bar',
    type: 'condition',
    category: 'condition',
    label: 'Once Per Bar',
    description: 'Execute only once per bar/candle',
    icon: 'ChartBar',
    defaultParameters: {},
    outputs: [
      { id: 'trigger', label: 'Trigger', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'once_a_day',
    type: 'condition',
    category: 'condition',
    label: 'Once A Day',
    description: 'Execute only once per day',
    icon: 'Sun',
    defaultParameters: {
      hour: 0,
      minute: 0
    },
    outputs: [
      { id: 'trigger', label: 'Trigger', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'once_an_hour',
    type: 'condition',
    category: 'condition',
    label: 'Once An Hour',
    description: 'Execute only once per hour',
    icon: 'ClockClockwise',
    defaultParameters: {
      minute: 0
    },
    outputs: [
      { id: 'trigger', label: 'Trigger', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'once_per_minutes',
    type: 'condition',
    category: 'condition',
    label: 'Once Per Minutes',
    description: 'Execute once per N minutes',
    icon: 'Clock',
    defaultParameters: {
      minutes: 5
    },
    outputs: [
      { id: 'trigger', label: 'Trigger', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'once_per_seconds',
    type: 'condition',
    category: 'condition',
    label: 'Once Per Seconds',
    description: 'Execute once per N seconds',
    icon: 'Timer',
    defaultParameters: {
      seconds: 10
    },
    outputs: [
      { id: 'trigger', label: 'Trigger', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'once_per_trades',
    type: 'condition',
    category: 'condition',
    label: 'Once Per Trades',
    description: 'Execute once after N trades',
    icon: 'ArrowsLeftRight',
    defaultParameters: {
      tradesCount: 10
    },
    outputs: [
      { id: 'trigger', label: 'Trigger', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'every_n_ticks',
    type: 'condition',
    category: 'condition',
    label: 'Every "n" Ticks',
    description: 'Execute every N ticks',
    icon: 'Activity',
    defaultParameters: {
      tickCount: 10
    },
    outputs: [
      { id: 'trigger', label: 'Trigger', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'every_n_bars',
    type: 'condition',
    category: 'condition',
    label: 'Every "n" Bars',
    description: 'Execute every N bars',
    icon: 'ChartBar',
    defaultParameters: {
      barCount: 5
    },
    outputs: [
      { id: 'trigger', label: 'Trigger', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'spread_filter',
    type: 'condition',
    category: 'condition',
    label: 'Spread Filter',
    description: 'Filter by maximum spread',
    icon: 'ArrowsOutLineHorizontal',
    defaultParameters: {
      maxSpreadPips: 3
    },
    outputs: [
      { id: 'true', label: 'True', type: 'output', dataType: 'boolean' }
    ]
  }
]
