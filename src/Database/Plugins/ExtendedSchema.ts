import { Schema, Document } from "mongoose";

interface ExtendedDocument extends Document {
  /**
   * Check if the document is new in post save hook
   */
  wasNew: boolean;
  /**
   * Check if the document is modified in post save hook
   */
  wasModified: boolean;
}

/**
 * A mongoose plugin that add extended functionality such as
 * `wasNew` & `wasModified` access into post `save` hook.
 * Also add `OnCreated`, `OnUpdated` & `OnDeleted` event to any schema.
 */
function ExtendedSchemaPlugin(schema: Schema, options: any) {
  schema
    .virtual("wasNew")
    .get(function () {
      return this._wasNew;
    })
    .set(function (value: any) {
      this._wasNew = value;
    });

  schema
    .virtual("wasModified")
    .get(function () {
      return this._wasModified;
    })
    .set(function (value: any) {
      this._wasModified = value;
    });

  schema.pre("save", function (next) {
    this.wasNew = this.isNew;
    this.wasModified = this.isModified();
    next();
  });

  schema.post("save", function (doc: ExtendedDocument) {
    if (doc.wasNew) {
      schema.emit("OnCreated", doc);
    }

    if (!doc.wasNew && doc.wasModified) {
      schema.emit("OnUpdate", doc);
    }
  });

  schema.post("remove", function (doc: ExtendedDocument) {
    schema.emit("OnDelete", doc);
  });
}

export { ExtendedSchemaPlugin, ExtendedDocument };
