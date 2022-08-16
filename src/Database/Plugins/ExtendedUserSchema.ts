import { Schema } from "mongoose";
import { ExtendedDocument } from "../Plugins/ExtendedSchema";

interface ExtendedUserDocument extends ExtendedDocument {
  /**
   * Check if the user password was changed in post save hook
   */
  wasPasswordChanged: boolean;
}

function ExtendedUserSchemaPlugin(schema: Schema, options: any) {
  schema
    .virtual("wasPasswordChanged")
    .get(function () {
      return this._wasPasswordChanged;
    })
    .set(function (value: boolean) {
      this._wasPasswordChanged = value;
    });

  schema.pre("save", function (next) {
    this.wasPasswordChanged = this.isModified("password");
    next();
  });

  schema.post("save", function (user: ExtendedUserDocument) {
    if (user.wasPasswordChanged) {
      schema.emit("OnPasswordChanged", user);
    }
  });
}

export { ExtendedUserSchemaPlugin, ExtendedUserDocument };
