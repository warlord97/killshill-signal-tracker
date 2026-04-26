const EmptyState = ({ onCreateClick }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-4">
      <span className="text-2xl">📡</span>
    </div>
    <h3 className="text-zinc-300 font-semibold text-lg mb-1">No Signals Yet</h3>
    <p className="text-zinc-500 text-sm mb-6 max-w-xs">
      Create your first trading signal to start tracking live prices and performance.
    </p>
    <button
      onClick={onCreateClick}
      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold rounded-lg transition-colors"
    >
      Create Signal
    </button>
  </div>
)

export default EmptyState