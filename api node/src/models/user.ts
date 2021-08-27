import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

interface User extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    match: /^[a-zA-Z0-9]+$/,
  },
  email: {
    type: String,
    required: true,
    match: /\S+@\S+\.\S+/,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
}, { timestamps: true, versionKey: false });

UserSchema.pre<User>("save", async function (next: Function) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const hashPassword = await bcrypt.hash(this.password, 13);
    this.password = hashPassword;
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (password) {
  try {
    const matchPassword = await bcrypt.compare(password, this.password);
    return !matchPassword ? matchPassword : this;
  } catch (err) {
    console.error(err);
    return err;
  }
};

UserSchema.methods.generateJWT = function () {
  return JWT.sign(
    {
      username: this.username,
      sub: this._id,
    },
    process.env.SECRET_JWT || "secret",
    { expiresIn: "15m" },
  );
};

UserSchema.methods.refreshJWT = function () {
  return JWT.sign(
    {
      username: this.username,
      sub: this._id,
    },
    process.env.REFRESH_JWT || "secret",
    { expiresIn: "15d" },
  );
};

export default model("User", UserSchema);
