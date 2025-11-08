export type MathOperation = 
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'modulus'
  | 'power'
  | 'sqrt'
  | 'abs'
  | 'min'
  | 'max'
  | 'floor'
  | 'ceil'
  | 'round'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'log'
  | 'exp'

export interface MathOperationResult {
  value: number
  error?: string
}

export class MathOperationsEngine {
  
  executeOperation(
    operation: MathOperation,
    operands: number[]
  ): MathOperationResult {
    try {
      let result: number
      
      switch (operation) {
        case 'add':
          result = this.add(operands)
          break
          
        case 'subtract':
          result = this.subtract(operands)
          break
          
        case 'multiply':
          result = this.multiply(operands)
          break
          
        case 'divide':
          result = this.divide(operands)
          break
          
        case 'modulus':
          result = this.modulus(operands)
          break
          
        case 'power':
          result = this.power(operands)
          break
          
        case 'sqrt':
          result = this.sqrt(operands[0])
          break
          
        case 'abs':
          result = this.abs(operands[0])
          break
          
        case 'min':
          result = this.min(operands)
          break
          
        case 'max':
          result = this.max(operands)
          break
          
        case 'floor':
          result = this.floor(operands[0])
          break
          
        case 'ceil':
          result = this.ceil(operands[0])
          break
          
        case 'round':
          result = this.round(operands[0], operands[1])
          break
          
        case 'sin':
          result = this.sin(operands[0])
          break
          
        case 'cos':
          result = this.cos(operands[0])
          break
          
        case 'tan':
          result = this.tan(operands[0])
          break
          
        case 'log':
          result = this.log(operands[0])
          break
          
        case 'exp':
          result = this.exp(operands[0])
          break
          
        default:
          return {
            value: 0,
            error: `Unknown operation: ${operation}`
          }
      }
      
      if (!isFinite(result)) {
        return {
          value: 0,
          error: 'Result is not finite (Infinity or NaN)'
        }
      }
      
      return { value: result }
      
    } catch (error) {
      return {
        value: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  private add(operands: number[]): number {
    if (operands.length === 0) return 0
    return operands.reduce((sum, val) => sum + val, 0)
  }
  
  private subtract(operands: number[]): number {
    if (operands.length === 0) return 0
    if (operands.length === 1) return -operands[0]
    return operands.reduce((diff, val, index) => 
      index === 0 ? val : diff - val
    )
  }
  
  private multiply(operands: number[]): number {
    if (operands.length === 0) return 0
    return operands.reduce((product, val) => product * val, 1)
  }
  
  private divide(operands: number[]): number {
    if (operands.length < 2) {
      throw new Error('Divide requires at least 2 operands')
    }
    
    if (operands.slice(1).some(val => val === 0)) {
      throw new Error('Division by zero')
    }
    
    return operands.reduce((quotient, val, index) => 
      index === 0 ? val : quotient / val
    )
  }
  
  private modulus(operands: number[]): number {
    if (operands.length !== 2) {
      throw new Error('Modulus requires exactly 2 operands')
    }
    
    if (operands[1] === 0) {
      throw new Error('Modulus by zero')
    }
    
    return operands[0] % operands[1]
  }
  
  private power(operands: number[]): number {
    if (operands.length !== 2) {
      throw new Error('Power requires exactly 2 operands')
    }
    return Math.pow(operands[0], operands[1])
  }
  
  private sqrt(value: number): number {
    if (value < 0) {
      throw new Error('Cannot take square root of negative number')
    }
    return Math.sqrt(value)
  }
  
  private abs(value: number): number {
    return Math.abs(value)
  }
  
  private min(operands: number[]): number {
    if (operands.length === 0) {
      throw new Error('Min requires at least 1 operand')
    }
    return Math.min(...operands)
  }
  
  private max(operands: number[]): number {
    if (operands.length === 0) {
      throw new Error('Max requires at least 1 operand')
    }
    return Math.max(...operands)
  }
  
  private floor(value: number): number {
    return Math.floor(value)
  }
  
  private ceil(value: number): number {
    return Math.ceil(value)
  }
  
  private round(value: number, decimals: number = 0): number {
    const multiplier = Math.pow(10, decimals)
    return Math.round(value * multiplier) / multiplier
  }
  
  private sin(value: number): number {
    return Math.sin(value)
  }
  
  private cos(value: number): number {
    return Math.cos(value)
  }
  
  private tan(value: number): number {
    return Math.tan(value)
  }
  
  private log(value: number): number {
    if (value <= 0) {
      throw new Error('Cannot take logarithm of non-positive number')
    }
    return Math.log(value)
  }
  
  private exp(value: number): number {
    return Math.exp(value)
  }
  
  percentage(value: number, percent: number): number {
    return (value * percent) / 100
  }
  
  percentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) {
      throw new Error('Cannot calculate percentage change from zero')
    }
    return ((newValue - oldValue) / Math.abs(oldValue)) * 100
  }
  
  pipsToPriceChange(pips: number, pipValue: number): number {
    return pips * pipValue
  }
  
  priceChangeToPips(priceChange: number, pipValue: number): number {
    return priceChange / pipValue
  }
  
  normalize(value: number, digits: number): number {
    return this.round(value, digits)
  }
  
  interpolate(value1: number, value2: number, factor: number): number {
    return value1 + (value2 - value1) * factor
  }
  
  clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
  }
}

export const mathEngine = new MathOperationsEngine()
