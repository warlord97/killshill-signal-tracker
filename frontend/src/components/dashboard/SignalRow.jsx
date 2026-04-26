import Badge from '../common/Badge'
import useCountdown from '../../hooks/useCountdown'
import { formatPrice, formatROI, formatDate } from '../../utils/formatters'

const SignalRow = ({ signal, onDelete }) => {
  const timeLeft = useCountdown(signal.expiry_time)
  const isResolved = signal.status !== 'OPEN'
  const roi = signal.roi

  const roiColor = roi === null ? 'text-zinc-400'
    : roi >= 0 ? 'text-emerald-400' : 'text-red-400'

  return (
    <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group">
      {/* Symbol + Direction */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-zinc-100 font-semibold text-sm">{signal.symbol}</span>
          <span className={`text-xs font-medium ${signal.direction === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
            {signal.direction}
          </span>
        </div>
      </td>

      {/* Entry Price */}
      <td className="px-4 py-3 whitespace-nowrap text-zinc-300 text-sm">
        ${formatPrice(signal.entry_price)}
      </td>

      {/* Target */}
      <td className="px-4 py-3 whitespace-nowrap text-emerald-400 text-sm">
        ${formatPrice(signal.target_price)}
      </td>

      {/* Stop Loss */}
      <td className="px-4 py-3 whitespace-nowrap text-red-400 text-sm">
        ${formatPrice(signal.stop_loss)}
      </td>

      {/* Current Price */}
      <td className="px-4 py-3 whitespace-nowrap text-sm">
        {signal.current_price
          ? <span className="text-zinc-100 font-medium">${formatPrice(signal.current_price)}</span>
          : <span className="text-zinc-600">—</span>
        }
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <Badge status={signal.status} />
      </td>

      {/* ROI */}
      <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${roiColor}`}>
        {formatROI(roi)}
      </td>

      {/* Time Remaining */}
      <td className="px-4 py-3 whitespace-nowrap text-zinc-400 text-sm">
        {isResolved ? (
          <span className="text-zinc-600">—</span>
        ) : (
          <span>{timeLeft}</span>
        )}
      </td>

      {/* Delete */}
      <td className="px-4 py-3 whitespace-nowrap">
        <button
          onClick={() => onDelete(signal.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}

export default SignalRow