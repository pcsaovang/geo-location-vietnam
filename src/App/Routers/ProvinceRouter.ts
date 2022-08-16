import express, { Router, Request, Response } from "express";
import provinces from "../../data/province.json";
import { Province } from "../../Models/Province";

const ProvinceRouter = Router();

ProvinceRouter.get(
  "/provinces/import",
  (request: Request, response: Response) => {
    const { query } = request;
    if (query.user === "admin" && query.password === "admin123") {
      Province.insertMany(provinces)
        .then(() => {
          console.log("Migrate provinces ok");
        })
        .catch((error) => {
          console.log("Migrate provinces error", error);
        });
      response.json({ success: "ok" });
    } else {
      response.json({ success: "failed" });
    }
  }
);

ProvinceRouter.get(
  "/provinces",
  async (request: Request, response: Response) => {
    const provinces = await Province.find();
    return response.json(provinces);
  }
);

ProvinceRouter.get(
  "/provinces/:province_id",
  async (request: Request, response: Response) => {
    const province = await Province.findOne({
      province_id: request.params.province_id,
    });
    return response.json(province);
  }
);

export default ProvinceRouter;
