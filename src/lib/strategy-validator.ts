import { Strategy, StrategyNode, StrategyEdge } from '@/types/strategy'

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info'
  message: string
  nodeId?: string
  edgeId?: string
  category: 'structure' | 'connection' | 'parameter' | 'logic' | 'performance'
}

export interface ValidationResult {
  valid: boolean
  issues: ValidationIssue[]
  warnings: ValidationIssue[]
  info: ValidationIssue[]
}

export class StrategyValidator {
  validate(strategy: Strategy): ValidationResult {
    const issues: ValidationIssue[] = []

    this.validateStructure(strategy, issues)
    this.validateConnections(strategy, issues)
    this.validateNodeParameters(strategy, issues)
    this.validateLogicFlow(strategy, issues)
    this.validatePerformance(strategy, issues)

    const errors = issues.filter(i => i.severity === 'error')
    const warnings = issues.filter(i => i.severity === 'warning')
    const info = issues.filter(i => i.severity === 'info')

    return {
      valid: errors.length === 0,
      issues: errors,
      warnings,
      info
    }
  }

  private validateStructure(strategy: Strategy, issues: ValidationIssue[]): void {
    if (!strategy.nodes || strategy.nodes.length === 0) {
      issues.push({
        severity: 'error',
        message: 'Strategy has no nodes',
        category: 'structure'
      })
      return
    }

    const eventNodes = strategy.nodes.filter(n => n.type === 'event')
    if (eventNodes.length === 0) {
      issues.push({
        severity: 'error',
        message: 'Strategy must have at least one event node (OnTick, OnBar, etc.)',
        category: 'structure'
      })
    }

    const actionNodes = strategy.nodes.filter(n => n.type === 'action')
    if (actionNodes.length === 0) {
      issues.push({
        severity: 'warning',
        message: 'Strategy has no action nodes - no trades will be executed',
        category: 'structure'
      })
    }

    const buyActions = strategy.nodes.filter(n => 
      n.type === 'action' && 
      (n.data?.actionType === 'buy' || n.data?.actionType === 'long')
    )
    const sellActions = strategy.nodes.filter(n => 
      n.type === 'action' && 
      (n.data?.actionType === 'sell' || n.data?.actionType === 'short')
    )

    if (buyActions.length > 0 && sellActions.length === 0) {
      issues.push({
        severity: 'info',
        message: 'Strategy only has buy actions - consider adding sell actions for balanced trading',
        category: 'structure'
      })
    } else if (sellActions.length > 0 && buyActions.length === 0) {
      issues.push({
        severity: 'info',
        message: 'Strategy only has sell actions - consider adding buy actions for balanced trading',
        category: 'structure'
      })
    }
  }

  private validateConnections(strategy: Strategy, issues: ValidationIssue[]): void {
    const nodeMap = new Map((strategy.nodes || []).map(n => [n.id, n]))

    (strategy.edges || []).forEach(edge => {
      const sourceNode = nodeMap.get(edge.source)
      const targetNode = nodeMap.get(edge.target)

      if (!sourceNode) {
        issues.push({
          severity: 'error',
          message: `Edge references non-existent source node: ${edge.source}`,
          edgeId: edge.id,
          category: 'connection'
        })
      }

      if (!targetNode) {
        issues.push({
          severity: 'error',
          message: `Edge references non-existent target node: ${edge.target}`,
          edgeId: edge.id,
          category: 'connection'
        })
      }

      if (sourceNode && targetNode) {
        this.validateConnectionTypes(sourceNode, targetNode, edge, issues)
      }
    })

    strategy.nodes.forEach(node => {
      const incomingEdges = strategy.edges.filter(e => e.target === node.id)
      const outgoingEdges = strategy.edges.filter(e => e.source === node.id)

      if (node.type === 'condition' && incomingEdges.length === 0) {
        issues.push({
          severity: 'warning',
          message: `Condition node "${node.data?.label || node.id}" has no input connections`,
          nodeId: node.id,
          category: 'connection'
        })
      }

      if (node.type === 'action' && incomingEdges.length === 0) {
        issues.push({
          severity: 'warning',
          message: `Action node "${node.data?.label || node.id}" has no input connections - may execute unconditionally`,
          nodeId: node.id,
          category: 'connection'
        })
      }

      if (node.type === 'indicator' && outgoingEdges.length === 0) {
        issues.push({
          severity: 'info',
          message: `Indicator "${node.data?.label || node.id}" is not used by any other nodes`,
          nodeId: node.id,
          category: 'connection'
        })
      }

      if (node.type === 'condition' && outgoingEdges.length === 0) {
        issues.push({
          severity: 'warning',
          message: `Condition "${node.data?.label || node.id}" is not connected to any actions`,
          nodeId: node.id,
          category: 'connection'
        })
      }
    })
  }

  private validateConnectionTypes(
    sourceNode: StrategyNode,
    targetNode: StrategyNode,
    edge: StrategyEdge,
    issues: ValidationIssue[]
  ): void {
    const validConnections: Record<string, string[]> = {
      event: ['indicator', 'condition', 'logic', 'action', 'variable', 'advanced'],
      indicator: ['condition', 'logic', 'variable', 'advanced', 'graphical'],
      condition: ['logic', 'action', 'risk', 'advanced'],
      logic: ['logic', 'action', 'risk', 'advanced'],
      pattern: ['logic', 'action', 'risk'],
      mtf: ['condition', 'logic', 'action'],
      variable: ['condition', 'logic', 'action', 'advanced'],
      risk: ['action'],
      money_management: ['action', 'risk'],
      advanced: ['condition', 'logic', 'action', 'advanced'],
      graphical: [],
      messaging: [],
      file_ops: [],
      terminal: ['condition', 'logic']
    }

    const sourceType = sourceNode.type
    const targetType = targetNode.type
    const allowedTargets = validConnections[sourceType] || []

    if (!allowedTargets.includes(targetType)) {
      issues.push({
        severity: 'error',
        message: `Invalid connection: ${sourceType} cannot connect to ${targetType}`,
        edgeId: edge.id,
        category: 'connection'
      })
    }
  }

  private validateNodeParameters(strategy: Strategy, issues: ValidationIssue[]): void {
    strategy.nodes.forEach(node => {
      const params = node.data?.parameters || {}

      switch (node.type) {
        case 'indicator':
          this.validateIndicatorParams(node, params, issues)
          break
        case 'condition':
          this.validateConditionParams(node, params, issues)
          break
        case 'risk':
          this.validateRiskParams(node, params, issues)
          break
        case 'money_management':
          this.validateMoneyManagementParams(node, params, issues)
          break
      }
    })
  }

  private validateIndicatorParams(node: StrategyNode, params: any, issues: ValidationIssue[]): void {
    const indicatorType = node.data?.indicatorType

    if (params.period !== undefined && params.period < 1) {
      issues.push({
        severity: 'error',
        message: `Indicator "${node.data?.label || node.id}" has invalid period: ${params.period}`,
        nodeId: node.id,
        category: 'parameter'
      })
    }

    if (params.period !== undefined && params.period > 500) {
      issues.push({
        severity: 'warning',
        message: `Indicator "${node.data?.label || node.id}" has very large period (${params.period}) - may reduce signal accuracy`,
        nodeId: node.id,
        category: 'parameter'
      })
    }

    if (indicatorType === 'bb' && params.stdDev !== undefined && params.stdDev <= 0) {
      issues.push({
        severity: 'error',
        message: `Bollinger Bands standard deviation must be positive`,
        nodeId: node.id,
        category: 'parameter'
      })
    }

    if (indicatorType === 'rsi') {
      if (params.overbought !== undefined && (params.overbought < 50 || params.overbought > 100)) {
        issues.push({
          severity: 'warning',
          message: `RSI overbought level (${params.overbought}) should be between 50-100`,
          nodeId: node.id,
          category: 'parameter'
        })
      }
      if (params.oversold !== undefined && (params.oversold < 0 || params.oversold > 50)) {
        issues.push({
          severity: 'warning',
          message: `RSI oversold level (${params.oversold}) should be between 0-50`,
          nodeId: node.id,
          category: 'parameter'
        })
      }
    }
  }

  private validateConditionParams(node: StrategyNode, params: any, issues: ValidationIssue[]): void {
    if (!params.operator) {
      issues.push({
        severity: 'warning',
        message: `Condition "${node.data?.label || node.id}" has no operator specified`,
        nodeId: node.id,
        category: 'parameter'
      })
    }
  }

  private validateRiskParams(node: StrategyNode, params: any, issues: ValidationIssue[]): void {
    const riskType = node.data?.riskType

    if (riskType === 'stop_loss' || riskType === 'take_profit') {
      if (params.pips !== undefined && params.pips <= 0) {
        issues.push({
          severity: 'error',
          message: `${riskType} pips must be positive`,
          nodeId: node.id,
          category: 'parameter'
        })
      }
      if (params.pips !== undefined && params.pips > 1000) {
        issues.push({
          severity: 'warning',
          message: `${riskType} pips (${params.pips}) is very large - may be too wide`,
          nodeId: node.id,
          category: 'parameter'
        })
      }
    }

    if (riskType === 'position_size') {
      if (params.riskPercent !== undefined && (params.riskPercent <= 0 || params.riskPercent > 10)) {
        issues.push({
          severity: 'warning',
          message: `Risk percent (${params.riskPercent}%) should be between 0.1-10%`,
          nodeId: node.id,
          category: 'parameter'
        })
      }
    }
  }

  private validateMoneyManagementParams(node: StrategyNode, params: any, issues: ValidationIssue[]): void {
    if (params.riskPerTrade !== undefined && params.riskPerTrade > 5) {
      issues.push({
        severity: 'warning',
        message: `Risk per trade (${params.riskPerTrade}%) is high - consider reducing to 1-2%`,
        nodeId: node.id,
        category: 'parameter'
      })
    }

    if (params.maxDailyLoss !== undefined && params.maxDailyLoss > 10) {
      issues.push({
        severity: 'warning',
        message: `Max daily loss (${params.maxDailyLoss}%) is high - consider reducing`,
        nodeId: node.id,
        category: 'parameter'
      })
    }
  }

  private validateLogicFlow(strategy: Strategy, issues: ValidationIssue[]): void {
    const nodeMap = new Map(strategy.nodes.map(n => [n.id, n]))
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const detectCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) {
        issues.push({
          severity: 'error',
          message: `Circular dependency detected in node ${nodeId}`,
          nodeId,
          category: 'logic'
        })
        return true
      }

      if (visited.has(nodeId)) {
        return false
      }

      visited.add(nodeId)
      recursionStack.add(nodeId)

      const outgoingEdges = strategy.edges.filter(e => e.source === nodeId)
      for (const edge of outgoingEdges) {
        if (detectCycle(edge.target)) {
          return true
        }
      }

      recursionStack.delete(nodeId)
      return false
    }

    strategy.nodes.forEach(node => {
      detectCycle(node.id)
    })

    const eventNodes = strategy.nodes.filter(n => n.type === 'event')
    eventNodes.forEach(eventNode => {
      const reachableNodes = this.getReachableNodes(eventNode.id, strategy)
      const hasAction = reachableNodes.some(id => {
        const node = nodeMap.get(id)
        return node?.type === 'action'
      })

      if (!hasAction) {
        issues.push({
          severity: 'warning',
          message: `Event "${eventNode.data?.label || eventNode.id}" does not lead to any action nodes`,
          nodeId: eventNode.id,
          category: 'logic'
        })
      }
    })
  }

  private validatePerformance(strategy: Strategy, issues: ValidationIssue[]): void {
    const indicatorCount = strategy.nodes.filter(n => n.type === 'indicator').length
    const nodeCount = strategy.nodes.length

    if (indicatorCount > 20) {
      issues.push({
        severity: 'warning',
        message: `Strategy has ${indicatorCount} indicators - may impact performance`,
        category: 'performance'
      })
    }

    if (nodeCount > 100) {
      issues.push({
        severity: 'info',
        message: `Strategy has ${nodeCount} nodes - consider simplifying for better maintainability`,
        category: 'performance'
      })
    }

    const mtfNodes = strategy.nodes.filter(n => n.type === 'mtf')
    if (mtfNodes.length > 5) {
      issues.push({
        severity: 'warning',
        message: `Strategy has ${mtfNodes.length} multi-timeframe nodes - may significantly impact performance`,
        category: 'performance'
      })
    }
  }

  private getReachableNodes(startNodeId: string, strategy: Strategy): Set<string> {
    const reachable = new Set<string>()
    const queue = [startNodeId]

    while (queue.length > 0) {
      const currentId = queue.shift()!
      if (reachable.has(currentId)) continue

      reachable.add(currentId)

      const outgoingEdges = strategy.edges.filter(e => e.source === currentId)
      outgoingEdges.forEach(edge => {
        if (!reachable.has(edge.target)) {
          queue.push(edge.target)
        }
      })
    }

    return reachable
  }

  validateSingleNode(node: StrategyNode): ValidationIssue[] {
    const issues: ValidationIssue[] = []
    const params = node.data?.parameters || {}

    switch (node.type) {
      case 'indicator':
        this.validateIndicatorParams(node, params, issues)
        break
      case 'condition':
        this.validateConditionParams(node, params, issues)
        break
      case 'risk':
        this.validateRiskParams(node, params, issues)
        break
      case 'money_management':
        this.validateMoneyManagementParams(node, params, issues)
        break
    }

    return issues
  }
}

export const strategyValidator = new StrategyValidator()
