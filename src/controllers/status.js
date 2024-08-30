import express from "express";

import health from "../models/healthstatus.js";

const statusController = express.Router();

statusController.get("/status", async (_, res) => {
  const updatedAt = new Date().toISOString();
  const dbHealthInfo = await health.dbHealth();
  res.status(200).json({
    updated_at: updatedAt,
    database: dbHealthInfo,
  });
});

export default statusController;
