export type VariableType = 'number' | 'string' | 'boolean' | 'array'

export interface Variable {
  name: string
  type: VariableType
  value: any
}

export class VariableStorage {
  private variables: Map<string, Variable> = new Map()
  private arrays: Map<string, any[]> = new Map()
  private counters: Map<string, number> = new Map()

  setVariable(name: string, value: any, type: VariableType = 'number'): void {
    this.variables.set(name, { name, type, value })
  }

  getVariable(name: string): any {
    const variable = this.variables.get(name)
    return variable ? variable.value : undefined
  }

  hasVariable(name: string): boolean {
    return this.variables.has(name)
  }

  deleteVariable(name: string): void {
    this.variables.delete(name)
  }

  incrementCounter(name: string, step: number = 1): number {
    const current = this.counters.get(name) || 0
    const newValue = current + step
    this.counters.set(name, newValue)
    return newValue
  }

  decrementCounter(name: string, step: number = 1): number {
    const current = this.counters.get(name) || 0
    const newValue = current - step
    this.counters.set(name, newValue)
    return newValue
  }

  getCounter(name: string): number {
    return this.counters.get(name) || 0
  }

  resetCounter(name: string): void {
    this.counters.set(name, 0)
  }

  pushArray(name: string, value: any): void {
    if (!this.arrays.has(name)) {
      this.arrays.set(name, [])
    }
    this.arrays.get(name)!.push(value)
  }

  popArray(name: string): any {
    if (!this.arrays.has(name)) {
      return undefined
    }
    return this.arrays.get(name)!.pop()
  }

  getArray(name: string): any[] {
    return this.arrays.get(name) || []
  }

  getArrayElement(name: string, index: number): any {
    const arr = this.arrays.get(name)
    if (!arr || index < 0 || index >= arr.length) {
      return undefined
    }
    return arr[index]
  }

  setArrayElement(name: string, index: number, value: any): boolean {
    const arr = this.arrays.get(name)
    if (!arr || index < 0 || index >= arr.length) {
      return false
    }
    arr[index] = value
    return true
  }

  getArrayLength(name: string): number {
    const arr = this.arrays.get(name)
    return arr ? arr.length : 0
  }

  clearArray(name: string): void {
    this.arrays.set(name, [])
  }

  getAllVariables(): Variable[] {
    return Array.from(this.variables.values())
  }

  getAllCounters(): Map<string, number> {
    return new Map(this.counters)
  }

  getAllArrays(): Map<string, any[]> {
    return new Map(this.arrays)
  }

  clear(): void {
    this.variables.clear()
    this.arrays.clear()
    this.counters.clear()
  }

  clone(): VariableStorage {
    const cloned = new VariableStorage()
    
    this.variables.forEach((value, key) => {
      cloned.setVariable(key, value.value, value.type)
    })
    
    this.counters.forEach((value, key) => {
      cloned.counters.set(key, value)
    })
    
    this.arrays.forEach((value, key) => {
      cloned.arrays.set(key, [...value])
    })
    
    return cloned
  }

  serialize(): string {
    return JSON.stringify({
      variables: Array.from(this.variables.entries()),
      counters: Array.from(this.counters.entries()),
      arrays: Array.from(this.arrays.entries())
    })
  }

  deserialize(data: string): void {
    try {
      const parsed = JSON.parse(data)
      
      this.clear()
      
      if (parsed.variables) {
        parsed.variables.forEach(([key, value]: [string, Variable]) => {
          this.variables.set(key, value)
        })
      }
      
      if (parsed.counters) {
        parsed.counters.forEach(([key, value]: [string, number]) => {
          this.counters.set(key, value)
        })
      }
      
      if (parsed.arrays) {
        parsed.arrays.forEach(([key, value]: [string, any[]]) => {
          this.arrays.set(key, value)
        })
      }
    } catch (error) {
      console.error('Failed to deserialize variable storage:', error)
    }
  }
}
