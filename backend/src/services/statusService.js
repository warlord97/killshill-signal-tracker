// Evaluate what status a signal should have given current price
export const evaluateStatus = (signal, currentPrice) => {
  const now = new Date();

  // Resolved signals never change — critical rule
  if (signal.status === "TARGET_HIT") return "TARGET_HIT";
  if (signal.status === "STOPLOSS_HIT") return "STOPLOSS_HIT";
  if (signal.status === "EXPIRED") return "EXPIRED";

  // Check expiry first
  if (now >= new Date(signal.expiry_time)) return "EXPIRED";

  // Signal not active yet
  if (now < new Date(signal.entry_time)) return "OPEN";

  const entry = parseFloat(signal.entry_price);
  const target = parseFloat(signal.target_price);
  const stopLoss = parseFloat(signal.stop_loss);
  const current = parseFloat(currentPrice);

  // BUY logic
  if (signal.direction === "BUY") {
    if (current >= target) return "TARGET_HIT";
    if (current <= stopLoss) return "STOPLOSS_HIT";
  }

  // SELL logic
  if (signal.direction === "SELL") {
    if (current <= target) return "TARGET_HIT";
    if (current >= stopLoss) return "STOPLOSS_HIT";
  }

  return "OPEN";
};

// Compute ROI based on direction
export const computeROI = (direction, entryPrice, currentPrice) => {
  if (!currentPrice) return null;

  const entry = parseFloat(entryPrice);
  const current = parseFloat(currentPrice);

  if (direction === "BUY") {
    return +(((current - entry) / entry) * 100).toFixed(2);
  }

  if (direction === "SELL") {
    return +(((entry - current) / entry) * 100).toFixed(2);
  }

  return null;
};
