export const validateSignalForm = (form) => {
  const errors = {}

  if (!form.symbol) errors.symbol = 'Trading pair is required'
  if (!form.direction) errors.direction = 'Direction is required'
  if (!form.entry_price) errors.entry_price = 'Entry price is required'
  if (!form.stop_loss) errors.stop_loss = 'Stop loss is required'
  if (!form.target_price) errors.target_price = 'Target price is required'
  if (!form.entry_time) errors.entry_time = 'Entry time is required'
  if (!form.expiry_time) errors.expiry_time = 'Expiry time is required'

  const entry = parseFloat(form.entry_price)
  const stop = parseFloat(form.stop_loss)
  const target = parseFloat(form.target_price)

  if (form.entry_price && isNaN(entry)) errors.entry_price = 'Must be a valid number'
  if (form.stop_loss && isNaN(stop)) errors.stop_loss = 'Must be a valid number'
  if (form.target_price && isNaN(target)) errors.target_price = 'Must be a valid number'

  if (!isNaN(entry) && !isNaN(stop) && !isNaN(target)) {
    if (form.direction === 'BUY') {
      if (stop >= entry) errors.stop_loss = 'Stop loss must be below entry price for BUY'
      if (target <= entry) errors.target_price = 'Target must be above entry price for BUY'
    }
    if (form.direction === 'SELL') {
      if (stop <= entry) errors.stop_loss = 'Stop loss must be above entry price for SELL'
      if (target >= entry) errors.target_price = 'Target must be below entry price for SELL'
    }
  }

  if (form.entry_time && form.expiry_time) {
    if (new Date(form.expiry_time) <= new Date(form.entry_time)) {
      errors.expiry_time = 'Expiry must be after entry time'
    }
  }

  return errors
}