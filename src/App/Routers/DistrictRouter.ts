import express, { Router, Request, Response } from "express";
import districts from "../../data/districts.json";
import { District } from "../../Models/District";
import { Province } from "../../Models/Province";

const DistrictRouter = Router();

DistrictRouter.get(
  "/districts/import",
  async (request: Request, response: Response) => {
    try {
      const {
        query: { user, password },
      } = request;
      if (!user || !password) {
        response.json({ success: "failed" });
      }

      const provinces = await Province.find({});
      const provinceObject = provinces.reduce<Record<string, Province>>(
        (prev, curr) => {
          return {
            ...prev,
            [curr.province_id]: curr,
          };
        },
        {}
      );

      const data = districts.map((district) => ({
        ...district,
        province_id: provinceObject[district.province_id]._id,
      }));

      await District.insertMany(data);

      response.json({ success: "ok" });
    } catch (error) {
      console.log("Migrate districts error", error);
      response.json({ success: "failed", error });
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
