import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
  categories: {
    type: [String], // List of allowed categories
    required: true,
    default: [],
  },
  limits: {
    type: Map,
    of: Number,
    default: {},
    set: (value) => {
      // Convert plain object to Map
      if (value instanceof Map) return value;
      return new Map(Object.entries(value));
    },
  },
});

const SystemSettings = mongoose.model("SystemSettings", systemSettingsSchema);

export default SystemSettings;
