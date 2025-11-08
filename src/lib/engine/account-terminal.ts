export interface AccountInfo {
  balance: number
  equity: number
  freeMargin: number
  usedMargin: number
  marginLevel: number
  profit: number
  leverage: number
  currency: string
  accountNumber: string
  accountName: string
  broker: string
  server: string
}

export interface TerminalInfo {
  isConnected: boolean
  terminalPath: string
  dataPath: string
  commonDataPath: string
  company: string
  name: string
  language: string
  build: number
  tradeAllowed: boolean
  autoTrading: boolean
  expertEnabled: boolean
  dllsAllowed: boolean
  tradeContextBusy: boolean
  tradingMode: 'disabled' | 'longonly' | 'shortonly' | 'closeonly' | 'full'
}

export interface SymbolInfo {
  name: string
  description: string
  digits: number
  point: number
  spread: number
  stopsLevel: number
  freezeLevel: number
  contractSize: number
  tickValue: number
  tickSize: number
  swapLong: number
  swapShort: number
  swapType: 'points' | 'baseCurrency' | 'interest' | 'marginCurrency'
  tradingMode: 'disabled' | 'longonly' | 'shortonly' | 'closeonly' | 'full'
  minLot: number
  maxLot: number
  lotStep: number
  volumeMin: number
  volumeMax: number
  volumeStep: number
  bidPrice: number
  askPrice: number
  lastPrice: number
  sessionDeals: number
  sessionBuyOrders: number
  sessionSellOrders: number
  volume: number
  high: number
  low: number
  time: number
}

export class AccountTerminalProvider {
  private account: AccountInfo
  private terminal: TerminalInfo
  private symbols: Map<string, SymbolInfo> = new Map()
  
  constructor() {
    this.account = this.createDefaultAccount()
    this.terminal = this.createDefaultTerminal()
    this.initializeDefaultSymbols()
  }
  
  private createDefaultAccount(): AccountInfo {
    return {
      balance: 10000,
      equity: 10000,
      freeMargin: 10000,
      usedMargin: 0,
      marginLevel: 0,
      profit: 0,
      leverage: 100,
      currency: 'USD',
      accountNumber: 'DEMO-12345',
      accountName: 'Demo Account',
      broker: 'ForexFlow Broker',
      server: 'ForexFlow-Demo'
    }
  }
  
  private createDefaultTerminal(): TerminalInfo {
    return {
      isConnected: true,
      terminalPath: '/terminal',
      dataPath: '/data',
      commonDataPath: '/common',
      company: 'ForexFlow',
      name: 'ForexFlow Terminal',
      language: 'English',
      build: 1000,
      tradeAllowed: true,
      autoTrading: true,
      expertEnabled: true,
      dllsAllowed: false,
      tradeContextBusy: false,
      tradingMode: 'full'
    }
  }
  
  private initializeDefaultSymbols(): void {
    const defaultSymbols: Partial<SymbolInfo>[] = [
      { name: 'EURUSD', description: 'Euro vs US Dollar', digits: 5, contractSize: 100000 },
      { name: 'GBPUSD', description: 'British Pound vs US Dollar', digits: 5, contractSize: 100000 },
      { name: 'USDJPY', description: 'US Dollar vs Japanese Yen', digits: 3, contractSize: 100000 },
      { name: 'USDCHF', description: 'US Dollar vs Swiss Franc', digits: 5, contractSize: 100000 },
      { name: 'AUDUSD', description: 'Australian Dollar vs US Dollar', digits: 5, contractSize: 100000 },
      { name: 'USDCAD', description: 'US Dollar vs Canadian Dollar', digits: 5, contractSize: 100000 },
      { name: 'NZDUSD', description: 'New Zealand Dollar vs US Dollar', digits: 5, contractSize: 100000 },
      { name: 'EURGBP', description: 'Euro vs British Pound', digits: 5, contractSize: 100000 },
      { name: 'EURJPY', description: 'Euro vs Japanese Yen', digits: 3, contractSize: 100000 },
      { name: 'GBPJPY', description: 'British Pound vs Japanese Yen', digits: 3, contractSize: 100000 }
    ]
    
    defaultSymbols.forEach(partial => {
      const symbol = this.createSymbolInfo(partial)
      this.symbols.set(symbol.name, symbol)
    })
  }
  
  private createSymbolInfo(partial: Partial<SymbolInfo>): SymbolInfo {
    const isJPY = partial.name?.includes('JPY')
    const point = isJPY ? 0.001 : 0.00001
    
    return {
      name: partial.name || 'EURUSD',
      description: partial.description || '',
      digits: partial.digits || (isJPY ? 3 : 5),
      point: point,
      spread: 15,
      stopsLevel: 10,
      freezeLevel: 0,
      contractSize: partial.contractSize || 100000,
      tickValue: 1,
      tickSize: point,
      swapLong: -0.5,
      swapShort: 0.2,
      swapType: 'points',
      tradingMode: 'full',
      minLot: 0.01,
      maxLot: 100,
      lotStep: 0.01,
      volumeMin: 0.01,
      volumeMax: 100,
      volumeStep: 0.01,
      bidPrice: 1.1000,
      askPrice: 1.1002,
      lastPrice: 1.1001,
      sessionDeals: 0,
      sessionBuyOrders: 0,
      sessionSellOrders: 0,
      volume: 0,
      high: 1.1050,
      low: 1.0950,
      time: Date.now()
    }
  }
  
  getAccount(): AccountInfo {
    return { ...this.account }
  }
  
  updateAccount(updates: Partial<AccountInfo>): void {
    this.account = { ...this.account, ...updates }
    this.recalculateAccountMetrics()
  }
  
  private recalculateAccountMetrics(): void {
    this.account.equity = this.account.balance + this.account.profit
    this.account.freeMargin = this.account.equity - this.account.usedMargin
    
    if (this.account.usedMargin > 0) {
      this.account.marginLevel = (this.account.equity / this.account.usedMargin) * 100
    } else {
      this.account.marginLevel = 0
    }
  }
  
  getTerminal(): TerminalInfo {
    return { ...this.terminal }
  }
  
  updateTerminal(updates: Partial<TerminalInfo>): void {
    this.terminal = { ...this.terminal, ...updates }
  }
  
  getSymbolInfo(symbol: string): SymbolInfo | undefined {
    return this.symbols.get(symbol)
  }
  
  getAllSymbols(): SymbolInfo[] {
    return Array.from(this.symbols.values())
  }
  
  getSymbolNames(): string[] {
    return Array.from(this.symbols.keys())
  }
  
  updateSymbolPrice(symbol: string, bid: number, ask: number): void {
    const symbolInfo = this.symbols.get(symbol)
    if (symbolInfo) {
      symbolInfo.bidPrice = bid
      symbolInfo.askPrice = ask
      symbolInfo.lastPrice = (bid + ask) / 2
      symbolInfo.spread = Math.round((ask - bid) / symbolInfo.point)
      symbolInfo.time = Date.now()
      this.symbols.set(symbol, symbolInfo)
    }
  }
  
  updateSymbolInfo(symbol: string, updates: Partial<SymbolInfo>): void {
    const symbolInfo = this.symbols.get(symbol)
    if (symbolInfo) {
      this.symbols.set(symbol, { ...symbolInfo, ...updates })
    }
  }
  
  addSymbol(symbolInfo: SymbolInfo): void {
    this.symbols.set(symbolInfo.name, symbolInfo)
  }
  
  removeSymbol(symbol: string): boolean {
    return this.symbols.delete(symbol)
  }
  
  getBalance(): number {
    return this.account.balance
  }
  
  getEquity(): number {
    return this.account.equity
  }
  
  getFreeMargin(): number {
    return this.account.freeMargin
  }
  
  getMarginLevel(): number {
    return this.account.marginLevel
  }
  
  getProfit(): number {
    return this.account.profit
  }
  
  getLeverage(): number {
    return this.account.leverage
  }
  
  isTradeAllowed(): boolean {
    return this.terminal.tradeAllowed && this.terminal.expertEnabled
  }
  
  isAutoTradingEnabled(): boolean {
    return this.terminal.autoTrading
  }
  
  isConnected(): boolean {
    return this.terminal.isConnected
  }
  
  calculateRequiredMargin(symbol: string, lots: number): number {
    const symbolInfo = this.symbols.get(symbol)
    if (!symbolInfo) return 0
    
    const contractSize = symbolInfo.contractSize
    const price = symbolInfo.askPrice
    const leverage = this.account.leverage
    
    return (lots * contractSize * price) / leverage
  }
  
  calculatePipValue(symbol: string, lots: number): number {
    const symbolInfo = this.symbols.get(symbol)
    if (!symbolInfo) return 0
    
    const contractSize = symbolInfo.contractSize
    const point = symbolInfo.point
    
    if (symbol.endsWith('JPY')) {
      return lots * contractSize * (point * 10)
    }
    
    return lots * contractSize * (point * 10)
  }
  
  calculateSpreadCost(symbol: string, lots: number): number {
    const symbolInfo = this.symbols.get(symbol)
    if (!symbolInfo) return 0
    
    const spreadPips = symbolInfo.spread / 10
    const pipValue = this.calculatePipValue(symbol, lots)
    
    return spreadPips * pipValue
  }
  
  reset(): void {
    this.account = this.createDefaultAccount()
    this.terminal = this.createDefaultTerminal()
    this.symbols.clear()
    this.initializeDefaultSymbols()
  }
  
  export() {
    return {
      account: this.account,
      terminal: this.terminal,
      symbols: Array.from(this.symbols.values())
    }
  }
  
  import(data: {
    account: AccountInfo
    terminal: TerminalInfo
    symbols: SymbolInfo[]
  }): void {
    this.account = data.account
    this.terminal = data.terminal
    this.symbols.clear()
    data.symbols.forEach(symbol => {
      this.symbols.set(symbol.name, symbol)
    })
  }
}

export const accountTerminal = new AccountTerminalProvider()
