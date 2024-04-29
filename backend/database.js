require("dotenv").config();
const {MongoClient} = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";

const options = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

let client;
const connectToMongoDB = async () => {
  if (!client) {
    try {
      client = await MongoClient.connect(uri, options);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("ERROR", error);
    }
  }
  return client;
};

const getConnectedClient = () => client;

module.exports = {getConnectedClient, connectToMongoDB};
