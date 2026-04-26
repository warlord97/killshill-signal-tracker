import { useState } from 'react'
import FormField from './FormField'
import { validateSignalForm } from '../../utils/validators'
import { createSignal } from '../../api/signalApi'
import { TRADING_PAIRS } from '../../constants'

const INITIAL_FORM = {
  symbol: '',
  direction: '',
  entry_price: '',
  stop_loss: '',
  target_price: '',
  entry_time: '',
  expiry_time: ''
}

const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
const selectClass = `${inputClass} cursor-pointer`
const errorInputClass = "border-red-500/50 focus:border-red-500"

const SignalForm = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError(null)

    const validationErrors = validateSignalForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setSubmitting(true)
      await createSignal({
        ...form,
        entry_price: parseFloat(form.entry_price),
        stop_loss: parseFloat(form.stop_loss),
        target_price: parseFloat(form.target_price)
      })
      setForm(INITIAL_FORM)
      setErrors({})
      onSuccess()
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong. Please try again.'
      setServerError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Server Error */}
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      {/* Row 1 — Symbol + Direction */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Trading Pair" error={errors.symbol} required>
          <select
            name="symbol"
            value={form.symbol}
            onChange={handleChange}
            className={`${selectClass} ${errors.symbol ? errorInputClass : ''}`}
          >
            <option value="">Select pair</option>
            {TRADING_PAIRS.map(pair => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Direction" error={errors.direction} required>
          <div className="grid grid-cols-2 gap-2">
            {['BUY', 'SELL'].map(dir => (
              <button
                key={dir}
                type="button"
                onClick={() => {
                  setForm(prev => ({ ...prev, direction: dir }))
                  if (errors.direction) setErrors(prev => ({ ...prev, direction: undefined }))
                }}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                  form.direction === dir
                    ? dir === 'BUY'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {dir}
              </button>
            ))}
          </div>
          {errors.direction && (
            <p className="text-red-400 text-xs flex items-center gap-1 mt-1">
              <span>⚠</span> {errors.direction}
            </p>
          )}
        </FormField>
      </div>

      {/* Row 2 — Prices */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Entry Price" error={errors.entry_price} required>
          <input
            type="number"
            name="entry_price"
            value={form.entry_price}
            onChange={handleChange}
            placeholder="90000"
            step="any"
            className={`${inputClass} ${errors.entry_price ? errorInputClass : ''}`}
          />
        </FormField>

        <FormField label="Stop Loss" error={errors.stop_loss} required>
          <input
            type="number"
            name="stop_loss"
            value={form.stop_loss}
            onChange={handleChange}
            placeholder="85000"
            step="any"
            className={`${inputClass} ${errors.stop_loss ? errorInputClass : ''}`}
          />
        </FormField>

        <FormField label="Target Price" error={errors.target_price} required>
          <input
            type="number"
            name="target_price"
            value={form.target_price}
            onChange={handleChange}
            placeholder="95000"
            step="any"
            className={`${inputClass} ${errors.target_price ? errorInputClass : ''}`}
          />
        </FormField>
      </div>

      {/* Row 3 — Times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Entry Date & Time" error={errors.entry_time} required>
          <input
            type="datetime-local"
            name="entry_time"
            value={form.entry_time}
            onChange={handleChange}
            className={`${inputClass} ${errors.entry_time ? errorInputClass : ''}`}
          />
        </FormField>

        <FormField label="Expiry Date & Time" error={errors.expiry_time} required>
          <input
            type="datetime-local"
            name="expiry_time"
            value={form.expiry_time}
            onChange={handleChange}
            className={`${inputClass} ${errors.expiry_time ? errorInputClass : ''}`}
          />
        </FormField>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-black font-semibold rounded-lg text-sm transition-colors"
        >
          {submitting ? 'Creating...' : 'Create Signal'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 sm:flex-none sm:px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg text-sm transition-colors border border-zinc-700"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default SignalForm