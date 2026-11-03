import { MongoClient } from "mongodb";
import "dotenv/config";

const owner = {
  addedByName: "Shahriar Hasan",
  addedByEmail: "sr1842006@gmail.com",
};

const books = [
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Fiction",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    description:
      "A comedy of manners in which first impressions turn out to be the least reliable thing about anybody, and two people spend a long English season learning that about each other.",
    totalCopies: 4,
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    category: "Fiction",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439471-L.jpg",
    description:
      "A young scientist builds a living creature and then walks away from it, and the rest of the book is about what that refusal costs them both.",
    totalCopies: 2,
  },
  {
    title: "Dracula",
    author: "Bram Stoker",
    category: "Fiction",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg",
    description:
      "Told through letters and diary entries, which is what makes it feel less like a monster story and more like something that happened to people you know.",
    totalCopies: 3,
  },
  {
    title: "The Time Machine",
    author: "H. G. Wells",
    category: "Science",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439976-L.jpg",
    description:
      "A traveller goes forward in time and finds that comfort and curiosity both wear away, and brings back a flower as his only proof.",
    totalCopies: 3,
  },
  {
    title: "The Origin of Species",
    author: "Charles Darwin",
    category: "Science",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780140439120-L.jpg",
    description:
      "The book that changed how we read the natural world, written patiently and with far more hedging than people expect.",
    totalCopies: 2,
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    category: "History",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg",
    description:
      "Private notes a Roman emperor wrote to steady himself, never meant for anyone else to read, which is exactly why they still land.",
    totalCopies: 5,
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    category: "History",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780140439199-L.jpg",
    description:
      "Short, blunt chapters on winning without fighting, read these days by more managers than generals.",
    totalCopies: 4,
  },
  {
    title: "Treasure Island",
    author: "R. L. Stevenson",
    category: "Kids",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141321004-L.jpg",
    description:
      "A map, a one legged cook and a boy who grows up somewhere between the inn and the island. A soft paperback copy, read twice.",
    totalCopies: 3,
  },
  {
    title: "The Jungle Book",
    author: "Rudyard Kipling",
    category: "Kids",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141325293-L.jpg",
    description:
      "The stories are rougher than the cartoon, and better for it. Good for reading out loud a chapter at a time.",
    totalCopies: 4,
  },
  {
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    category: "Kids",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439761-L.jpg",
    description:
      "Nonsense written by a mathematician, which is why the nonsense holds together so neatly once you stop arguing with it.",
    totalCopies: 2,
  },
  {
    title: "The Wealth of Nations",
    author: "Adam Smith",
    category: "Others",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780140432084-L.jpg",
    description:
      "Long, but the famous parts are only a few pages, and they read very differently once you see what surrounds them.",
    totalCopies: 2,
  },
  {
    title: "Walden",
    author: "Henry David Thoreau",
    category: "Others",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780140390445-L.jpg",
    description:
      "Two years in a small cabin, written up as an argument for living deliberately. Worth borrowing when the week has been loud.",
    totalCopies: 3,
  },
];

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const collection = client.db("booknook").collection("books");

const now = Date.now();
const docs = books.map((book, index) => ({
  ...book,
  ...owner,
  availableCopies: book.totalCopies,
  createdAt: new Date(now - index * 60 * 60 * 1000),
}));

const result = await collection.insertMany(docs);
console.log(`Added ${result.insertedCount} books.`);
await client.close();
