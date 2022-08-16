import { resolve } from "path";
import express, { Router, Request, Response } from "express";

const WebRouter = Router();

const webPath = "../../../web/dist/";

WebRouter.use("/", express.static(resolve(__dirname, webPath)));

WebRouter.get("/*", (request: Request, response: Response) => {
  response.sendFile(resolve(__dirname, webPath, "index.html"));
});

export default WebRouter;
