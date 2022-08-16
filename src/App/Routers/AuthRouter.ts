import express, { Router, Request, Response } from "express";

const AuthRouter = Router();

AuthRouter.get("/login", (request: Request, response: Response) => {
  response.json({status: 'OK'})
});

AuthRouter.post("/register", (request: Request, response: Response) => {
  //
});

export default AuthRouter;
