const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.epiqiul.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCollection = client.db("emaJohn").collection("products");

    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size);
      const query = {};
      const curosr = productCollection.find(query);
      const products = await curosr
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count, products });
    });

    app.post("/productsByIds", async (req, res) => {
      const ids = req.body;
      const objectId = ids.map((id) => ObjectId(id));
      const query = { _id: { $in: objectId } };
      const curosr = productCollection.find(query);
      const products = await curosr.toArray();
      res.send(products);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Ema-John Server is Running...");
});

app.listen(port, () => {
  console.log(`Ema-John Server is Running on ${port}`);
});
