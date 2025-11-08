import { useState } from 'react'
import { Layout } from '@/components/common/Layout'
import { Canvas } from '@/components/builder/Canvas'
import { BacktestView } from '@/components/backtest/BacktestView'
import { LibraryView } from '@/components/library/LibraryView'
import { SettingsView } from '@/components/settings/SettingsView'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [activeTab, setActiveTab] = useState('builder')

  const renderView = () => {
    switch (activeTab) {
      case 'builder':
        return <Canvas />
      case 'backtest':
        return <BacktestView />
      case 'library':
        return <LibraryView />
      case 'settings':
        return <SettingsView />
      default:
        return <Canvas />
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