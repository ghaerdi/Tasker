const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const User = require("../models/user")

const cookieExtractor = req =>
  req && req.cookies ? req.cookies["access_token"] : null

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.SECRET_JWT || "secret",
}

passport.use(new JwtStrategy(opts, async (payload, done) => {
  try {
    const match = await User.findOne(({ _id: payload.sub }))
    return match ? done(null, match) : done(null, false) 
  } catch (err) {
    return done(err, false)
  }
}))
