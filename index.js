import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import "dotenv/config";
import { createRemoteJWKSet, jwtVerify } from "jose";
const app = express();
const PORT = process.env.PORT || 8000;

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

app.use(cors());
app.use(express.json());

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("booknook");
const bookCollection = db.collection("books");
const borrowCollection = db.collection("borrows");

const LOAN_DAYS = 7;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Unauthorized!" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ msg: "Unauthorized!" });
  }

  const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
  );

  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.decoded = payload;
    next();
  } catch (error) {
    return res.status(401).send({ msg: "Invalid token!" });
  }
};

// public, also used by home (?limit=6) and my books (?email=)
app.get("/books", async (req, res) => {
  const { limit, email, category } = req.query;

  const query = {};
  if (email) query.addedByEmail = email;
  if (category && category !== "All") query.category = category;

  const cursor = bookCollection.find(query).sort({ createdAt: -1 });
  if (limit) cursor.limit(Number(limit));

  const result = await cursor.toArray();
  res.send(result);
});

app.get("/books/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const result = await bookCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
});

app.post("/books", verifyToken, async (req, res) => {
  const data = req.body;
  const result = await bookCollection.insertOne({
    ...data,
    totalCopies: Number(data.totalCopies),
    availableCopies: Number(data.totalCopies),
    createdAt: new Date(),
  });
  res.send(result);
});

app.patch("/books/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { _id, availableCopies, createdAt, ...data } = req.body;

  const book = await bookCollection.findOne({ _id: new ObjectId(id) });
  const borrowed = book.totalCopies - book.availableCopies;
  const total = Number(data.totalCopies);

  if (total < borrowed) {
    return res
      .status(400)
      .send({ msg: `${borrowed} copies are still out on loan.` });
  }

  const result = await bookCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, totalCopies: total, availableCopies: total - borrowed } },
  );
  res.json(result);
});

app.delete("/books/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const book = await bookCollection.findOne({ _id: new ObjectId(id) });
  if (book.totalCopies !== book.availableCopies) {
    return res
      .status(400)
      .send({ msg: "This book is borrowed right now, so it cannot be deleted." });
  }

  const result = await bookCollection.deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

app.get("/", (req, res) => {
  res.send({ message: "BookNook server is running fine!" });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

export default app;
