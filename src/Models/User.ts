import { Schema, Model, model } from "mongoose";
import { compare, hash } from "bcryptjs";
import {
  ExtendedUserDocument,
  ExtendedUserSchemaPlugin,
} from "../Database/Plugins/ExtendedUserSchema";
import { Session, ISessionDocument } from "./Session";

// Define user roles
enum UserRoles {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

// Properties Interface
interface IUser {
  username: string;
  email: string;
  password: string;
  role: UserRoles;
  registeredDate: Date;
}

// Methods Interface
interface IUserDocument extends IUser, ExtendedUserDocument {
  /**
   * Compare a raw password with the user hashed password
   */
  comparePassword: (rawPassword: string) => Promise<boolean>;
}

// Statics Interface
interface IUserModel extends Model<IUserDocument> {
  /**
   * Create a session for a user
   * @param username can be a email too
   * @throws `user_not_found` if no user found with the username or email
   * @throws `invalid_credentials` if the password do not match
   * @returns Return the user document & session document
   */
  Login: (
    username: string,
    password: string
  ) => { user: IUserDocument; session: "" };

  /**
   * Create a new user
   * @param createSession if true it will automatically create a session
   * @returns Return the user and new session documents
   */
  Register: (
    username: string,
    email: string,
    password: string,
    createSession?: boolean
  ) => { user: IUserDocument; session: "" };
}

// Define schema constants
const SETTINGS = {
  USERNAME_LENGTH: { MIN: 3, MAX: 20 },
  PASSWORD_LENGTH: { MIN: 5, MAX: 30 },
  PASSWORD_SALT_LENGTH: 10,
};

// Schema Definition
const UserSchema: Schema<IUserDocument> = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "missing_username_field"],
    minlength: [SETTINGS.USERNAME_LENGTH.MIN, "username_too_short"],
    maxlength: [SETTINGS.USERNAME_LENGTH.MAX, "username_too_log"],
    match: [/^[a-z0-9]+$/i, "username_invalid_character"],
  },
  email: {
    type: String,
    select: false, // Email must be explictly selected to prevent leak
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, "missing_email_field"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "email_invalid_format",
    ],
  },
  password: {
    type: String,
    select: false, // Password must be explictly selected to prevent leak
    required: [true, "missing_password_field"],
    minlength: [SETTINGS.PASSWORD_LENGTH.MIN, "password_too_short"],
    maxlength: [SETTINGS.PASSWORD_LENGTH.MAX, "password_too_long"],
  },
  role: {
    type: String,
    enum: Object.values(UserRoles),
    default: UserRoles.USER,
  },
  registeredDate: {
    type: Date,
    default: Date.now,
  },
});

// PLUGINS
UserSchema.plugin(ExtendedUserSchemaPlugin);

// HOOKS
UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await hash(this.password, SETTINGS.PASSWORD_SALT_LENGTH);
    }

    next();
  } catch (error) {
    // @ts-ignore
    next(error);
  }
});

// EVENTS

// METHODS
UserSchema.method(
  "comparePassword",
  async function (this: IUserDocument, rawPassword: string) {
    return await compare(rawPassword, this.password);
  }
);

// STATICS
UserSchema.static(
  "Login",
  // @ts-ignore
  async function (this: IUserModel, username: string, password: string) {
    let user = await this.findOne({ username }).select("+email +password");

    if (!user) {
      await this.findOne({ email: username }).select("+email +password");
    }

    if (!user) {
      throw new Error("user_not_found");
    }

    if ((await user.comparePassword(password)) === false) {
      throw new Error("invalid_credentials");
    }

    const session = await new Session({ user: user._id });
    session.save();
    return { user, session };
  }
);

UserSchema.static(
  "Register",
  // @ts-ignore
  async function (
    this: IUserModel,
    username: string,
    email: string,
    password: string,
    createSession: boolean = false
  ) {
    const user = new User({ username, email, password });
    let session: ISessionDocument | null = null;

    if (createSession === true) {
      session = new Session({ user: user._id });
      await session.save();
    }

    return { user, session };
  }
);

// Schema Object
const User = model<IUserDocument, IUserModel>("User", UserSchema);

export { UserRoles, User, IUserDocument };
