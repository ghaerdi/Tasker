import User from "../models/user";
import JWT from "jsonwebtoken";
import { Request, Response } from "express";

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!(username && email && password)) {
    res.status(400)
    res.json({ error: true, msg: "all fields requires" });
    return;
  }

  if (!(username.length >= 3)) {
    res.status(400)
    res.json({ error: true, msg: "usernme need min 3 characters" });
    return;
  }

  if (!username.match(/^[a-zA-Z0-9]+$/)) {
    res.status(400);
    res.json({
      error: true,
      msg: "username only allow a-z, A-Z and 0-9 characters",
    });
    return;
  }

  if (!email.match(/\S+@\S+\.\S+/)) {
    res.status(400)
    res.json({ error: true, msg: "invalid email format (example@email.com)." });
    return;
  }

  if (!(password.length >= 6)) {
    res.status(400)
    res.json({ error: true, msg: "password need min 6 characters" });
  }

  try {
    const existUser = await User.findOne({ username });

    if (existUser) {
      res.status(400)
      res.json({ error: true, msg: "username already exist" });
    }

    const newUser = new User({
      ...req.body,
    });

    await newUser.save();
    res.json({ error: false, msg: "user created" });

  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ error: true, msg: "unknow error by creating user" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(400);
      res.json({ error: true, msg: "user not found" });
    }

    if (!await user.comparePassword(password)) {
      res.status(400);
      res.json({ error: true, msg: "invalid password" });
    }

    const accessToken = user.generateJWT();
    const refreshToken = user.refreshJWT();
    res.cookie("access_token", accessToken, { httpOnly: true });
    res.cookie("refresh_token", refreshToken, { httpOnly: true });
    res.json({ error: false, msg: "user logged" });
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ error: true, msg: "error by login" });
  }
}

export async function refreshTokens(req: Request, res: Response) {
  let decodedJWT;
  if (!req.cookies["refresh_token"]) {
    res.status(401);
    res.json({ error: true, msg: "not refresh token provided" });
    return;
  }

  try {
    decodedJWT = JWT.verify(req.cookies["refresh_token"], process.env.REFRESH_JWT || "secret")
  } catch {
    res.status(400)
    res.json({ error: true, msg: "invalid refresh token" })
    return
  }
  const user = await User.findOne({ _id: decodedJWT?.sub })

  if (!user) {
    res.status(400);
    res.json({ error: true, msg: "user not found, can't refresh tokens" });
  }

  const accessToken = user.generateJWT();
  const refresToken = user.refreshJWT();
  res.cookie("access_token", accessToken, { httpOnly: true })
  res.cookie("refresh_token", refresToken, { httpOnly: true })
  res.json({ error: false, msg: "tokens refreshed" })
}


export function logout(_req: Request, res: Response) {
  res.clearCookie("access_token")
  res.clearCookie("refresh_token")
  res.json({ error: false, msg: "user logout" })
}