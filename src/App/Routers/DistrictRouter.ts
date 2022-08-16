import express, { Router, Request, Response } from "express";
import districts from "../../data/districts.json";
import { District } from "../../Models/District";

const DistrictRouter = Router();

DistrictRouter.get(
  "/districts/import",
  (request: Request, response: Response) => {
    const { query } = request;
    if (query.user === "admin" && query.password === "admin123") {
      District.insertMany(districts)
        .then(() => {
          console.log("Migrate districts ok");
        })
        .catch((error) => {
          console.log("Migrate districts error", error);
        });
      response.json({ success: "ok" });
    } else {
      response.json({ success: "failed" });
    }
  }
);

DistrictRouter.get(
  "/districts/:province_id",
  async (request: Request, response: Response) => {
    const districts = await District.find({
      province_id: request.params.province_id,
    });
    return response.json(districts);
  }
);

export default DistrictRouter;
