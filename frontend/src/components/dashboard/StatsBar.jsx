const StatsBar = ({ signals }) => {
  const total = signals.length
  const open = signals.filter(s => s.status === 'OPEN').length
  const targetHit = signals.filter(s => s.status === 'TARGET_HIT').length
  const stopLossHit = signals.filter(s => s.status === 'STOPLOSS_HIT').length
  const expired = signals.filter(s => s.status === 'EXPIRED').length

  const stats = [
    { label: 'Total Signals', value: total, color: 'text-zinc-200' },
    { label: 'Open', value: open, color: 'text-blue-400' },
    { label: 'Target Hit', value: targetHit, color: 'text-emerald-400' },
    { label: 'Stop Loss', value: stopLossHit, color: 'text-red-400' },
    { label: 'Expired', value: expired, color: 'text-zinc-400' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1"
        >
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-wide">
            {stat.label}
          </span>
          <span className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default StatsBar