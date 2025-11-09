/**
 * Time Filter Execution Logic
 * Handles execution of time-based filter nodes
 */

/**
 * Execute time filter
 */
export function executeTimeFilter(
  timestamp: number,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number
): boolean {
  const date = new Date(timestamp)
  const currentHour = date.getHours()
  const currentMinute = date.getMinutes()

  const currentTimeMinutes = currentHour * 60 + currentMinute
  const startTimeMinutes = startHour * 60 + startMinute
  const endTimeMinutes = endHour * 60 + endMinute

  if (startTimeMinutes <= endTimeMinutes) {
    return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes
  } else {
    // Overnight range (e.g., 22:00 to 02:00)
    return currentTimeMinutes >= startTimeMinutes || currentTimeMinutes <= endTimeMinutes
  }
}

/**
 * Execute months filter
 */
export function executeMonthsFilter(
  timestamp: number,
  allowedMonths: number[]
): boolean {
  const date = new Date(timestamp)
  const month = date.getMonth() + 1 // 1-12
  return allowedMonths.includes(month)
}

/**
 * Execute weekday filter
 */
export function executeWeekdayFilter(
  timestamp: number,
  allowedWeekdays: number[]
): boolean {
  const date = new Date(timestamp)
  const weekday = date.getDay() // 0=Sunday, 6=Saturday
  // Convert: 0=Sunday -> 7, 1=Monday -> 1
  const normalizedWeekday = weekday === 0 ? 7 : weekday
  return allowedWeekdays.includes(normalizedWeekday)
}

/**
 * Execute hours filter
 */
export function executeHoursFilter(
  timestamp: number,
  allowedHours: number[]
): boolean {
  const date = new Date(timestamp)
  const hour = date.getHours()
  return allowedHours.includes(hour)
}

/**
 * Execute minutes filter
 */
export function executeMinutesFilter(
  timestamp: number,
  allowedMinutes: number[]
): boolean {
  const date = new Date(timestamp)
  const minute = date.getMinutes()
  return allowedMinutes.includes(minute)
}

/**
 * Execute seconds filter
 */
export function executeSecondsFilter(
  timestamp: number,
  allowedSeconds: number[]
): boolean {
  const date = new Date(timestamp)
  const second = date.getSeconds()
  return allowedSeconds.includes(second)
}

/**
 * Execute once per bar
 */
export function executeOncePerBar(
  lastBarTime: number,
  currentBarTime: number
): boolean {
  return lastBarTime !== currentBarTime
}

/**
 * Execute once a day
 */
export function executeOnceADay(
  timestamp: number,
  hour: number,
  minute: number,
  lastExecutionTime: number
): boolean {
  const date = new Date(timestamp)
  const currentDay = date.getDate()
  const currentHour = date.getHours()
  const currentMinute = date.getMinutes()

  const lastDate = new Date(lastExecutionTime)
  const lastDay = lastDate.getDate()

  // Check if it's a new day and target time is reached
  const isNewDay = currentDay !== lastDay
  const isTargetTime = currentHour === hour && currentMinute === minute

  return isNewDay && isTargetTime
}

/**
 * Execute once an hour
 */
export function executeOnceAnHour(
  timestamp: number,
  targetMinute: number,
  lastExecutionTime: number
): boolean {
  const date = new Date(timestamp)
  const currentHour = date.getHours()
  const currentMinute = date.getMinutes()

  const lastDate = new Date(lastExecutionTime)
  const lastHour = lastDate.getHours()

  // Check if it's a new hour and target minute is reached
  const isNewHour = currentHour !== lastHour
  const isTargetMinute = currentMinute === targetMinute

  return isNewHour && isTargetMinute
}

/**
 * Execute once per N minutes
 */
export function executeOncePerMinutes(
  timestamp: number,
  minutesInterval: number,
  lastExecutionTime: number
): boolean {
  const elapsedMinutes = (timestamp - lastExecutionTime) / (60 * 1000)
  return elapsedMinutes >= minutesInterval
}

/**
 * Execute once per N seconds
 */
export function executeOncePerSeconds(
  timestamp: number,
  secondsInterval: number,
  lastExecutionTime: number
): boolean {
  const elapsedSeconds = (timestamp - lastExecutionTime) / 1000
  return elapsedSeconds >= secondsInterval
}

/**
 * Execute once per N trades
 */
export function executeOncePerTrades(
  totalTrades: number,
  tradesInterval: number,
  lastExecutionTrades: number
): boolean {
  const tradesSinceLastExecution = totalTrades - lastExecutionTrades
  return tradesSinceLastExecution >= tradesInterval
}

/**
 * Execute every N ticks
 */
export function executeEveryNTicks(
  tickCount: number,
  tickInterval: number
): boolean {
  return tickCount % tickInterval === 0
}

/**
 * Execute every N bars
 */
export function executeEveryNBars(
  barCount: number,
  barInterval: number
): boolean {
  return barCount % barInterval === 0
}

/**
 * Execute spread filter
 */
export function executeSpreadFilter(
  bid: number,
  ask: number,
  maxSpreadPips: number,
  pipValue: number = 0.0001
): boolean {
  const spreadPips = (ask - bid) / pipValue
  return spreadPips <= maxSpreadPips
}

/**
 * Main handler for time filter nodes
 */
export function executeTimeFilterNode(
  nodeId: string,
  nodeData: any,
  context: {
    timestamp: number
    lastExecutionTime?: number
    lastBarTime?: number
    currentBarTime?: number
    tickCount?: number
    barCount?: number
    totalTrades?: number
    lastExecutionTrades?: number
    bid?: number
    ask?: number
  }
): boolean {
  const params = nodeData.parameters || {}

  if (nodeId.includes('time_filter')) {
    return executeTimeFilter(
      context.timestamp,
      params.startHour || 0,
      params.startMinute || 0,
      params.endHour || 23,
      params.endMinute || 59
    )
  }

  if (nodeId.includes('months_filter')) {
    return executeMonthsFilter(
      context.timestamp,
      params.months || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    )
  }

  if (nodeId.includes('weekday_filter')) {
    return executeWeekdayFilter(
      context.timestamp,
      params.weekdays || [1, 2, 3, 4, 5]
    )
  }

  if (nodeId.includes('hours_filter')) {
    return executeHoursFilter(
      context.timestamp,
      params.hours || []
    )
  }

  if (nodeId.includes('minutes_filter')) {
    return executeMinutesFilter(
      context.timestamp,
      params.minutes || []
    )
  }

  if (nodeId.includes('seconds_filter')) {
    return executeSecondsFilter(
      context.timestamp,
      params.seconds || [0]
    )
  }

  if (nodeId.includes('once_per_bar')) {
    return executeOncePerBar(
      context.lastBarTime || 0,
      context.currentBarTime || 0
    )
  }

  if (nodeId.includes('once_a_day')) {
    return executeOnceADay(
      context.timestamp,
      params.hour || 0,
      params.minute || 0,
      context.lastExecutionTime || 0
    )
  }

  if (nodeId.includes('once_an_hour')) {
    return executeOnceAnHour(
      context.timestamp,
      params.minute || 0,
      context.lastExecutionTime || 0
    )
  }

  if (nodeId.includes('once_per_minutes')) {
    return executeOncePerMinutes(
      context.timestamp,
      params.minutes || 5,
      context.lastExecutionTime || 0
    )
  }

  if (nodeId.includes('once_per_seconds')) {
    return executeOncePerSeconds(
      context.timestamp,
      params.seconds || 10,
      context.lastExecutionTime || 0
    )
  }

  if (nodeId.includes('once_per_trades')) {
    return executeOncePerTrades(
      context.totalTrades || 0,
      params.tradesCount || 10,
      context.lastExecutionTrades || 0
    )
  }

  if (nodeId.includes('every_n_ticks')) {
    return executeEveryNTicks(
      context.tickCount || 0,
      params.tickCount || 10
    )
  }

  if (nodeId.includes('every_n_bars')) {
    return executeEveryNBars(
      context.barCount || 0,
      params.barCount || 5
    )
  }

  if (nodeId.includes('spread_filter')) {
    return executeSpreadFilter(
      context.bid || 0,
      context.ask || 0,
      params.maxSpreadPips || 3
    )
  }

  // Default: once per tick (always true)
  if (nodeId.includes('once_per_tick')) {
    return true
  }

  return false
}
