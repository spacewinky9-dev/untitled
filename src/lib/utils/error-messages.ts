/**
 * User-friendly error messages for common trading platform errors
 * Provides clear, actionable guidance instead of technical jargon
 */

export interface ErrorContext {
  nodeType?: string
  sourceType?: string
  targetType?: string
  operation?: string
  value?: any
}

export const ErrorCategory = {
  CONNECTION: 'connection',
  VALIDATION: 'validation',
  EXECUTION: 'execution',
  DATA: 'data',
  CONFIGURATION: 'configuration',
} as const

export type ErrorCategoryType = typeof ErrorCategory[keyof typeof ErrorCategory]

export interface UserFriendlyError {
  title: string
  message: string
  suggestion: string
  category: ErrorCategoryType
}

/**
 * Get user-friendly error message for connection issues
 */
export function getConnectionError(sourceType: string, targetType: string): UserFriendlyError {
  const key = `${sourceType}-${targetType}`
  
  const connectionErrors: Record<string, UserFriendlyError> = {
    'indicator-action': {
      title: 'Invalid Connection',
      message: 'Indicators cannot connect directly to actions.',
      suggestion: 'Add a Condition node between the indicator and action to evaluate when the indicator value meets your criteria (e.g., RSI > 70).',
      category: ErrorCategory.CONNECTION,
    },
    'event-action': {
      title: 'Missing Logic',
      message: 'Event nodes should not connect directly to actions.',
      suggestion: 'Add indicators and conditions between the event and action to define when trades should be executed.',
      category: ErrorCategory.CONNECTION,
    },
    'action-indicator': {
      title: 'Incorrect Flow Direction',
      message: 'Actions cannot feed back into indicators.',
      suggestion: 'Trading flows should move forward: Events → Indicators → Conditions → Actions. Remove this backward connection.',
      category: ErrorCategory.CONNECTION,
    },
    'action-condition': {
      title: 'Incorrect Flow Direction',
      message: 'Actions cannot feed back into conditions.',
      suggestion: 'Actions are the final step in a strategy. Use variables if you need to track action results for future decisions.',
      category: ErrorCategory.CONNECTION,
    },
    'risk-condition': {
      title: 'Invalid Risk Management Flow',
      message: 'Risk management nodes should connect to actions, not conditions.',
      suggestion: 'Connect your risk management node (stop loss, take profit, position size) to the trading action node.',
      category: ErrorCategory.CONNECTION,
    },
  }
  
  return connectionErrors[key] || {
    title: 'Connection Not Allowed',
    message: `Cannot connect ${sourceType} to ${targetType}.`,
    suggestion: `Check the node palette to see which connections are valid for ${sourceType} nodes.`,
    category: ErrorCategory.CONNECTION,
  }
}

/**
 * Get user-friendly error message for circular dependencies
 */
export function getCircularDependencyError(cycle: string[]): UserFriendlyError {
  return {
    title: 'Circular Dependency Detected',
    message: `These nodes form a loop: ${cycle.join(' → ')}`,
    suggestion: 'Remove one of the connections in this loop. Trading strategies should flow in one direction: Event → Indicators → Conditions → Actions.',
    category: ErrorCategory.VALIDATION,
  }
}

/**
 * Get user-friendly error message for type mismatches
 */
export function getTypeMismatchError(sourceType: string, targetType: string): UserFriendlyError {
  const typeErrors: Record<string, UserFriendlyError> = {
    'number-boolean': {
      title: 'Data Type Mismatch',
      message: 'Cannot connect a numeric value to a boolean (true/false) input.',
      suggestion: 'Add a Condition node to convert the number to true/false (e.g., value > 0 becomes true).',
      category: ErrorCategory.DATA,
    },
    'boolean-number': {
      title: 'Data Type Mismatch',
      message: 'Cannot connect a boolean (true/false) value to a numeric input.',
      suggestion: 'Boolean values cannot be used in mathematical calculations. Consider restructuring your strategy.',
      category: ErrorCategory.DATA,
    },
    'string-number': {
      title: 'Data Type Mismatch',
      message: 'Cannot connect text data to a numeric input.',
      suggestion: 'Text values cannot be used in calculations or conditions. Verify your node connections.',
      category: ErrorCategory.DATA,
    },
    'string-boolean': {
      title: 'Data Type Mismatch',
      message: 'Cannot connect text data to a boolean (true/false) input.',
      suggestion: 'Text values cannot be directly evaluated as true/false. Consider using different node types.',
      category: ErrorCategory.DATA,
    },
  }
  
  const key = `${sourceType}-${targetType}`
  return typeErrors[key] || {
    title: 'Data Type Mismatch',
    message: `Cannot connect ${sourceType} data to ${targetType} input.`,
    suggestion: 'Verify that the data types of your connected nodes are compatible.',
    category: ErrorCategory.DATA,
  }
}

/**
 * Get user-friendly error message for validation errors
 */
export function getValidationError(errorType: string, context: ErrorContext = {}): UserFriendlyError {
  const validationErrors: Record<string, UserFriendlyError> = {
    'no-event': {
      title: 'Missing Event Node',
      message: 'Your strategy has no starting point.',
      suggestion: 'Add an OnTick event node to trigger your strategy on each price update, or add an OnInit event to run once at startup.',
      category: ErrorCategory.VALIDATION,
    },
    'no-action': {
      title: 'No Trading Actions',
      message: 'Your strategy has no buy, sell, or close actions.',
      suggestion: 'Add at least one Action node (Buy, Sell, or Close Position) to execute trades.',
      category: ErrorCategory.VALIDATION,
    },
    'disconnected-node': {
      title: 'Disconnected Node',
      message: `The node "${context.nodeType || 'Unknown'}" is not connected to your strategy.`,
      suggestion: 'Connect this node to the strategy flow or delete it if it\'s not needed.',
      category: ErrorCategory.VALIDATION,
    },
    'invalid-parameter': {
      title: 'Invalid Parameter Value',
      message: `The value "${context.value}" is not valid for ${context.operation || 'this operation'}.`,
      suggestion: 'Check the node parameters and ensure all values are within acceptable ranges.',
      category: ErrorCategory.CONFIGURATION,
    },
    'missing-indicator-input': {
      title: 'Indicator Missing Input',
      message: 'This indicator node needs a data source.',
      suggestion: 'Make sure your indicator is connected to an event or data source to receive price data.',
      category: ErrorCategory.VALIDATION,
    },
    'duplicate-connection': {
      title: 'Connection Already Exists',
      message: 'A connection already exists between these nodes.',
      suggestion: 'You cannot create multiple connections between the same pair of nodes. If you need multiple signals, use a Logic node (AND/OR).',
      category: ErrorCategory.CONNECTION,
    },
  }
  
  return validationErrors[errorType] || {
    title: 'Validation Error',
    message: errorType,
    suggestion: 'Review your strategy configuration and fix any issues.',
    category: ErrorCategory.VALIDATION,
  }
}

/**
 * Get user-friendly error message for execution errors
 */
export function getExecutionError(errorType: string, context: ErrorContext = {}): UserFriendlyError {
  const executionErrors: Record<string, UserFriendlyError> = {
    'indicator-calculation-failed': {
      title: 'Indicator Calculation Failed',
      message: `Unable to calculate ${context.nodeType || 'indicator'} values.`,
      suggestion: 'Check that you have enough historical data (bars) for the indicator period. For example, a 50-period SMA needs at least 50 bars.',
      category: ErrorCategory.EXECUTION,
    },
    'insufficient-data': {
      title: 'Not Enough Data',
      message: 'The strategy needs more historical price data to calculate indicators.',
      suggestion: 'Ensure your data source has at least 100-200 bars of historical data for reliable indicator calculations.',
      category: ErrorCategory.EXECUTION,
    },
    'invalid-trade-parameters': {
      title: 'Invalid Trade Parameters',
      message: 'The trade cannot be executed with the current parameters.',
      suggestion: 'Check lot size, stop loss, and take profit values. Ensure they meet broker requirements (minimum lot size, stop level, etc.).',
      category: ErrorCategory.EXECUTION,
    },
    'division-by-zero': {
      title: 'Math Error',
      message: 'Cannot divide by zero in calculation.',
      suggestion: 'Add a condition to check that the divisor is not zero before performing division operations.',
      category: ErrorCategory.EXECUTION,
    },
  }
  
  return executionErrors[errorType] || {
    title: 'Execution Error',
    message: errorType,
    suggestion: 'Review the error details and check your strategy logic.',
    category: ErrorCategory.EXECUTION,
  }
}

/**
 * Format error for display to user
 */
export function formatErrorForUser(error: UserFriendlyError): string {
  return `${error.title}: ${error.message}\n\n💡 ${error.suggestion}`
}

/**
 * Get a short error message for toasts/notifications
 */
export function getShortErrorMessage(error: UserFriendlyError): string {
  return `${error.title}: ${error.message}`
}

/**
 * Convert technical error to user-friendly format
 */
export function friendlyError(
  technicalError: string,
  category: ErrorCategoryType = ErrorCategory.EXECUTION,
  context: ErrorContext = {}
): UserFriendlyError {
  // Try to match common technical errors to friendly messages
  const lowerError = technicalError.toLowerCase()
  
  if (lowerError.includes('circular') || lowerError.includes('cycle')) {
    return getCircularDependencyError(context.value || [])
  }
  
  if (lowerError.includes('type mismatch') || lowerError.includes('cannot connect')) {
    if (context.sourceType && context.targetType) {
      return getTypeMismatchError(context.sourceType, context.targetType)
    }
  }
  
  if (lowerError.includes('validation')) {
    return getValidationError('invalid-parameter', context)
  }
  
  // Default friendly error
  return {
    title: 'Error',
    message: technicalError,
    suggestion: 'Please review your strategy configuration and try again.',
    category,
  }
}
