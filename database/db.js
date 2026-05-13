import mongoose from "mongoose";

const connectDB = () => {
    const DB_URI = process.env.MONGODB_URI;

    mongoose.connect(DB_URI);

    mongoose.connection.on("connected", () => {
    console.log("mongodb connected successfully...");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });
}

export default connectDB;