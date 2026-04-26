import SignalRow from './SignalRow'
import EmptyState from '../common/EmptyState'

const COLUMNS = [
  'Symbol', 'Entry Price', 'Target', 'Stop Loss',
  'Current Price', 'Status', 'ROI %', 'Expires In', ''
]

const SignalTable = ({ signals, onDelete, onCreateClick }) => {
  if (signals.length === 0) {
    return <EmptyState onCreateClick={onCreateClick} />
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-zinc-900/40">
          {signals.map((signal) => (
            <SignalRow
              key={signal.id}
              signal={signal}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SignalTable