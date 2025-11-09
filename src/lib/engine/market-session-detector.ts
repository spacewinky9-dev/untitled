/**
 * Market Session Detection
 * Identifies current trading session (Asian, European, US)
 */

export type TradingSession = 'asian' | 'european' | 'us' | 'overlap' | 'off_hours'

export interface SessionTimes {
  asian: { start: number; end: number }    // Tokyo: 00:00-09:00 UTC
  european: { start: number; end: number }  // London: 08:00-17:00 UTC
  us: { start: number; end: number }        // New York: 13:00-22:00 UTC
}

/**
 * Default session times in UTC hours
 */
const DEFAULT_SESSION_TIMES: SessionTimes = {
  asian: { start: 0, end: 9 },
  european: { start: 8, end: 17 },
  us: { start: 13, end: 22 }
}

/**
 * Detect current trading session
 */
export function detectSession(timestamp: number, customTimes?: SessionTimes): TradingSession {
  const date = new Date(timestamp)
  const utcHour = date.getUTCHours()
  const times = customTimes || DEFAULT_SESSION_TIMES

  const inAsian = utcHour >= times.asian.start && utcHour < times.asian.end
  const inEuropean = utcHour >= times.european.start && utcHour < times.european.end
  const inUS = utcHour >= times.us.start && utcHour < times.us.end

  // Check for overlaps
  if ((inAsian && inEuropean) || (inEuropean && inUS)) {
    return 'overlap'
  }

  if (inAsian) return 'asian'
  if (inEuropean) return 'european'
  if (inUS) return 'us'

  return 'off_hours'
}

/**
 * Check if trading should be allowed in current session
 */
export function isSessionActive(
  timestamp: number,
  allowedSessions: TradingSession[],
  customTimes?: SessionTimes
): boolean {
  const currentSession = detectSession(timestamp, customTimes)
  return allowedSessions.includes(currentSession)
}

/**
 * Get session volatility characteristics
 */
export function getSessionCharacteristics(session: TradingSession): {
  avgVolatility: 'low' | 'medium' | 'high'
  avgSpread: 'tight' | 'normal' | 'wide'
  avgLiquidity: 'low' | 'medium' | 'high'
} {
  switch (session) {
    case 'asian':
      return { avgVolatility: 'low', avgSpread: 'wide', avgLiquidity: 'low' }
    case 'european':
      return { avgVolatility: 'high', avgSpread: 'tight', avgLiquidity: 'high' }
    case 'us':
      return { avgVolatility: 'high', avgSpread: 'tight', avgLiquidity: 'high' }
    case 'overlap':
      return { avgVolatility: 'high', avgSpread: 'tight', avgLiquidity: 'high' }
    case 'off_hours':
      return { avgVolatility: 'low', avgSpread: 'wide', avgLiquidity: 'low' }
  }
}

/**
 * Calculate time until next session
 */
export function timeUntilNextSession(
  timestamp: number,
  targetSession: TradingSession,
  customTimes?: SessionTimes
): number {
  const times = customTimes || DEFAULT_SESSION_TIMES
  const date = new Date(timestamp)
  const utcHour = date.getUTCHours()

  let targetHour: number
  switch (targetSession) {
    case 'asian':
      targetHour = times.asian.start
      break
    case 'european':
      targetHour = times.european.start
      break
    case 'us':
      targetHour = times.us.start
      break
    default:
      return 0
  }

  // Calculate hours until target
  let hoursUntil = targetHour - utcHour
  if (hoursUntil < 0) {
    hoursUntil += 24 // Next day
  }

  return hoursUntil * 60 * 60 * 1000 // Convert to milliseconds
}

/**
 * Market session manager for strategy execution
 */
export class MarketSessionManager {
  private customTimes?: SessionTimes

  constructor(customTimes?: SessionTimes) {
    this.customTimes = customTimes
  }

  getCurrentSession(timestamp: number): TradingSession {
    return detectSession(timestamp, this.customTimes)
  }

  canTrade(timestamp: number, allowedSessions: TradingSession[]): boolean {
    return isSessionActive(timestamp, allowedSessions, this.customTimes)
  }

  getSessionInfo(timestamp: number) {
    const session = this.getCurrentSession(timestamp)
    const characteristics = getSessionCharacteristics(session)
    return {
      session,
      ...characteristics,
      isActive: session !== 'off_hours'
    }
  }

  isOverlapPeriod(timestamp: number): boolean {
    return this.getCurrentSession(timestamp) === 'overlap'
  }

  getNextSession(timestamp: number, targetSession: TradingSession): number {
    return timeUntilNextSession(timestamp, targetSession, this.customTimes)
  }
}

/**
 * Session-based filter for strategy
 */
export function applySessionFilter(
  timestamp: number,
  allowedSessions: TradingSession[],
  customTimes?: SessionTimes
): boolean {
  return isSessionActive(timestamp, allowedSessions, customTimes)
}
