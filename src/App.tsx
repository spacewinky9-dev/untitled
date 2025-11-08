import { useState, useEffect } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { Layout } from '@/components/common/Layout'
import { Canvas } from '@/components/builder/Canvas'
import { BacktestView } from '@/components/backtest/BacktestView'
import { LibraryView } from '@/components/library/LibraryView'
import { SettingsView } from '@/components/settings/SettingsView'
import { Toaster } from '@/components/ui/sonner'
import { useKV } from '@github/spark/hooks'
import { Strategy } from '@/types/strategy'

function App() {
  const [activeTab, setActiveTab] = useState('builder')
  const [pendingLoad, setPendingLoad] = useKV<string | null>('pendingStrategyLoad', null)

  const handleLoadFromLibrary = (strategy: Strategy) => {
    setPendingLoad(strategy.id)
    setActiveTab('builder')
  }

  const renderView = () => {
    switch (activeTab) {
      case 'builder':
        return (
          <ReactFlowProvider>
            <Canvas pendingLoadStrategyId={pendingLoad} onStrategyLoaded={() => setPendingLoad(null)} />
          </ReactFlowProvider>
        )
      case 'backtest':
        return <BacktestView />
      case 'library':
        return <LibraryView onLoadStrategy={handleLoadFromLibrary} />
      case 'settings':
        return <SettingsView />
      default:
        return (
          <ReactFlowProvider>
            <Canvas pendingLoadStrategyId={pendingLoad} onStrategyLoaded={() => setPendingLoad(null)} />
          </ReactFlowProvider>
        )
    }
  }

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderView()}
      </Layout>
      <Toaster />
    </>
  )
}

export default App