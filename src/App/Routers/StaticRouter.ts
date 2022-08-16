import { resolve } from "path";
import express, { Router } from "express";

const StaticRouter = Router();

const staticPath = "../../../static/";

StaticRouter.use("/static", express.static(resolve(__dirname, staticPath)));

export default StaticRouter;
