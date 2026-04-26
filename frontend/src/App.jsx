import { useState } from 'react'
import useSignals from './hooks/useSignals'
import { deleteSignal } from './api/signalApi'
import SignalForm from './components/form/SignalForm'
import SignalTable from './components/dashboard/SignalTable'
import StatsBar from './components/dashboard/StatsBar'
import Loader from './components/common/Loader'

const App = () => {
  const { signals, loading, error, lastRefreshed, refetch } = useSignals()
  const [showForm, setShowForm] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this signal?')) return
    try {
      await deleteSignal(id)
      refetch()
    } catch {
      setDeleteError('Failed to delete signal.')
      setTimeout(() => setDeleteError(null), 3000)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    refetch()
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold text-sm">
              KS
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-100">KillShill</h1>
              <p className="text-xs text-zinc-500 hidden sm:block">Signal Tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="text-xs text-zinc-600 hidden sm:block">
                Updated {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-3 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-semibold rounded-lg transition-colors"
            >
              {showForm ? 'Cancel' : '+ New Signal'}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Create Signal Form */}
        {showForm && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
            <h2 className="text-base font-semibold text-zinc-100 mb-5">
              Create Trading Signal
            </h2>
            <SignalForm
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Error Banner */}
        {(error || deleteError) && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error || deleteError}
          </div>
        )}

        {/* Stats Bar */}
        {!loading && signals.length > 0 && (
          <StatsBar signals={signals} />
        )}

        {/* Dashboard */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">Signal Dashboard</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Auto-refreshes every 15 seconds</p>
            </div>
            <button
              onClick={refetch}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700"
            >
              Refresh
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="py-16">
                <Loader text="Fetching live signals..." />
              </div>
            ) : (
              <SignalTable
                signals={signals}
                onDelete={handleDelete}
                onCreateClick={() => setShowForm(true)}
              />
            )}
          </div>
        </div>

      </main>
    </div>
  )
}

export default App