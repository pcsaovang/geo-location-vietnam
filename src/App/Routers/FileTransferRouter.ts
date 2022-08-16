import express, { Router, Request, Response } from "express";

const FileTransferRouter = Router();

const fileTypes = ["image", "audio", "video"];

FileTransferRouter.get(
  "/download/:type/:fileId",
  (request: Request, response: Response) => {
    const type = request.params.type;
    const fileId = request.params.fileId;
  }
);

FileTransferRouter.post(
  "/upload/:type",
  (request: Request, response: Response) => {
    const type = request.params.type;
  }
);

export default FileTransferRouter;
