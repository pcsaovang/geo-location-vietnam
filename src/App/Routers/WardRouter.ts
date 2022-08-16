import express, { Router, Request, Response } from "express";
import wards from "../../data/wards.json";
import { Ward } from "../../Models/Ward";

const WardRouter = Router();

WardRouter.get("/wards/import", (request: Request, response: Response) => {
  const { query } = request;
  if (query.user === "admin" && query.password === "admin123") {
    Ward.insertMany(wards)
      .then(() => {
        console.log("Migrate wards ok");
      })
      .catch((error) => {
        console.log("Migrate wards error", error);
      });
    response.json({ success: "ok" });
  } else {
    response.json({ success: "failed" });
  }
});

WardRouter.get(
  "/wards/:district_id",
  async (request: Request, response: Response) => {
    const wards = await Ward.find({ district_id: request.params.district_id });

    return response.json(wards);
  }
);

export default WardRouter;
