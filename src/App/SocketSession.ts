import { Types } from "mongoose";
import { Socket } from "socket.io";
import { AppLogger, Logger } from "../App/Logger";

class SocketSession {
  protected static socketSessions: { [socketId: string]: SocketSession } = {};

  protected userId: Types.ObjectId | null = null;

  protected socket: Socket;

  protected sessionId: Types.ObjectId | null = null;

  public static getSocketSessionById(socketId: string) {
    return this.socketSessions[socketId];
  }

  public static getSocketSessionsFromUserId(userId: Types.ObjectId) {
    return Object.values(this.socketSessions).filter(
      (s) => s.userId === userId
    );
  }

  public static getSocketSessionsFromSessionId(sessionId: Types.ObjectId) {
    return Object.values(this.socketSessions).filter(
      (s) => s.sessionId === sessionId
    );
  }

  public get getUserId() {
    return this.userId;
  }

  public get getSessionId() {
    return this.sessionId;
  }

  constructor(socket: Socket) {
    this.socket = socket;
    SocketSession.socketSessions[this.socket.id] = this;

    AppLogger.log(`${this.socket.id} has connected!`);

    this.handleConnection();

    this.socket.once("disconnect", async () => {
      delete SocketSession.socketSessions[this.socket.id];
      await this.handleDisconnect();
      AppLogger.log(`${this.socket.id} has disconnected!`);
    });
  }

  protected async handleConnection() {
    //
  }

  protected async handleDisconnect() {
    //
  }

  public forceDisconnect(reason?: string) {
    this.socket.emit("force_disconnect", reason);
    this.socket.disconnect(true);
  }
}

export { SocketSession };

// https://github.com/Konijima/ts-node-web-server/blob/master/src/App/SocketSession.ts
// https://ultimatecourses.com/blog/setup-typescript-nodejs-express
