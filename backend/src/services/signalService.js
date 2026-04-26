import prisma from "../config/db.js";
import { getPrice, getPrices } from "./binanceService.js";
import { evaluateStatus, computeROI } from "./statusService.js";

// Create a new signal
export const createSignal = async (data) => {
  const {
    symbol,
    direction,
    entry_price,
    stop_loss,
    target_price,
    entry_time,
    expiry_time,
  } = data;

  return await prisma.signal.create({
    data: {
      symbol: symbol.toUpperCase(),
      direction,
      entry_price,
      stop_loss,
      target_price,
      entry_time: new Date(entry_time),
      expiry_time: new Date(expiry_time),
      status: "OPEN",
    },
  });
};

// Get all signals with live prices + status evaluation
export const getAllSignals = async () => {
  const signals = await prisma.signal.findMany({
    orderBy: { created_at: "desc" },
  });

  // Only fetch prices for OPEN signals
  const openSignals = signals.filter((s) => s.status === "OPEN");
  const symbols = [...new Set(openSignals.map((s) => s.symbol))];

  // Batch fetch prices
  let priceMap = {};
  if (symbols.length > 0) {
    priceMap = await getPrices(symbols);
  }

  // Evaluate status + persist changes
  for (const signal of openSignals) {
    const currentPrice = priceMap[signal.symbol];
    const newStatus = evaluateStatus(signal, currentPrice);

    if (newStatus !== "OPEN") {
      const roi = computeROI(
        signal.direction,
        signal.entry_price,
        currentPrice,
      );
      await prisma.signal.update({
        where: { id: signal.id },
        data: { status: newStatus, realized_roi: roi },
      });
      // Update in-memory too so response is fresh
      signal.status = newStatus;
      signal.realized_roi = roi;
    }
  }

  // Enrich all signals with live data for response
  return signals.map((signal) => ({
    ...signal,
    current_price: priceMap[signal.symbol] ?? null,
    roi: signal.realized_roi
      ? parseFloat(signal.realized_roi)
      : computeROI(
          signal.direction,
          signal.entry_price,
          priceMap[signal.symbol],
        ),
  }));
};

// Get single signal by ID
export const getSignalById = async (id) => {
  const signal = await prisma.signal.findUnique({
    where: { id: parseInt(id) },
  });

  if (!signal) return null;

  if (signal.status === "OPEN") {
    const currentPrice = await getPrice(signal.symbol);
    const newStatus = evaluateStatus(signal, currentPrice);

    if (newStatus !== "OPEN") {
      const roi = computeROI(
        signal.direction,
        signal.entry_price,
        currentPrice,
      );
      await prisma.signal.update({
        where: { id: signal.id },
        data: { status: newStatus, realized_roi: roi },
      });
      signal.status = newStatus;
      signal.realized_roi = roi;
    }

    return {
      ...signal,
      current_price: currentPrice,
      roi: signal.realized_roi
        ? parseFloat(signal.realized_roi)
        : computeROI(signal.direction, signal.entry_price, currentPrice),
    };
  }

  return {
    ...signal,
    current_price: null,
    roi: signal.realized_roi ? parseFloat(signal.realized_roi) : null,
  };
};

// Delete signal
export const deleteSignal = async (id) => {
  return await prisma.signal.delete({
    where: { id: parseInt(id) },
  });
};

// Get live status only
export const getLiveStatus = async (id) => {
  const signal = await prisma.signal.findUnique({
    where: { id: parseInt(id) },
  });

  if (!signal) return null;

  const currentPrice =
    signal.status === "OPEN" ? await getPrice(signal.symbol) : null;

  return {
    id: signal.id,
    status: signal.status,
    current_price: currentPrice,
    roi: signal.realized_roi
      ? parseFloat(signal.realized_roi)
      : computeROI(signal.direction, signal.entry_price, currentPrice),
  };
};
