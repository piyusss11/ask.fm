import mongoose from "mongoose";

type connectionObject = {
  isConnecteed?: number;
};
const connection: connectionObject = {};

export default async function connectDb(): Promise<void> {
  try {
    // checking if db has already made a connection
    if (connection.isConnecteed) {
      console.log("DB is already connected");
      return;
    }
    const db = await mongoose.connect(
      (process.env.MONGO_URI as string) || ""
    );
    // console.log(db);
    connection.isConnecteed = db.connections[0].readyState;
    console.log("DB connected Succesfully");
  } catch (error) {
    console.log("Database connection failed:", error);
    process.exit(1);
  }
}
