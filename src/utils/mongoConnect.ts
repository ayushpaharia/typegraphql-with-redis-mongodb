import mongoose from "mongoose";
import config from "config";

export default async function mongoConnect() {
  try {
    mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log("✨ MongoDB connected");
  } catch (error) {
    console.log(error);
  }
}
