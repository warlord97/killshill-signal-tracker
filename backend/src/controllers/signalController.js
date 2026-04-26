import * as signalService from "../services/signalService.js";

export const createSignal = async (req, res, next) => {
  try {
    const {
      symbol,
      direction,
      entry_price,
      stop_loss,
      target_price,
      entry_time,
      expiry_time,
    } = req.body;

    // --- Validation ---
    if (
      !symbol ||
      !direction ||
      !entry_price ||
      !stop_loss ||
      !target_price ||
      !entry_time ||
      !expiry_time
    ) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    if (!["BUY", "SELL"].includes(direction)) {
      return res
        .status(400)
        .json({ success: false, error: "Direction must be BUY or SELL" });
    }

    const entry = parseFloat(entry_price);
    const stop = parseFloat(stop_loss);
    const target = parseFloat(target_price);
    const entryTime = new Date(entry_time);
    const expiryTime = new Date(expiry_time);
    const now = new Date();

    if (isNaN(entry) || isNaN(stop) || isNaN(target)) {
      return res
        .status(400)
        .json({ success: false, error: "Prices must be valid numbers" });
    }

    if (direction === "BUY") {
      if (stop >= entry)
        return res.status(400).json({
          success: false,
          error: "Stop loss must be below entry price for BUY",
        });
      if (target <= entry)
        return res.status(400).json({
          success: false,
          error: "Target price must be above entry price for BUY",
        });
    }

    if (direction === "SELL") {
      if (stop <= entry)
        return res.status(400).json({
          success: false,
          error: "Stop loss must be above entry price for SELL",
        });
      if (target >= entry)
        return res.status(400).json({
          success: false,
          error: "Target price must be below entry price for SELL",
        });
    }

    if (expiryTime <= entryTime) {
      return res.status(400).json({
        success: false,
        error: "Expiry time must be after entry time",
      });
    }

    // Entry can be up to 24hrs in the past per spec
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (entryTime < twentyFourHoursAgo) {
      return res.status(400).json({
        success: false,
        error: "Entry time cannot be more than 24 hours in the past",
      });
    }

    const signal = await signalService.createSignal(req.body);
    return res.status(201).json({ success: true, data: signal });
  } catch (err) {
    next(err);
  }
};

export const getAllSignals = async (req, res, next) => {
  try {
    const signals = await signalService.getAllSignals();
    return res.status(200).json({ success: true, data: signals });
  } catch (err) {
    next(err);
  }
};

export const getSignalById = async (req, res, next) => {
  try {
    const signal = await signalService.getSignalById(req.params.id);
    if (!signal) {
      return res
        .status(404)
        .json({ success: false, error: "Signal not found" });
    }
    return res.status(200).json({ success: true, data: signal });
  } catch (err) {
    next(err);
  }
};

export const deleteSignal = async (req, res, next) => {
  try {
    await signalService.deleteSignal(req.params.id);
    return res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, error: "Signal not found" });
    }
    next(err);
  }
};

export const getLiveStatus = async (req, res, next) => {
  try {
    const status = await signalService.getLiveStatus(req.params.id);
    if (!status) {
      return res
        .status(404)
        .json({ success: false, error: "Signal not found" });
    }
    return res.status(200).json({ success: true, data: status });
  } catch (err) {
    next(err);
  }
};
