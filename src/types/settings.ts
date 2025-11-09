export interface CanvasSettings {
  showGrid: boolean
  showBlockNumbers: boolean
  showMinimap: boolean
  autoArrange: boolean
  snapToGrid: boolean
  connectionAnimationSpeed: number
  enableConnectionAnimation: boolean
}

export interface EASettings {
  magicNumberBase: number
  slippage: number
  maxSpread: number
  enableLogging: boolean
  logLevel: 'minimal' | 'normal' | 'verbose'
  commentPrefix: string
}

export const DEFAULT_CANVAS_SETTINGS: CanvasSettings = {
  showGrid: true,
  showBlockNumbers: true,
  showMinimap: true,
  autoArrange: false,
  snapToGrid: false,
  connectionAnimationSpeed: 1,
  enableConnectionAnimation: true
}

export const DEFAULT_EA_SETTINGS: EASettings = {
  magicNumberBase: 12345,
  slippage: 3,
  maxSpread: 3.0,
  enableLogging: true,
  logLevel: 'normal',
  commentPrefix: 'ForexFlow'
}
