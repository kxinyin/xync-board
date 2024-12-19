import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

const client = new MongoClient(uri, options);
let clientPromise;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global promise to avoid multiple connections
  // In hot reloading situations (when the page is reloaded during development)
  if (!global._clientPromise) {
    global._clientPromise = client.connect();
  }

  clientPromise = global._clientPromise;
} else {
  // In production, it's safe to create a new client on each request
  clientPromise = client.connect();

  // Gracefully close the connection when the app shuts down
  process.on("SIGINT", async () => {
    console.log("Shutting down MongoDB connection...");
    await client.close();
    process.exit(0); // Exit the process after closing the connection
  });
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db();
  return { client, db };
}
