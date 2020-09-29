const User = require("../models/user");
const JWT = require("jsonwebtoken")

async function register(req, res) {
  const { username, email, password } = req.body;

  if (!(username && email && password))
    return res.status(400).json({ error: true, msg: "all fields requires" });

  if (!(username.length >= 3))
    return res
      .status(400)
      .json({ error: true, msg: "usernme need min 3 characters" });

  if (!username.match(/^[a-zA-Z0-9]+$/))
    return res.status(400).json({
      error: true,
      msg: "username only allow a-z, A-Z and 0-9 characters",
    });

  if (!email.match(/\S+@\S+\.\S+/))
    return res
      .status(400)
      .json({ error: true, msg: "invalid email format (example@email.com)." });

  if (!(password.length >= 6))
    return res
      .status(400)
      .json({ error: true, msg: "password need min 6 characters" });

  try {
    const existUser = await User.findOne({ username });

    if (existUser)
      return res
        .status(400)
        .json({ error: true, msg: "username already exist" });

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

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user)
      return res.status(400).json({ error: true, msg: "user not found" });

    if (!await user.comparePassword(password))
      return res.status(400).json({ error: true, msg: "invalid password" });

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

async function refreshTokens(req, res) {
  if (!req.cookies["refresh_token"])
    return res.status(401).json({ error: true, msg: "not refresh token provided" })

  try {
    var decodedJWT = JWT.verify(req.cookies["refresh_token"], process.env.REFRESH_JWT || "secret")
  } catch {
    res.status(400)
    res.json({ error: true, msg: "invalid refresh token" })
    return
  }
  const user = await User.findOne({ _id: decodedJWT.sub })

  if (!user)
    return res.status(400).json({ error: true, msg: "user not found, can't refresh tokens" })

  const accessToken = user.generateJWT();
  const refresToken = user.refreshJWT();
  res.cookie("access_token", accessToken, { httpOnly: true })
  res.cookie("refresh_token", refresToken, { httpOnly: true })
  res.json({ error: false, msg: "tokens refreshed" })
}


function logout(req, res) {
  res.clearCookie("access_token")
  res.clearCookie("refresh_token")
  res.json({ error: false, msg: "user logout" })
}

module.exports = { register, login, refreshTokens, logout };
