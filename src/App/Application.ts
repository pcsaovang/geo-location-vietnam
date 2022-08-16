import http from "http";
import express from "express";
import io from "socket.io";
import Database from "../Database/Database";
import { AppLogger } from "./Logger";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import AuthRouter from "./Routers/AuthRouter";
import FileTransferRouter from "./Routers/FileTransferRouter";
import StaticRouter from "./Routers/StaticRouter";
import WebRouter from "./Routers/WebRouter";
import { SocketSession } from "./SocketSession";
import ProvinceRouter from "./Routers/ProvinceRouter";
import DistrictRouter from "./Routers/DistrictRouter";
import WardRouter from "./Routers/WardRouter";

class Application {
  private expressApp: express.Application;

  private httpServer: http.Server;

  private socketServer: io.Server;

  public get getExpressApp() {
    return this.expressApp;
  }

  public get getHttpServer() {
    return this.httpServer;
  }

  public get getSocketServer() {
    return this.socketServer;
  }

  constructor() {
    this.expressApp = express();
    this.httpServer = http.createServer(this.expressApp);
    this.socketServer = new io.Server(this.httpServer);

    // Add Middlewares
    this.expressApp.use(cors());
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use(compression());

    // Add Routers
    this.expressApp.use(AuthRouter);
    this.expressApp.use(FileTransferRouter);
    this.expressApp.use(ProvinceRouter);
    this.expressApp.use(DistrictRouter);
    this.expressApp.use(WardRouter);
    this.expressApp.use(StaticRouter);
    this.expressApp.use(WebRouter);

    // Create socket session on connection
    this.socketServer.on("connection", (socket) => new SocketSession(socket));

    // Connect to MongoDB then start the web server
    Database.Connect().then(() => {
      this.httpServer.listen(Number(process.env.PORT), process.env.HOST, () => {
        AppLogger.log(
          `Application running at http://${process.env.HOST}:${process.env.PORT}`
        );
      });
    });
  }
}

export default new Application();
