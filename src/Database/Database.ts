import mongoose from "mongoose";
import { AppLogger } from "../App/Logger";
import { ExtendedSchemaPlugin } from "./Plugins/ExtendedSchema";
import FileStorage from "./FileStorage";
import { User, UserRoles } from "../Models/User";

const appDomain = process.env.DOMAIN || "domain.com";
const dbUrl = process.env.DATABASE || "mongodb://localhost:27017/geo-location-vietnam";

const DEFAULT_ADMIN = {
  username: "admin",
  email: `admin@${appDomain}`,
  password: "changeme",
  role: UserRoles.ADMIN,
};

class Database {
  // Add your global mongoose plugins here in the constructor
  constructor() {
    mongoose.plugin(ExtendedSchemaPlugin);
  }

  /**
   * Connect to MongoDB
   * @returns Promise<void>
   */
  public async Connect() {
    return new Promise((resolve, reject) => {
      mongoose
        .connect(dbUrl)
        .then(async () => {
          FileStorage.Connect(mongoose.connection);
          AppLogger.log("Database connection established!");
          await this.createDefaultAdminAccount();
          resolve({});
        })
        .catch((error) => {
          AppLogger.error(error);
          reject(error);
        });
    });
  }

  private async createDefaultAdminAccount() {
    let admin = await User.findOne({ role: UserRoles.ADMIN });

    if (!admin) {
      try {
        const adminUser = new User(DEFAULT_ADMIN);
        await adminUser.save();
        AppLogger.info("Admin account created: ", DEFAULT_ADMIN);
      } catch (error) {
        AppLogger.error(error);
      }
    } else {
      AppLogger.info("Admin account already exist, skipping...");
    }
  }
}

export default new Database();
