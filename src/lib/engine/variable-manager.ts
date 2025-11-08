export type VariableValue = number | string | boolean | number[] | string[] | boolean[] | Record<string, any>

export interface Variable {
  name: string
  value: VariableValue
  type: 'number' | 'string' | 'boolean' | 'array' | 'object'
  scope: 'local' | 'global'
  persistent: boolean
}

export class VariableManager {
  private variables: Map<string, Variable> = new Map()
  private globalVariables: Map<string, Variable> = new Map()
  private sessionVariables: Map<string, Variable> = new Map()

  setVariable(name: string, value: VariableValue, scope: 'local' | 'global' = 'local', persistent: boolean = false): void {
    const type = this.inferType(value)
    
    const variable: Variable = {
      name,
      value,
      type,
      scope,
      persistent
    }

    if (scope === 'global') {
      this.globalVariables.set(name, variable)
    } else {
      this.variables.set(name, variable)
    }

    if (persistent) {
      this.sessionVariables.set(name, variable)
    }
  }

  getVariable(name: string, scope: 'local' | 'global' = 'local'): VariableValue | undefined {
    const store = scope === 'global' ? this.globalVariables : this.variables
    return store.get(name)?.value
  }

  hasVariable(name: string, scope: 'local' | 'global' = 'local'): boolean {
    const store = scope === 'global' ? this.globalVariables : this.variables
    return store.has(name)
  }

  deleteVariable(name: string, scope: 'local' | 'global' = 'local'): boolean {
    const store = scope === 'global' ? this.globalVariables : this.variables
    const result = store.delete(name)
    this.sessionVariables.delete(name)
    return result
  }

  incrementCounter(name: string, amount: number = 1, scope: 'local' | 'global' = 'local'): number {
    const current = this.getVariable(name, scope)
    const newValue = (typeof current === 'number' ? current : 0) + amount
    this.setVariable(name, newValue, scope)
    return newValue
  }

  decrementCounter(name: string, amount: number = 1, scope: 'local' | 'global' = 'local'): number {
    return this.incrementCounter(name, -amount, scope)
  }

  resetCounter(name: string, scope: 'local' | 'global' = 'local'): void {
    this.setVariable(name, 0, scope)
  }

  arrayPush(name: string, value: any, scope: 'local' | 'global' = 'local'): number {
    const current = this.getVariable(name, scope)
    const array = Array.isArray(current) ? [...current] : []
    array.push(value)
    this.setVariable(name, array, scope)
    return array.length
  }

  arrayPop(name: string, scope: 'local' | 'global' = 'local'): any {
    const current = this.getVariable(name, scope)
    if (!Array.isArray(current) || current.length === 0) {
      return undefined
    }
    const array = [...current]
    const value = array.pop()
    this.setVariable(name, array, scope)
    return value
  }

  arrayGet(name: string, index: number, scope: 'local' | 'global' = 'local'): any {
    const current = this.getVariable(name, scope)
    if (!Array.isArray(current)) {
      return undefined
    }
    return current[index]
  }

  arrayLength(name: string, scope: 'local' | 'global' = 'local'): number {
    const current = this.getVariable(name, scope)
    return Array.isArray(current) ? current.length : 0
  }

  arrayClear(name: string, scope: 'local' | 'global' = 'local'): void {
    this.setVariable(name, [], scope)
  }

  objectSet(name: string, key: string, value: any, scope: 'local' | 'global' = 'local'): void {
    const current = this.getVariable(name, scope)
    const obj = typeof current === 'object' && !Array.isArray(current) ? { ...current as Record<string, any> } : {}
    obj[key] = value
    this.setVariable(name, obj, scope)
  }

  objectGet(name: string, key: string, scope: 'local' | 'global' = 'local'): any {
    const current = this.getVariable(name, scope)
    if (typeof current !== 'object' || Array.isArray(current)) {
      return undefined
    }
    return (current as Record<string, any>)[key]
  }

  objectHas(name: string, key: string, scope: 'local' | 'global' = 'local'): boolean {
    const current = this.getVariable(name, scope)
    if (typeof current !== 'object' || Array.isArray(current)) {
      return false
    }
    return key in (current as Record<string, any>)
  }

  objectDelete(name: string, key: string, scope: 'local' | 'global' = 'local'): boolean {
    const current = this.getVariable(name, scope)
    if (typeof current !== 'object' || Array.isArray(current)) {
      return false
    }
    const obj = { ...current as Record<string, any> }
    const result = delete obj[key]
    this.setVariable(name, obj, scope)
    return result
  }

  getAllVariables(scope: 'local' | 'global' | 'all' = 'all'): Variable[] {
    if (scope === 'local') {
      return Array.from(this.variables.values())
    } else if (scope === 'global') {
      return Array.from(this.globalVariables.values())
    } else {
      return [
        ...Array.from(this.variables.values()),
        ...Array.from(this.globalVariables.values())
      ]
    }
  }

  getVariableNames(scope: 'local' | 'global' | 'all' = 'all'): string[] {
    return this.getAllVariables(scope).map(v => v.name)
  }

  clearVariables(scope: 'local' | 'global' | 'all' = 'all'): void {
    if (scope === 'local' || scope === 'all') {
      this.variables.clear()
    }
    if (scope === 'global' || scope === 'all') {
      this.globalVariables.clear()
    }
  }

  saveSession(): Record<string, VariableValue> {
    const session: Record<string, VariableValue> = {}
    for (const [name, variable] of this.sessionVariables) {
      session[name] = variable.value
    }
    return session
  }

  loadSession(session: Record<string, VariableValue>): void {
    for (const [name, value] of Object.entries(session)) {
      this.setVariable(name, value, 'local', true)
    }
  }

  private inferType(value: VariableValue): 'number' | 'string' | 'boolean' | 'array' | 'object' {
    if (typeof value === 'number') return 'number'
    if (typeof value === 'string') return 'string'
    if (typeof value === 'boolean') return 'boolean'
    if (Array.isArray(value)) return 'array'
    return 'object'
  }

  clone(): VariableManager {
    const cloned = new VariableManager()
    
    this.variables.forEach((variable, name) => {
      cloned.variables.set(name, { ...variable })
    })
    
    this.globalVariables.forEach((variable, name) => {
      cloned.globalVariables.set(name, { ...variable })
    })
    
    this.sessionVariables.forEach((variable, name) => {
      cloned.sessionVariables.set(name, { ...variable })
    })
    
    return cloned
  }

  reset(): void {
    this.variables.clear()
    this.globalVariables.clear()
    this.sessionVariables.clear()
  }

  export(): string {
    const data = {
      variables: Object.fromEntries(this.variables),
      globalVariables: Object.fromEntries(this.globalVariables),
      sessionVariables: Object.fromEntries(this.sessionVariables)
    }
    return JSON.stringify(data, null, 2)
  }

  import(json: string): boolean {
    try {
      const data = JSON.parse(json)
      
      if (data.variables) {
        this.variables = new Map(Object.entries(data.variables))
      }
      
      if (data.globalVariables) {
        this.globalVariables = new Map(Object.entries(data.globalVariables))
      }
      
      if (data.sessionVariables) {
        this.sessionVariables = new Map(Object.entries(data.sessionVariables))
      }
      
      return true
    } catch (error) {
      console.error('Failed to import variables:', error)
      return false
    }
  }
}

export const variableManager = new VariableManager()
