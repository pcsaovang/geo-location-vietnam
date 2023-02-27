import express, { Router, Request, Response } from "express";
import wards from "../../data/wards.json";
import { District } from "../../Models/District";
import { Ward } from "../../Models/Ward";

const WardRouter = Router();

WardRouter.get(
  "/wards/import",
  async (request: Request, response: Response) => {
    try {
      const {
        query: { user, password },
      } = request;
      if (!user || !password) {
        response.json({ success: "failed" });
      }

      const districts = await District.find({});
      const districtObject = districts.reduce<Record<string, District>>(
        (prev, curr) => {
          return {
            ...prev,
            [curr.district_id]: curr,
          };
        },
        {}
      );

      const data = wards.map((ward) => ({
        ...ward,
        district_id: districtObject[ward.district_id]._id,
      }));

      await Ward.insertMany(data);

      response.json({ success: "ok" });
    } catch (error) {
      console.log("Migrate wards error", error);
      response.json({ success: "failed", error });
    }
  }
);

WardRouter.get(
  "/wards/:district_id",
  async (request: Request, response: Response) => {
    const wards = await Ward.find({ district_id: request.params.district_id });

    return response.json(wards);
  }
);

export default WardRouter;
