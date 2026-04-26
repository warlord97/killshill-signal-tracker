const STATUS_CONFIG = {
  OPEN: {
    label: 'Open',
    classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    dot: 'bg-blue-400 animate-pulse'
  },
  TARGET_HIT: {
    label: 'Target Hit',
    classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-400'
  },
  STOPLOSS_HIT: {
    label: 'Stop Loss',
    classes: 'bg-red-500/10 text-red-400 border border-red-500/30',
    dot: 'bg-red-400'
  },
  EXPIRED: {
    label: 'Expired',
    classes: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/30',
    dot: 'bg-zinc-400'
  }
}

const Badge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.OPEN

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

export default Badge