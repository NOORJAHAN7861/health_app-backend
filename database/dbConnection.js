import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI || "mongodb+srv://noorjahanpp786:noorjahanpp786@cluster0.ep7hefq.mongodb.net/?appName=Cluster0")
    .then(() => {
      console.log("Connected to database ");
    })
    .catch((err) => {
      console.log("Some error occured while connecting to database:", err);
    });
};
